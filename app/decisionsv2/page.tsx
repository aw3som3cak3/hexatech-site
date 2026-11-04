import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import DecisionsV2Client from './DecisionsV2Client'
import CopyButton from '../decisions/[id]/CopyButton'

const CONTENT = join(process.cwd(), 'content')

function buildFullContext(): string {
  const parts: string[] = []

  parts.push(`# Hexa architecture — card form factor view (ADR-0056 proposed)

This document represents the full Hexa architecture under the assumption that ADR-0056
(NFC hex card + 316L steel tear-away) is accepted. ADRs marked "Replaced" would be
superseded. All digital-layer ADRs (0001–0039 minus 0038, plus 0044) are unchanged.
ADR-0056 is still Proposed — the original ring-and-core ADRs remain in force until
a formal acceptance decision is made.

---
`)

  parts.push(readFileSync(join(CONTENT, 'principles.md'), 'utf-8'))

  const adrFiles = readdirSync(join(CONTENT, 'adr'))
    .filter(f => f.endsWith('.md'))
    .sort()
  for (const f of adrFiles) {
    parts.push(readFileSync(join(CONTENT, 'adr', f), 'utf-8'))
  }

  // include strategy doc if present
  try {
    parts.push(readFileSync(join(CONTENT, 'strategy.md'), 'utf-8'))
  } catch { /* not yet synced — skip */ }

  parts.push(readFileSync(join(CONTENT, 'open-questions.md'), 'utf-8'))

  return parts.join('\n\n---\n\n')
}

export default function DecisionsV2Page() {
  const fullContext = buildFullContext()
  const replaced = fullContext.match(/Replaced/g)?.length ?? 0

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 w-full">
      <div className="flex items-start justify-between mb-1 gap-4">
        <div>
          <h1 className="font-mono font-bold text-2xl text-zinc-100">Architecture — card design view</h1>
          <p className="text-xs font-mono text-orange-400/80 mt-1">
            Assumes ADR-0056 accepted · original ring-and-core ADRs still in force
          </p>
        </div>
        <CopyButton text={fullContext} label="Copy all context for agent" />
      </div>
      <p className="text-zinc-500 text-sm mb-4">
        56 ADRs · <span className="text-amber-400">Accepted</span> = unchanged · <span className="text-blue-400">Proposed</span> = new · <span className="text-orange-400">Replaced</span> = would be superseded by ADR-0056
      </p>

      <div className="border border-orange-900/40 bg-orange-950/20 px-4 py-3 mb-6 text-xs font-mono text-orange-300/70">
        Share the "Copy all context" bundle with an agent to give it the full picture: principles,
        all 56 ADRs, and the commercial strategy. The agent will see which decisions are unchanged
        and which the card design would replace.
      </div>

      <DecisionsV2Client />
    </div>
  )
}
