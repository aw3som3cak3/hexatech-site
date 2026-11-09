'use client'

import { useState } from 'react'
import type { AdrMetaV2, AdrStatusV2 } from '../lib/parseAdrs'

const STATUS_STYLES: Record<AdrStatusV2 | 'All', string> = {
  All:        'border-zinc-700 text-zinc-400',
  Accepted:   'border-amber-500 text-amber-400',
  Proposed:   'border-blue-500 text-blue-400',
  Replaced:   'border-orange-500 text-orange-400',
  Superseded: 'border-zinc-600 text-zinc-500',
}

const BADGE: Record<AdrStatusV2, string> = {
  Accepted:   'bg-amber-400/10 text-amber-400 border border-amber-400/20',
  Proposed:   'bg-blue-400/10 text-blue-400 border border-blue-400/20',
  Replaced:   'bg-orange-400/10 text-orange-400 border border-orange-400/20',
  Superseded: 'bg-zinc-800 text-zinc-500 border border-zinc-700',
}

const FILTERS: Array<AdrStatusV2 | 'All'> = ['All', 'Accepted', 'Proposed', 'Replaced', 'Superseded']

export default function DecisionsV2Client({ adrs }: { adrs: AdrMetaV2[] }) {
  const [filter, setFilter] = useState<AdrStatusV2 | 'All'>('All')
  const visible = filter === 'All' ? adrs : adrs.filter(a => a.status === filter)

  return (
    <>
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-mono px-3 py-1 border transition-colors ${
              filter === f
                ? STATUS_STYLES[f] + ' bg-zinc-900'
                : 'border-zinc-800 text-zinc-600 hover:text-zinc-400'
            }`}
          >
            {f}
            {f !== 'All' && (
              <span className="ml-1.5 opacity-60">
                {adrs.filter(a => a.status === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900">
              <th className="text-left font-mono text-xs text-zinc-500 px-4 py-2 w-20">ADR</th>
              <th className="text-left font-mono text-xs text-zinc-500 px-4 py-2">Title</th>
              <th className="text-left font-mono text-xs text-zinc-500 px-4 py-2 hidden sm:table-cell">Principles</th>
              <th className="text-left font-mono text-xs text-zinc-500 px-4 py-2 w-28">Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((adr, i) => (
              <tr key={adr.id}
                className={`border-b border-zinc-800/60 ${i % 2 === 0 ? '' : 'bg-zinc-900/30'}`}>
                <td className="px-4 py-2.5 font-mono text-xs text-zinc-500">{adr.id}</td>
                <td className="px-4 py-2.5">
                  <a href={`/decisions/${adr.id}`} className="text-zinc-200 hover:text-amber-400 transition-colors leading-snug">
                    {adr.title}
                  </a>
                  {adr.notes && (
                    <div className="text-xs text-zinc-600 mt-0.5">{adr.notes}</div>
                  )}
                </td>
                <td className="px-4 py-2.5 hidden sm:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {adr.principles.split(', ').map(p => (
                      <span key={p} className="text-xs font-mono text-zinc-500 border border-zinc-700 px-1">{p}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <span className={`text-xs font-mono px-2 py-0.5 ${BADGE[adr.status]}`}>
                    {adr.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
