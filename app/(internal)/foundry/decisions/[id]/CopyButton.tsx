'use client'
import { useState } from 'react'

export default function CopyButton({ text, label = 'Copy for agent' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="font-mono text-xs px-3 py-1.5 border border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 transition-colors whitespace-nowrap"
    >
      {copied ? '✓ Copied' : label}
    </button>
  )
}