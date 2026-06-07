"use client";

import { gsap } from "gsap";

/**
 * Moteur de vélocité partagé entre tous les marquees (porté de
 * reference/projet-canevas.html). Un seul écouteur de scroll alimente une
 * vélocité globale qui décroît une fois par frame via le ticker GSAP. Chaque
 * Marquee lit `extra` (boost de vélocité, plafonné) et `dir` (sens courant).
 */

let vel = 0;
let dir = -1;
let lastScroll = 0;
let extra = 0;
let started = false;

function onScroll() {
  const y = window.scrollY;
  const delta = y - lastScroll;
  lastScroll = y;
  vel += delta * 0.22;
  if (delta !== 0) dir = delta > 0 ? -1 : 1;
}

function decay() {
  vel *= 0.92;
  extra = Math.min(Math.abs(vel), 6);
}

export function startEngine() {
  if (started || typeof window === "undefined") return;
  started = true;
  lastScroll = window.scrollY;
  window.addEventListener("scroll", onScroll, { passive: true });
  gsap.ticker.add(decay);
}

export function getState() {
  return { extra, dir };
}
