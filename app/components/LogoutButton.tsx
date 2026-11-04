'use client'

export default function LogoutButton() {
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <button
      onClick={logout}
      className="text-sm text-zinc-500 hover:text-zinc-100 transition-colors font-mono whitespace-nowrap"
    >
      Logout
    </button>
  )
}
