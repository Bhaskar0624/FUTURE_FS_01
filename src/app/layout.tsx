import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bhaskar — Developer × AI Engineer × Vibecoder",
  description:
    "Portfolio of Bhaskar — a Developer, AI Engineer, and Vibecoder crafting cinematic digital experiences.",
  keywords: ["developer", "AI engineer", "vibecoder", "portfolio", "next.js", "three.js"],
  openGraph: {
    title: "Bhaskar — Developer × AI Engineer × Vibecoder",
    description: "Cinematic 3D portfolio — engineering credibility meets AI creativity.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
