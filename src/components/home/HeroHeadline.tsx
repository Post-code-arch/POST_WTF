"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Fragment } from "react";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.5, delayChildren: 0.15 },
  },
};

const lineVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

const word = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/**
 * Variante "on apparition" de RevealWords : même découpe mot à mot,
 * mais déclenchée au montage (pas au scroll) puisque le hero est
 * toujours visible dès le chargement de la page.
 */
export default function HeroHeadline({
  lines,
  className,
}: {
  lines: string[];
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <h1 className={className}>
        {lines.map((line, li) => (
          <Fragment key={li}>
            {line}
            {li < lines.length - 1 && <br />}
          </Fragment>
        ))}
      </h1>
    );
  }

  return (
    <motion.h1
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {lines.map((line, li) => {
        const words = line.split(" ");
        return (
          <motion.span key={li} variants={lineVariants} style={{ display: "block" }}>
            {words.map((w, wi) => (
              <Fragment key={wi}>
                <motion.span
                  variants={word}
                  style={{ display: "inline-block", willChange: "transform, opacity, filter" }}
                >
                  {w}
                </motion.span>
                {wi < words.length - 1 ? " " : ""}
              </Fragment>
            ))}
          </motion.span>
        );
      })}
    </motion.h1>
  );
}
