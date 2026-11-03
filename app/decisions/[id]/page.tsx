import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { marked } from 'marked'
import { notFound } from 'next/navigation'
import CopyButton from './CopyButton'

const ADR_DIR = join(process.cwd(), 'content', 'adr')

function findAdrFile(id: string): string | null {
  try {
    const files = readdirSync(ADR_DIR)
    const match = files.find(f => f.startsWith(id) && f.endsWith('.md'))
    return match ? join(ADR_DIR, match) : null
  } catch { return null }
}

export function generateStaticParams() {
  try {
    return readdirSync(ADR_DIR)
      .filter(f => f.endsWith('.md'))
      .map(f => ({ id: f.slice(0, 4) }))
  } catch { return [] }
}

export default async function AdrPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const filePath = findAdrFile(id)
  if (!filePath) notFound()
  const raw = readFileSync(filePath, 'utf-8')
  const html = await marked(raw)
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <a href="/decisions" className="text-zinc-500 hover:text-zinc-300 font-mono text-sm">← Decisions</a>
        <CopyButton text={raw} />
      </div>
      <article
        className="prose prose-invert prose-zinc max-w-none prose-code:font-mono prose-code:text-amber-400 prose-headings:font-mono prose-a:text-amber-400 prose-table:text-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}