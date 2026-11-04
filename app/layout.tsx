import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from "./components/LogoutButton";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Hexa — Digital identification for the field",
  description: "Hexagonal NFC dogtag with PKI-authenticated medical profile and transparency log.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get('hexa_auth')?.value === process.env.SITE_PASSWORD;

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 antialiased">
        <header className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50">
          <nav className="max-w-5xl mx-auto px-4 h-12 flex items-center gap-6">
            <Link href="/" className="font-mono font-bold text-zinc-100 tracking-tight">Hexa</Link>
            {isAuthed && (
              <>
                <div className="flex gap-4 ml-auto overflow-x-auto">
                  <Link href="/model"          className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors font-mono whitespace-nowrap">Model</Link>
                  <Link href="/decisions"      className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors font-mono whitespace-nowrap">Architecture</Link>
                  <Link href="/principles"     className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors font-mono whitespace-nowrap">Principles</Link>
                  <Link href="/open-questions" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors font-mono whitespace-nowrap">Questions</Link>
                  <Link href="/setup"          className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors font-mono whitespace-nowrap">Setup</Link>
                </div>
                <LogoutButton />
              </>
            )}
          </nav>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
