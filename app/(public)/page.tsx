'use client'

import { useState, useEffect } from 'react'

type Lang = 'sv' | 'en'

interface Layer { num: string; title: string; desc: string }
interface Product { label: string; name: string; tech: string; desc: string; features: string[]; flagship: boolean }
interface UseCase { domain: string; title: string; items: string[] }

interface Content {
  nav: string[]
  eyebrow: string; headline: string; sub: string; cta: string
  whatEyebrow: string; whatH: string; whatSub: string
  layers: Layer[]
  prodEyebrow: string; prodH: string; prodSub: string
  products: Product[]
  useEyebrow: string; useH: string; useSub: string
  cases: UseCase[]
  aboutEyebrow: string; aboutH: string; aboutP1: string; aboutP2: string; contactRole: string
  footerCopy: string
}

const T: Record<Lang, Content> = {
  sv: {
    nav: ['Vad är Hexa', 'Produkter', 'Användning', 'Kontakt'],
    eyebrow: 'HEXATEC · SENDEX AB',
    headline: 'Identitet som överlever fältet.',
    sub: 'Hexa är ett bärbart identifieringssystem för operativ personal — ett digitalt id-kort för försvaret, totalvärnet och civil beredskap.',
    cta: 'Läs mer',
    whatEyebrow: 'VAD ÄR HEXA',
    whatH: 'Tre lager. En tagg.',
    whatSub: 'Hexa kombinerar fysisk och digital identitet med medicinsk datalagring i ett enda bärbart format.',
    layers: [
      { num: 'I', title: 'Fysisk identitetbärare', desc: 'En tagg i 316L-stål graverad med identitetsfält som tål eld, vatten och stridsmiljö. Posten som aldrig slår ut — eftersom den saknar elektronik.' },
      { num: 'II', title: 'Kryptografisk identitetsuppgift', desc: 'En NFC-baserad säkerhetsenhet med AES-256-kryptering (Hexa) eller PKI-stödda identitetsuppgifter (Hexa Trinium). Verifierbar offline utan server eller nätverk.' },
      { num: 'III', title: 'Medicinsk datalagring', desc: 'Akutdata läsbar av alla med en NFC-enhet. Känsliga uppgifter låsta bakom autentiserad åtkomst. Två nivåer av åtkomstkontroll på en enda tagg.' },
    ],
    prodEyebrow: 'PRODUKTLINJEN',
    prodH: 'Två produkter. En plattform.',
    prodSub: 'Samma formfaktor, samma läsare, ingen omskolning. Uppgradera från Hexa till Hexa Trinium när kraven förändras.',
    products: [
      { label: 'STANDARD', name: 'Hexa', tech: 'DESFire EV3 · AES-256 · NFC', desc: 'COTS-baserat och fältklart. AES-256-kryptering med offline-first-arkitektur. Kompatibelt med standard NFC-läsare utan specialkrav på hårdvara.', features: ['AES-256-kryptering', 'Offline-first — inget nätverk krävs', 'Standard NFC-läsare', 'Pilot Q2 2027'], flagship: true },
      { label: 'HÖG SÄKERHET', name: 'Hexa Trinium', tech: 'JCOP JavaCard · PKI/ECC · STANAG', desc: 'Full PKI och JavaCard-säkerhetselement med ECC-baserade identitetsuppgifter. STANAG-kompatibelt och uppgraderingsbart från Hexa standard — utan att byta läsare.', features: ['ECC-baserad PKI', 'STANAG-kompatibelt', 'Samma formfaktor som Hexa', 'Produktion 2028'], flagship: false },
    ],
    useEyebrow: 'ANVÄNDNING',
    useH: 'Dubbel användning.',
    useSub: 'Hexa är utvecklat för Försvarsmakten och totalvärnet. Samma plattform löser identifiering inom civil beredskap.',
    cases: [
      { domain: 'MILITÄR', title: 'Försvarsmakten · NATO', items: ['Fältidentifiering av personal', 'Medicinsk triage och räddningsinsats', 'NATO-interoperabilitet och STANAG', 'Offline-autentisering utan nätverk'] },
      { domain: 'CIVIL', title: 'MSB · Totalvärn', items: ['Blåljuspersonal och räddningsväsen', 'Krishantering och CBRN-scenarier', 'Suverän datainfrastruktur', 'Integration med befintliga system'] },
    ],
    aboutEyebrow: 'OM OSS',
    aboutH: 'Sendex AB',
    aboutP1: 'Vi utvecklar Hexa-plattformen — identitetssystem för operativa miljöer där tillförlitlighet och säkerhet är kritiska. Offline, autentiserade och baserade på öppna standarder.',
    aboutP2: 'Svensk IP. Standardkomponenter. Skalbara leveranstider.',
    contactRole: 'STRATEGISKA KONTON',
    footerCopy: '© 2026 Sendex AB · Sverige · Svensk IP',
  },
  en: {
    nav: ['What is Hexa', 'Products', 'Use cases', 'Contact'],
    eyebrow: 'HEXATEC · SENDEX AB',
    headline: 'Identity that survives the field.',
    sub: 'Hexa is a wearable identification system for operational personnel — a digital identity tag for defence, total defence, and civil preparedness.',
    cta: 'Learn more',
    whatEyebrow: 'WHAT IS HEXA',
    whatH: 'Three layers. One tag.',
    whatSub: 'Hexa combines physical and digital identity with medical data storage in a single wearable format.',
    layers: [
      { num: 'I', title: 'Physical identity carrier', desc: 'A 316L steel tag engraved with identity fields that survive fire, water, and battlefield conditions. The record that never fails because it carries no electronics.' },
      { num: 'II', title: 'Cryptographic identity credential', desc: 'An NFC-based secure element with AES-256 encryption (Hexa) or PKI-backed credentials (Hexa Trinium). Verifiable offline, without a server or network.' },
      { num: 'III', title: 'Tiered medical data store', desc: 'Emergency data readable by any NFC device. Sensitive records locked behind authenticated access. Two tiers of access control on a single tag.' },
    ],
    prodEyebrow: 'PRODUCT LINE',
    prodH: 'Two products. One platform.',
    prodSub: 'Same form factor, same readers, no retraining required. Upgrade from Hexa to Hexa Trinium as requirements evolve.',
    products: [
      { label: 'STANDARD', name: 'Hexa', tech: 'DESFire EV3 · AES-256 · NFC', desc: 'COTS-based and field-ready. AES-256 encryption with offline-first architecture. Compatible with standard NFC readers, no special hardware required.', features: ['AES-256 encryption', 'Offline-first — no network required', 'Standard NFC readers', 'Pilot Q2 2027'], flagship: true },
      { label: 'HIGH SECURITY', name: 'Hexa Trinium', tech: 'JCOP JavaCard · PKI/ECC · STANAG', desc: 'Full PKI and JavaCard secure element with ECC-based identity credentials. STANAG-compatible and upgradeable from Hexa standard — without changing readers.', features: ['ECC-based PKI', 'STANAG-compatible', 'Same form factor as Hexa', 'Production 2028'], flagship: false },
    ],
    useEyebrow: 'USE CASES',
    useH: 'Dual use.',
    useSub: 'Hexa is built for the Swedish Armed Forces and total defence. The same platform solves identification across civil preparedness.',
    cases: [
      { domain: 'MILITARY', title: 'Armed Forces · NATO', items: ['Field identification of personnel', 'Medical triage and rescue operations', 'NATO interoperability and STANAG', 'Offline authentication without network'] },
      { domain: 'CIVIL', title: 'MSB · Total defence', items: ['Emergency services and rescue', 'Crisis management and CBRN scenarios', 'Sovereign data infrastructure', 'Integration with existing systems'] },
    ],
    aboutEyebrow: 'ABOUT',
    aboutH: 'Sendex AB',
    aboutP1: 'We develop the Hexa platform — identification systems for operational environments where reliability and security are critical. Offline, authenticated, and built on open standards.',
    aboutP2: 'Swedish IP. Standard components. Scalable delivery timelines.',
    contactRole: 'STRATEGIC ACCOUNTS',
    footerCopy: '© 2026 Sendex AB · Sweden · Swedish IP',
  },
}

