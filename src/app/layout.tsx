import type { Metadata } from "next";
import { Orbitron, Press_Start_2P, Rajdhani } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { MissionControlProvider } from "@/components/mission-control-provider";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Mission Control | AP for BDUBB",
  description: "Dark premium command center for AxonPoe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${rajdhani.variable} ${pressStart.variable} h-full`}
    >
      <body className="min-h-full bg-[#0a0a0f] text-white antialiased">
        <MissionControlProvider>
          <AppShell>{children}</AppShell>
        </MissionControlProvider>
      </body>
    </html>
  );
}
