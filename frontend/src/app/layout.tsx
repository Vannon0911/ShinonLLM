import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";

import "../styles/globals.css";

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "ShinonLLM | Produktseite",
  description: "ShinonLLM stellt eine lokale, nachvollziehbare LLM-Runtime vor.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="de">
      <body className={`${space.variable} ${ibmMono.variable}`}>{children}</body>
    </html>
  );
}
