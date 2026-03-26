import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { MissionControlProvider } from "@/components/mission-control-provider";

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
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#0a0a0f] text-white antialiased">
        <MissionControlProvider>
          <AppShell>{children}</AppShell>
        </MissionControlProvider>
      </body>
    </html>
  );
}
