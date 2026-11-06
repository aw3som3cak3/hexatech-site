import { Geist, Geist_Mono } from 'next/font/google'
import Link from 'next/link'
import LogoutButton from './components/LogoutButton'

export const dynamic = 'force-dynamic'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${geist.variable} ${geistMono.variable} bg-zinc-950 text-zinc-100 min-h-screen`}
      style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}>
      <header className="border-b border-zinc-800 px-4">
        <div className="max-w-5xl mx-auto h-12 flex items-center gap-6">
          <Link href="/foundry" className="font-mono text-sm font-bold text-zinc-100 hover:text-white whitespace-nowrap">
            HEXA / FOUNDRY
          </Link>
          <nav className="flex gap-4 flex-1">
            <Link href="/foundry/model"          className="text-xs font-mono text-zinc-400 hover:text-zinc-100 transition-colors">Model</Link>
            <Link href="/foundry/decisions"      className="text-xs font-mono text-zinc-400 hover:text-zinc-100 transition-colors">Decisions</Link>
            <Link href="/foundry/principles"     className="text-xs font-mono text-zinc-400 hover:text-zinc-100 transition-colors">Principles</Link>
            <Link href="/foundry/open-questions" className="text-xs font-mono text-zinc-400 hover:text-zinc-100 transition-colors">Open questions</Link>
            <Link href="/foundry/setup"          className="text-xs font-mono text-zinc-400 hover:text-zinc-100 transition-colors">Setup</Link>
          </nav>
          <LogoutButton />
        </div>
      </header>
      {children}
    </div>
  )
}
