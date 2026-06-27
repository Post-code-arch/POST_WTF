"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

/**
 * Révélation au scroll (porté de la classe .rv du canevas) via Framer Motion.
 * Opacité + translation verticale, une seule fois à l'entrée dans le viewport.
 */
const variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Reveal({
  children,
  className,
  style,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "section" | "h2";
}) {
  const MotionTag =
    as === "section" ? motion.section : as === "h2" ? motion.h2 : motion.div;
  return (
    <MotionTag
      className={className}
      style={style}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
    >
      {children}
    </MotionTag>
  );
}
