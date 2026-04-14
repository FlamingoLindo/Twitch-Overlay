import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Twitch Overlay',
  description: 'Shared canvas for real-time overlays',
  icons: {
    icon: '/buh.ico',
  },
  openGraph: {
    images: [
      {
        url: 'https://i.redd.it/3d56uxj8mir61.png',
        width: 1200,
        height: 630,
        alt: 'Twitch Overlay preview',
      },
    ],
  },
}

export default function OverlayLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}