const BC = "var(--font-bc, 'Barlow Condensed', sans-serif)"
const B = "var(--font-b, Barlow, system-ui, sans-serif)"

const NAV_ANCHORS = ['#what', '#products', '#usecases', '#about']

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('sv')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hexatec-lang') as Lang
      if (saved === 'sv' || saved === 'en') setLang(saved)
    } catch {}
  }, [])

  function switchLang(l: Lang) {
    setLang(l)
    try { localStorage.setItem('hexatec-lang', l) } catch {}
  }

  const t = T[lang]

  return (
    <div style={{ fontFamily: B, margin: 0 }}>

      {/* ── NAV ── */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #DDE3EC', position: 'sticky', top: 0, zIndex: 50, height: 64 }}
        className="flex items-center gap-6 px-6 md:px-14">
        <span style={{ fontFamily: BC, fontSize: 20, fontWeight: 800, letterSpacing: '0.2em', color: '#1D4ED8', textTransform: 'uppercase', flexShrink: 0 }}>
          HEXATEC
        </span>
        <ul className="hidden md:flex gap-7 list-none m-0 p-0 flex-1">
          {t.nav.map((label, i) => (
            <li key={label}>
              <a href={NAV_ANCHORS[i]} style={{ fontSize: 14, fontWeight: 500, color: '#546077', textDecoration: 'none' }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = '#0C1117')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = '#546077')}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex" style={{ border: '1px solid #DDE3EC', borderRadius: 2, overflow: 'hidden' }}>
          {(['sv', 'en'] as Lang[]).map(l => (
            <button key={l} onClick={() => switchLang(l)}
              style={{ fontFamily: BC, fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', padding: '5px 11px', border: 'none', cursor: 'pointer', background: lang === l ? '#1D4ED8' : 'transparent', color: lang === l ? '#fff' : '#546077' }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ background: '#0C1117' }} className="px-6 md:px-14 py-24 md:py-28">
        <div style={{ maxWidth: 820 }}>
          <p style={{ fontFamily: BC, fontSize: 12, fontWeight: 700, letterSpacing: '0.4em', color: '#3B82F6', textTransform: 'uppercase', margin: '0 0 20px' }}>
            {t.eyebrow}
          </p>
          <h1 style={{ fontFamily: BC, fontSize: 'clamp(48px, 7.5vw, 92px)', fontWeight: 800, lineHeight: 1.0, color: '#F1F5F9', margin: '0 0 20px', textWrap: 'balance' as never }}>
            {t.headline}
          </h1>
          <p style={{ fontSize: 'clamp(16px, 1.8vw, 19px)', color: '#94A3B8', lineHeight: 1.7, margin: '0 0 44px', maxWidth: 580 }}>
            {t.sub}
          </p>
          <a href="#what" style={{ fontFamily: BC, fontSize: 14, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: '#3B82F6', color: '#fff', border: '1px solid #3B82F6', textDecoration: 'none', display: 'inline-block', padding: '13px 30px', borderRadius: 2 }}>
            {t.cta}
          </a>
        </div>
      </section>

      {/* ── WHAT IS HEXA ── */}
      <section id="what" style={{ background: '#fff' }} className="px-6 md:px-14 py-20">
        <p style={{ fontFamily: BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.45em', color: '#1D4ED8', textTransform: 'uppercase', margin: '0 0 14px' }}>{t.whatEyebrow}</p>
        <h2 style={{ fontFamily: BC, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, lineHeight: 1.1, color: '#0C1117', margin: '0 0 14px' }}>{t.whatH}</h2>
        <p style={{ fontSize: 17, color: '#546077', lineHeight: 1.7, maxWidth: 600, margin: '0 0 52px' }}>{t.whatSub}</p>
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 1, background: '#DDE3EC', border: '1px solid #DDE3EC' }}>
          {t.layers.map(l => (
            <div key={l.num} style={{ background: '#fff', padding: '40px 36px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <span style={{ fontFamily: BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.4em', color: '#1D4ED8', textTransform: 'uppercase' }}>{l.num}</span>
              <h3 style={{ fontFamily: BC, fontSize: 24, fontWeight: 700, color: '#0C1117', margin: 0, lineHeight: 1.2 }}>{l.title}</h3>
              <p style={{ fontSize: 15, color: '#546077', lineHeight: 1.7, margin: 0 }}>{l.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section id="products" style={{ background: '#0C1117' }} className="px-6 md:px-14 py-20">
        <p style={{ fontFamily: BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.45em', color: '#3B82F6', textTransform: 'uppercase', margin: '0 0 14px' }}>{t.prodEyebrow}</p>
        <h2 style={{ fontFamily: BC, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, lineHeight: 1.1, color: '#F1F5F9', margin: '0 0 14px' }}>{t.prodH}</h2>
        <p style={{ fontSize: 17, color: '#94A3B8', lineHeight: 1.7, maxWidth: 600, margin: '0 0 52px' }}>{t.prodSub}</p>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 1, background: '#1E3A5F', border: '1px solid #1E3A5F' }}>
          {t.products.map(p => (
            <div key={p.name} style={{ background: '#0F1E35', padding: '48px 44px', display: 'flex', flexDirection: 'column', gap: 18, borderTop: p.flagship ? '4px solid #3B82F6' : undefined }}>
              <span style={{ fontFamily: BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#3B82F6' }}>{p.label}</span>
              <h3 style={{ fontFamily: BC, fontSize: 44, fontWeight: 800, color: '#F1F5F9', margin: 0, lineHeight: 1 }}>{p.name}</h3>
              <span style={{ fontFamily: BC, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: '#1E3A5F', textTransform: 'uppercase' }}>{p.tech}</span>
              <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.7, margin: 0, flex: 1 }}>{p.desc}</p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid #1E3A5F', paddingTop: 20 }}>
                {p.features.map(f => (
                  <li key={f} style={{ fontSize: 14, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#3B82F6', flexShrink: 0, display: 'inline-block' }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section id="usecases" style={{ background: '#fff' }} className="px-6 md:px-14 py-20">
        <p style={{ fontFamily: BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.45em', color: '#1D4ED8', textTransform: 'uppercase', margin: '0 0 14px' }}>{t.useEyebrow}</p>
        <h2 style={{ fontFamily: BC, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, lineHeight: 1.1, color: '#0C1117', margin: '0 0 14px' }}>{t.useH}</h2>
        <p style={{ fontSize: 17, color: '#546077', lineHeight: 1.7, maxWidth: 600, margin: '0 0 52px' }}>{t.useSub}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {t.cases.map(c => (
            <div key={c.domain} style={{ background: '#F3F5F9', borderLeft: '3px solid #1D4ED8', padding: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontFamily: BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.4em', color: '#1D4ED8', textTransform: 'uppercase', margin: 0 }}>{c.domain}</p>
              <h3 style={{ fontFamily: BC, fontSize: 24, fontWeight: 700, color: '#0C1117', margin: 0 }}>{c.title}</h3>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {c.items.map(item => (
                  <li key={item} style={{ fontSize: 15, color: '#546077', paddingLeft: 18, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#DDE3EC' }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ background: '#F3F5F9' }} className="px-6 md:px-14 py-20 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
        <div>
          <p style={{ fontFamily: BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.45em', color: '#1D4ED8', textTransform: 'uppercase', margin: '0 0 14px' }}>{t.aboutEyebrow}</p>
          <h2 style={{ fontFamily: BC, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, lineHeight: 1.1, color: '#0C1117', margin: '0 0 14px' }}>{t.aboutH}</h2>
          <p style={{ fontSize: 16, color: '#546077', lineHeight: 1.75, margin: '0 0 18px', maxWidth: 420 }}>{t.aboutP1}</p>
          <p style={{ fontSize: 16, color: '#546077', lineHeight: 1.75, margin: 0 }}>{t.aboutP2}</p>
        </div>
        <div className="self-start" style={{ background: '#fff', border: '1px solid #DDE3EC', borderTop: '3px solid #1D4ED8', padding: 36, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontFamily: BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#1D4ED8' }}>{t.contactRole}</span>
          <h3 style={{ fontFamily: BC, fontSize: 24, fontWeight: 700, color: '#0C1117', margin: 0 }}>Erik Obitz</h3>
          <div style={{ fontFamily: BC, fontSize: 20, fontWeight: 600, color: '#1D4ED8', marginTop: 8, wordBreak: 'break-all' }}>sales@sendex.se</div>
          <p style={{ fontSize: 14, color: '#546077', margin: 0 }}>hexatec.se</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#060B0F' }} className="px-6 md:px-14 py-9 flex flex-wrap justify-between items-center gap-3">
        <span style={{ fontFamily: BC, fontSize: 14, fontWeight: 800, letterSpacing: '0.25em', color: '#1E3A5F', textTransform: 'uppercase' }}>
          HEXATEC · SENDEX AB
        </span>
        <span style={{ fontSize: 13, color: '#1E3A5F' }}>{t.footerCopy}</span>
      </footer>

    </div>
  )
}
