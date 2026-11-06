import { readFileSync } from 'fs'
import { join } from 'path'
import { marked } from 'marked'
import CopyButton from '../decisions/[id]/CopyButton'

export default async function OpenQuestionsPage() {
  const raw = readFileSync(join(process.cwd(), 'content', 'open-questions.md'), 'utf-8')
  const html = await marked(raw)
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-mono font-bold text-xl text-zinc-100">Open Questions</h1>
        <CopyButton text={raw} />
      </div>
      <article
        className="prose prose-invert prose-zinc max-w-none prose-code:font-mono prose-headings:font-mono prose-a:text-amber-400"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}