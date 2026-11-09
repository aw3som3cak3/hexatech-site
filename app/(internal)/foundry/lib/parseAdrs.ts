import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

export type AdrStatus = 'Accepted' | 'Proposed' | 'Superseded'
export type AdrStatusV2 = AdrStatus | 'Replaced'

export interface AdrMeta {
  id: string
  title: string
  status: AdrStatus
  principles: string
  notes?: string
  section?: string
}

export interface AdrMetaV2 extends Omit<AdrMeta, 'status'> {
  status: AdrStatusV2
}

function extractField(content: string, field: string): string | undefined {
  const m = content.match(new RegExp(`\\*\\*${field}:\\*\\*\\s*([^\\n]+)`))
  return m?.[1]?.trim()
}

// Shorten "ADR-0058 (long description...)" → "ADR-0058"
function briefAdrRef(value: string): string {
  const ids = value.match(/ADR-\d+/g)
  return ids ? ids.join(', ') : value.split('(')[0].trim()
}

function parseStatus(raw: string): AdrStatus {
  if (raw.startsWith('Superseded')) return 'Superseded'
  if (raw === 'Accepted') return 'Accepted'
  return 'Proposed'
}

// ADRs 0056+ belong to the card form factor section; 0056 carries the section header
const SECTION_AT = '0056'
const SECTION_LABEL = 'Gen 2 — Card form factor'

export function parseAdrs(adrDir: string): AdrMeta[] {
  const files = readdirSync(adrDir).filter(f => f.endsWith('.md')).sort()

  return files.map(filename => {
    const content = readFileSync(join(adrDir, filename), 'utf-8')
    const id = filename.slice(0, 4)

    const titleMatch = content.match(/^# ADR-\d+[:\s]+(.+)$/m)
    const title = titleMatch?.[1]?.replace(/^ADR-\d+:\s*/, '').trim() ?? filename

    const rawStatus = extractField(content, 'Status') ?? 'Proposed'
    const status = parseStatus(rawStatus)

    const principles = extractField(content, 'Principles') ?? ''

    const supersedes = extractField(content, 'Supersedes')
    const amends = extractField(content, 'Amends')
    const noteParts = [
      supersedes && `Supersedes ${briefAdrRef(supersedes)}`,
      amends && `Amends ${briefAdrRef(amends)}`,
    ].filter(Boolean)
    const notes = noteParts.length ? noteParts.join('; ') : undefined

    const section = id === SECTION_AT ? SECTION_LABEL : undefined

    return { id, title, status, principles, notes, section }
  })
}

// ADR IDs that become 'Replaced' in the card-form-factor view (ring-and-core physical layer)
const REPLACED_IN_CARD_VIEW = new Set([
  '0022','0038','0040','0041','0042','0043',
  '0045','0047','0048','0049','0050','0051',
  '0053','0054','0055',
])

export function parseAdrsV2(adrDir: string): AdrMetaV2[] {
  return parseAdrs(adrDir).map(adr => {
    if (REPLACED_IN_CARD_VIEW.has(adr.id)) {
      return { ...adr, status: 'Replaced' as const, section: undefined }
    }
    return adr
  })
}
