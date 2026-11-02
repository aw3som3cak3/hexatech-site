import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hexa — Digital identification for the field",
  description: "Hexagonal NFC dogtag with PKI-authenticated medical profile and transparency log.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 antialiased">
        <header className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50">
          <nav className="max-w-5xl mx-auto px-4 h-12 flex items-center gap-6">
            <Link href="/" className="font-mono font-bold text-zinc-100 tracking-tight">Hexa</Link>
            <div className="flex gap-4 ml-auto">
              <Link href="/model"     className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors font-mono">Model</Link>
              <Link href="/decisions" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors font-mono">Decisions</Link>
              <Link href="/setup"     className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors font-mono">Setup</Link>
            </div>
          </nav>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
