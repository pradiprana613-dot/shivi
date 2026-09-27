import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GlobalAudioManager } from "@/components/GlobalAudioManager";

export const metadata: Metadata = {
  title: "Happy Birthday Shivi",
  description: "A special place for you — Happy Birthday Shivi",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#02071a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#02071a] flex flex-col items-center justify-start overflow-x-hidden">
        <GlobalAudioManager />
        {children}
      </body>
    </html>
  );
}
