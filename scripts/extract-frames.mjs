#!/usr/bin/env node
/**
 * Extrait un filmstrip pour chaque vidéo de public/lab/<slug>/*.
 * Un projet peut contenir plusieurs vidéos (ex : plusieurs plans/packshots),
 * déposées directement à la racine du dossier du projet.
 *
 * Pour chaque vidéo :
 *  - détecte un éventuel bandeau noir (letterboxing cinéma type 2.35:1
 *    intégré aux pixels) via ffmpeg cropdetect, et le retire des visuels
 *    générés (recadrage vertical uniquement — jamais horizontal, pour
 *    éviter de rogner du vrai contenu sur un faux positif ponctuel) ;
 *  - frame-01..NN.jpg (filmstrip, dont frame-01 sert de poster) ;
 *  - preview.webm : clip muet, léger, recadré, pour l'aperçu au survol
 *    de la grille /lab (évite de streamer le fichier source complet).
 * Sortie : public/lab/<slug>/frames/<nom-vidéo>/
 *
 * Usage : npm run lab:frames
 * Nombre de frames par vidéo : 8 par défaut, surchargeable par
 * public/lab/<slug>/meta.json → { "frames": 12 }
 */
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";

const LAB_DIR = path.join(process.cwd(), "public", "lab");
const DEFAULT_FRAME_COUNT = 8;
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".m4v"];

function getDurationSeconds(sourcePath) {
  // `-f null -` décode tout sans écrire de fichier ; qu'il réussisse ou
  // échoue, la durée annoncée par ffmpeg est dans stderr.
  const result = spawnSync(ffmpegPath, ["-i", sourcePath, "-f", "null", "-"], {
    encoding: "utf8",
  });
  const stderr = result.stderr ?? "";
  const match = stderr.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
  if (!match) return null;
  const [, h, m, s] = match;
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
}

/**
 * Détecte un bandeau noir vertical (haut/bas) constant sur plusieurs
 * frames échantillonnées en milieu de vidéo. Ignore toute composante
 * horizontale de cropdetect (pillarbox) : un faux positif ponctuel
 * (zone sombre dans le cadre) ne doit jamais rogner du contenu réel
 * sur les côtés — seul un bandeau haut/bas franc et répété est retenu.
 */
function detectVerticalCrop(videoPath, duration) {
  const start = Math.min(Math.max(duration * 0.2, 1), Math.max(duration - 2, 0));
  const result = spawnSync(
    ffmpegPath,
    [
      "-ss", String(start),
      "-i", videoPath,
      "-vf", "cropdetect=24:2:0",
      "-frames:v", "15",
      "-f", "null", "-",
    ],
    { encoding: "utf8" },
  );
  const stderr = result.stderr ?? "";
  const matches = [...stderr.matchAll(/crop=\d+:(\d+):\d+:(\d+)/g)];
  if (matches.length === 0) return null;

  const counts = new Map();
  for (const [, h, y] of matches) {
    const key = `${h}:${y}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const [best] = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const [h, y] = best[0].split(":").map(Number);
  return y > 0 ? { h, y } : null;
}

function cropFilter(crop) {
  return crop ? `crop=iw:${crop.h}:0:${crop.y},` : "";
}

function extractFrame(sourcePath, timestamp, outPath, crop) {
  execFileSync(
    ffmpegPath,
    [
      "-y",
      "-ss", String(timestamp),
      "-i", sourcePath,
      "-frames:v", "1",
      "-q:v", "3",
      "-vf", `${cropFilter(crop)}scale='min(720,iw)':-2`,
      outPath,
    ],
    { stdio: ["ignore", "ignore", "ignore"] },
  );
}

function extractPreview(sourcePath, duration, crop, outPath) {
  const len = Math.min(4, duration);
  execFileSync(
    ffmpegPath,
    [
      "-y",
      "-i", sourcePath,
      "-t", String(len),
      "-an",
      "-vf", `${cropFilter(crop)}scale=640:-2`,
      "-c:v", "libvpx",
      "-b:v", "800k",
      "-crf", "30",
      outPath,
    ],
    { stdio: ["ignore", "ignore", "ignore"] },
  );
}

function listVideoFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(
      (e) =>
        e.isFile() &&
        VIDEO_EXTENSIONS.includes(path.extname(e.name).toLowerCase()),
    )
    .map((e) => e.name)
    .sort();
}

function processVideo(videoPath, framesDir, frameCount, label) {
  const duration = getDurationSeconds(videoPath);
  if (!duration || duration <= 0) {
    console.warn(`[lab]   ${label} : durée illisible — ignorée`);
    return;
  }

  const crop = detectVerticalCrop(videoPath, duration);

  fs.mkdirSync(framesDir, { recursive: true });
  for (let i = 0; i < frameCount; i++) {
    const timestamp = (duration * (i + 0.5)) / frameCount;
    const outPath = path.join(
      framesDir,
      `frame-${String(i + 1).padStart(2, "0")}.jpg`,
    );
    extractFrame(videoPath, timestamp, outPath, crop);
  }
  extractPreview(videoPath, duration, crop, path.join(framesDir, "preview.webm"));

  const cropNote = crop ? `, bandeau retiré (h:${crop.h} y:${crop.y})` : "";
  console.log(`[lab]   ${label} : ${frameCount} frames (${duration.toFixed(1)}s)${cropNote}`);
}

function processProject(slug) {
  const dir = path.join(LAB_DIR, slug);
  const videoFiles = listVideoFiles(dir);

  if (videoFiles.length === 0) {
    console.warn(`[lab] ${slug} : pas de vidéo — ignoré`);
    return;
  }

  const metaPath = path.join(dir, "meta.json");
  const meta = fs.existsSync(metaPath)
    ? JSON.parse(fs.readFileSync(metaPath, "utf8"))
    : {};
  const frameCount = meta.frames ?? DEFAULT_FRAME_COUNT;

  const framesRoot = path.join(dir, "frames");
  fs.rmSync(framesRoot, { recursive: true, force: true });

  console.log(`[lab] ${slug} : ${videoFiles.length} vidéo(s)`);
  for (const file of videoFiles) {
    const stem = path.parse(file).name;
    processVideo(
      path.join(dir, file),
      path.join(framesRoot, stem),
      frameCount,
      file,
    );
  }
}

function main() {
  if (!fs.existsSync(LAB_DIR)) {
    console.log("[lab] public/lab introuvable — rien à faire");
    return;
  }
  const slugs = fs
    .readdirSync(LAB_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  if (slugs.length === 0) {
    console.log("[lab] aucun projet dans public/lab/<slug>/videos/");
    return;
  }

  for (const slug of slugs) processProject(slug);
}

main();
