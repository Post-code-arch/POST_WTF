"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import KinayaLogo from "@/components/KinayaLogo";
import styles from "./HeroLogoTravel.module.css";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (t: number) => Math.min(Math.max(t, 0), 1);
const ease = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Logo voyageur de l'accueil : le grand KINAYA du hero rétrécit et se cale
 * dans la nav au scroll. Instance fixe unique qui interpole entre le slot
 * hero (data-hero-logo) et le slot nav (data-nav-logo), puis passe le relais
 * au logo de la nav (qui gère l'adaptation de couleur via mix-blend).
 */
export default function HeroLogoTravel() {
  const ref = useRef<HTMLDivElement>(null);

  useIso(() => {
    const travel = ref.current;
    const heroSlot = document.querySelector<HTMLElement>("[data-hero-logo]");
    const heroSec = document.querySelector<HTMLElement>("[data-hero]");
    const navLogo = document.querySelector<HTMLElement>("[data-nav-logo]");
    if (!travel || !heroSlot || !heroSec || !navLogo) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // pas de voyage : on garde le logo de la nav (unique), pas de grand logo hero
      travel.style.opacity = "0";
      heroSlot.style.visibility = "hidden";
      return;
    }

    // le slot hero devient une cible de mesure invisible ; l'instance voyageuse
    // est le seul logo visible jusqu'au passage de relais.
    heroSlot.style.visibility = "hidden";
    navLogo.style.opacity = "0";

    let lastDocked = false;
    const place = () => {
      const y = window.scrollY;
      const heroH = heroSec.offsetHeight || window.innerHeight;
      const p = ease(clamp(y / (heroH * 0.65)));
      const h = heroSlot.getBoundingClientRect();
      const n = navLogo.getBoundingClientRect();
      // le slot hero défile avec la page : on fige son top à sa position
      // « scroll 0 » (rect.top + scrollY) pour rester dans le viewport.
      const heroTop = h.top + window.scrollY;
      travel.style.left = `${lerp(h.left, n.left, p)}px`;
      travel.style.top = `${lerp(heroTop, n.top, p)}px`;
      travel.style.width = `${lerp(h.width, n.width, p)}px`;
      travel.style.opacity = "1"; // instance unique : pas de crossfade, pas de doublon
      // signal « logo calé » : la nav révèle ses liens une fois le voyage fini
      const docked = p >= 0.96;
      // dans le hero : blanc plein (pas de fusion) pour une opacité franche ;
      // une fois calé dans la nav : « difference » pour s'adapter aux fonds.
      travel.style.mixBlendMode = docked ? "difference" : "normal";
      if (docked !== lastDocked) {
        lastDocked = docked;
        window.dispatchEvent(new CustomEvent("kinaya:dock", { detail: docked }));
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          place();
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    place();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", place);
      heroSlot.style.visibility = "";
      navLogo.style.opacity = "";
    };
  }, []);

  return (
    <div ref={ref} className={styles.travel} aria-hidden>
      <KinayaLogo />
    </div>
  );
}
