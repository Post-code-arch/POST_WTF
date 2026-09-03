#!/usr/bin/env node
/**
 * Extrait un filmstrip pour chaque vidéo de public/lab/<slug>/videos/*.
 * Un projet peut contenir plusieurs vidéos (ex : plusieurs plans/packshots).
 * Sortie : public/lab/<slug>/frames/<nom-vidéo>/frame-01.jpg … frame-NN.jpg
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

function extractFrame(sourcePath, timestamp, outPath) {
  execFileSync(
    ffmpegPath,
    [
      "-y",
      "-ss", String(timestamp),
      "-i", sourcePath,
      "-frames:v", "1",
      "-q:v", "3",
      "-vf", "scale='min(720,iw)':-2",
      outPath,
    ],
    { stdio: ["ignore", "ignore", "ignore"] },
  );
}

function listVideoFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => VIDEO_EXTENSIONS.includes(path.extname(f).toLowerCase()))
    .sort();
}

function processVideo(videoPath, framesDir, frameCount, label) {
  const duration = getDurationSeconds(videoPath);
  if (!duration || duration <= 0) {
    console.warn(`[lab]   ${label} : durée illisible — ignorée`);
    return;
  }

  fs.mkdirSync(framesDir, { recursive: true });
  for (let i = 0; i < frameCount; i++) {
    const timestamp = (duration * (i + 0.5)) / frameCount;
    const outPath = path.join(
      framesDir,
      `frame-${String(i + 1).padStart(2, "0")}.jpg`,
    );
    extractFrame(videoPath, timestamp, outPath);
  }
  console.log(`[lab]   ${label} : ${frameCount} frames (${duration.toFixed(1)}s)`);
}

function processProject(slug) {
  const dir = path.join(LAB_DIR, slug);
  const videosDir = path.join(dir, "videos");
  const videoFiles = listVideoFiles(videosDir);

  if (videoFiles.length === 0) {
    console.warn(`[lab] ${slug} : pas de vidéo dans videos/ — ignoré`);
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
      path.join(videosDir, file),
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
