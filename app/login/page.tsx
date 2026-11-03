'use client'

import { useState, FormEvent } from 'react'

export default function LoginPage() {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(false)
    setLoading(true)
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    setLoading(false)
    if (res.ok) {
      window.location.href = '/'
    } else {
      setError(true)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="font-mono font-bold text-2xl text-zinc-100 mb-1">Hexa</h1>
          <p className="text-zinc-500 text-sm font-mono">Enter passphrase to continue</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input
            name="password"
            type="password"
            autoFocus
            required
            placeholder="Passphrase"
            className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 font-mono text-sm px-4 py-2.5 focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600"
          />
          {error && (
            <p className="text-red-400 text-xs font-mono">Incorrect passphrase</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-100 text-zinc-900 font-mono text-sm py-2.5 hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}
