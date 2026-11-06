import { Barlow_Condensed, Barlow } from 'next/font/google'

const barlowCondensed = Barlow_Condensed({
  variable: '--font-bc',
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
})

const barlow = Barlow({
  variable: '--font-b',
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
})

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${barlowCondensed.variable} ${barlow.variable}`}>
      {children}
    </div>
  )
}
