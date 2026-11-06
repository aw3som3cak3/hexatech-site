import { readFileSync } from 'fs'
import { join } from 'path'
import { marked } from 'marked'
import CopyButton from '../decisions/[id]/CopyButton'

export default async function PrinciplesPage() {
  const raw = readFileSync(join(process.cwd(), 'content', 'principles.md'), 'utf-8')
  const html = await marked(raw)
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-mono font-bold text-xl text-zinc-100">Principles</h1>
        <CopyButton text={raw} />
      </div>
      <article
        className="prose prose-invert prose-zinc max-w-none prose-code:font-mono prose-headings:font-mono prose-strong:text-zinc-200"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}