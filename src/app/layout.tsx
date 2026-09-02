import type { Metadata } from "next";
import { Bungee, Nunito, Share_Tech_Mono } from "next/font/google";
import { SoundProvider, SoundToggle } from "@/components/arcade/SoundProvider";
import Link from "next/link";
import "./globals.css";

const display = Bungee({
  variable: "--font-bungee",
  subsets: ["latin"],
  weight: "400",
});

const body = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const score = Share_Tech_Mono({
  variable: "--font-scoreface",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Security Arcade",
  description: "Spin. Play. Outsmart.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${score.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <SoundProvider>
          <header className="flex items-center justify-between px-4 py-4 sm:px-8">
            <Link href="/" className="font-display text-lg tracking-wide text-ticket">
              Security Arcade
            </Link>
            <nav className="arcade-nav text-sm uppercase tracking-widest">
              <Link href="/play">Play</Link>
              <Link href="/leaderboard">Scores</Link>
              <Link href="/booth">Booth</Link>
              <SoundToggle />
            </nav>
          </header>
          <main className="flex-1 px-4 pb-12 sm:px-8">{children}</main>
        </SoundProvider>
      </body>
    </html>
  );
}
