"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Fragment } from "react";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
};

const word = {
  hidden: { opacity: 0, y: 28, filter: "blur(7px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/**
 * Révélation mot à mot au scroll (une fois), pour les titres courts qui
 * méritent plus qu'un simple fondu en bloc.
 */
export default function RevealWords({
  lines,
  className,
}: {
  lines: string[];
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <h2 className={className}>
        {lines.map((line, li) => (
          <Fragment key={li}>
            {line}
            {li < lines.length - 1 && <br />}
          </Fragment>
        ))}
      </h2>
    );
  }

  return (
    <motion.h2
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      {lines.map((line, li) => {
        const words = line.split(" ");
        return (
          <Fragment key={li}>
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
            {li < lines.length - 1 && <br />}
          </Fragment>
        );
      })}
    </motion.h2>
  );
}
