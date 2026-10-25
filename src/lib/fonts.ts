import localFont from "next/font/local";
import { Space_Mono } from "next/font/google";

/**
 * Deux typographies, exclusivement :
 *   General Sans → titres, sous-titres, corps de texte (--fd, --fh, --fb, --fc)
 *   Space Mono   → petits labels : numéros, kickers, méta (--fl)
 */

// General Sans — variable (200–700), romain + italique, hébergé en local
export const generalSans = localFont({
  src: [
    {
      path: "../../fonts/GeneralSans-Variable.ttf",
      weight: "200 700",
      style: "normal",
    },
    {
      path: "../../fonts/GeneralSans-VariableItalic.ttf",
      weight: "200 700",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-general",
});

// Space Mono — Google Fonts (400 / 700, romain + italique)
export const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-mono",
});

export const fontVariables = [generalSans.variable, spaceMono.variable].join(" ");
