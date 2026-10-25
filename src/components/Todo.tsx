import type { CSSProperties } from "react";

/** contenu non rédigé : repère visible en développement, rien en production */
export const SHOW_TODO = process.env.NODE_ENV !== "production";

const STYLE: CSSProperties = {
  display: "inline-block",
  fontFamily: "var(--fl)",
  fontSize: 12,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#6b4f00",
  background: "#f1e3b0",
  padding: "3px 8px",
  borderRadius: 2,
};

export default function Todo({ label }: { label: string }) {
  if (!SHOW_TODO) return null;
  return <span style={STYLE}>TODO — {label}</span>;
}
