import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { password } = await req.json()
  const expected = process.env.SITE_PASSWORD
  if (!expected) return NextResponse.json({ ok: false }, { status: 503 })
  if (password === expected) {
    const res = NextResponse.json({ ok: true })
    res.cookies.set('hexa_auth', expected, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
    return res
  }
  return NextResponse.json({ ok: false }, { status: 401 })
}
