import localFont from "next/font/local";
import { Space_Grotesk, Instrument_Sans } from "next/font/google";

/**
 * Typographic roles (cf. brief POST) :
 *   --fd  Clash Display          → H1 / display / gros marquees
 *   --fh  Space Grotesk          → H2 / sous-titres
 *   --fb  Instrument Sans        → corps de texte
 *   --fl  Space Grotesk          → petits labels (numéros, kickers, méta)
 *   --fc  Cabinet Grotesk        → fallback display / usage secondaire
 */

// Clash Display — variable, hébergé en local (200–700)
export const clashDisplay = localFont({
  src: "../../fonts/ClashDisplay-Variable.woff2",
  weight: "200 700",
  style: "normal",
  display: "swap",
  variable: "--font-clash",
});

// Cabinet Grotesk — variable, hébergé en local (fallback display)
export const cabinetGrotesk = localFont({
  src: "../../fonts/CabinetGrotesk-Variable.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-cabinet",
});

// Space Grotesk — Google Fonts (famille complète)
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-space",
});

// Instrument Sans — Google Fonts (Regular standard non fourni en local)
export const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument",
});

export const fontVariables = [
  clashDisplay.variable,
  cabinetGrotesk.variable,
  spaceGrotesk.variable,
  instrumentSans.variable,
].join(" ");
