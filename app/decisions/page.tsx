import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import DecisionsClient from './DecisionsClient'
import CopyButton from './[id]/CopyButton'

const CONTENT = join(process.cwd(), 'content')

function buildFullContext(): string {
  const parts: string[] = []
  parts.push(readFileSync(join(CONTENT, 'principles.md'), 'utf-8'))
  const adrFiles = readdirSync(join(CONTENT, 'adr'))
    .filter(f => f.endsWith('.md'))
    .sort()
  for (const f of adrFiles) {
    parts.push(readFileSync(join(CONTENT, 'adr', f), 'utf-8'))
  }
  parts.push(readFileSync(join(CONTENT, 'open-questions.md'), 'utf-8'))
  return parts.join('\n\n---\n\n')
}

export default function DecisionsPage() {
  const fullContext = buildFullContext()
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 w-full">
      <div className="flex items-start justify-between mb-1 gap-4">
        <h1 className="font-mono font-bold text-2xl text-zinc-100">Architectural description</h1>
        <CopyButton text={fullContext} label="Copy all context for agent" />
      </div>
      <p className="text-zinc-500 text-sm mb-6">
        40 architecture decision records · click a title to read and copy individually
      </p>
      <DecisionsClient />
    </div>
  )
}