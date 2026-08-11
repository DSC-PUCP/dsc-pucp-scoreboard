import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DSC PUCP Scoreboard | Marcador en vivo",
  description:
    "Marcador en vivo para competencias y juegos grupales. DSC PUCP — Developer Student Club PUCP.",
  openGraph: {
    title: "DSC PUCP Scoreboard",
    description:
      "Marcador en vivo para juegos y competencias grupales del DSC PUCP.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#060B08",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="arena min-h-full flex flex-col">{children}</body>
    </html>
  );
}
