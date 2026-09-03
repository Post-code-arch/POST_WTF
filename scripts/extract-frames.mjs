#!/usr/bin/env node
/**
 * Extrait un jeu de frames (filmstrip) pour chaque vidéo de public/lab/<slug>/source.*
 * Sortie : public/lab/<slug>/frames/frame-01.jpg … frame-NN.jpg
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
const SOURCE_EXTENSIONS = [".mp4", ".webm", ".mov", ".m4v"];

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

function findSourceFile(dir) {
  const entries = fs.readdirSync(dir);
  const name = entries.find(
    (f) => path.parse(f).name === "source" && SOURCE_EXTENSIONS.includes(path.extname(f).toLowerCase()),
  );
  return name ? path.join(dir, name) : null;
}

function processPiece(slug) {
  const dir = path.join(LAB_DIR, slug);
  const sourcePath = findSourceFile(dir);
  if (!sourcePath) {
    console.warn(`[lab] ${slug} : pas de fichier source.<ext> — ignoré`);
    return;
  }

  const metaPath = path.join(dir, "meta.json");
  const meta = fs.existsSync(metaPath)
    ? JSON.parse(fs.readFileSync(metaPath, "utf8"))
    : {};
  const frameCount = meta.frames ?? DEFAULT_FRAME_COUNT;

  const duration = getDurationSeconds(sourcePath);
  if (!duration || duration <= 0) {
    console.warn(`[lab] ${slug} : durée illisible — ignoré`);
    return;
  }

  const framesDir = path.join(dir, "frames");
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir, { recursive: true });

  for (let i = 0; i < frameCount; i++) {
    const timestamp = (duration * (i + 0.5)) / frameCount;
    const outPath = path.join(
      framesDir,
      `frame-${String(i + 1).padStart(2, "0")}.jpg`,
    );
    extractFrame(sourcePath, timestamp, outPath);
  }

  console.log(`[lab] ${slug} : ${frameCount} frames extraites (${duration.toFixed(1)}s)`);
}

function main() {
  if (!fs.existsSync(LAB_DIR)) {
    console.log("[lab] public/lab introuvable — rien à faire");
    return;
  }
  const pieces = fs
    .readdirSync(LAB_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  if (pieces.length === 0) {
    console.log("[lab] aucune vidéo dans public/lab/<slug>/source.<ext>");
    return;
  }

  for (const slug of pieces) processPiece(slug);
}

main();
