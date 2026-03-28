import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PharmaCheck — Medication Safety Audit",
  description:
    "Photograph your pill bottles and prescriptions. Get a verified medication safety audit with interaction alerts, duplicate detection, and a unified daily schedule — in under 30 seconds.",
  keywords: [
    "medication safety",
    "drug interactions",
    "pill bottle scanner",
    "prescription audit",
    "pharmacy",
    "healthcare",
    "patient safety",
    "Gemini AI",
  ],
  authors: [{ name: "PharmaCheck" }],
  openGraph: {
    title: "PharmaCheck — Medication Safety Audit",
    description:
      "Turn a pile of pill bottles into a verified safety audit in under 30 seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
