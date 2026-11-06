'use client'

import { useState, useEffect } from 'react'

type Lang = 'sv' | 'en'

interface Layer { num: string; title: string; desc: string }
interface Product { label: string; name: string; tech: string; desc: string; features: string[]; flagship: boolean }
interface UseCase { domain: string; title: string; items: string[] }
interface Timeline { period: string; label: string }

interface Content {
  nav: string[]
  eyebrow: string; headline: string; sub: string; cta: string; tags: string[]
  whatEyebrow: string; whatH: string; whatSub: string
  layers: Layer[]
  prodEyebrow: string; prodH: string; prodSub: string
  products: Product[]
  tlEyebrow: string; tlH: string; tlSub: string
  timeline: Timeline[]
  useEyebrow: string; useH: string; useSub: string
  cases: UseCase[]
  aboutEyebrow: string; aboutH: string; aboutP1: string; aboutP2: string; contactRole: string
  footerCopy: string
}

const T: Record<Lang, Content> = {
  sv: {
    nav: ['Vad är Hexa', 'Produkter', 'Tidslinje', 'Kontakt'],
    eyebrow: 'HEXATEC · SENDEX AB',
    headline: 'Fysisk och digital identitetsbricka.',
    sub: 'Ett bärbart system som bär bärarens identitet, akutmedicinska profil och kryptografiska legitimation i ett enda element — avläsbart offline och verifierbart utan nätverksinfrastruktur.',
    cta: 'Läs mer',
    tags: ['Offline-first', 'Hårdvaru-2FA · COTS', 'PKI-autentiserat', 'NATO / STANAG', 'Dubbel användning', 'Svensk IP'],
    whatEyebrow: 'VAD ÄR HEXA',
    whatH: 'Tre lager. En bricka.',
    whatSub: 'Hexa kombinerar fysisk och digital identitet med medicinsk datalagring i ett enda bärbart format.',
    layers: [
      {
        num: 'I',
        title: 'Fysisk identitetsbärare',
        desc: 'Systemet består av två element: ett NFC-hexkort som bäraren har på sig, och en avrivbar remsa i 316L stål graverad med namn, organisation och ett unikt registrerings-ID, som stannar hos patienten. Remsan klarar brand vid 1 375 °C och kräver inget batteri, ingen läsare och ingen infrastruktur.',
      },
      {
        num: 'II',
        title: 'Kryptografisk identitet och 2FA',
        desc: 'Samma bricka som bärs i fält fungerar som hårdvarusäkerhetsnyckel vid inloggning i operativa appar och system på COTS-enheter. Ingen separat token, ingen proprietär kortläsare. CAC/PIV kräver specialhårdvara som inte fungerar på kommersiella enheter — Hexa fungerar på vilken NFC-telefon som helst.',
      },
      {
        num: 'III',
        title: 'Skiktad medicinsk datalager',
        desc: 'Akutmedicinska data lagras direkt på kortet och kan läsas av vilken NFC-telefon som helst — utan nätverksåtkomst. Känsligare uppgifter skyddas bakom autentiserad åtkomst: ett kort, två skyddsnivåer. IPS-strukturerat format möjliggör interoperabilitet med nationella och allierade vårdsystem.',
      },
    ],
    prodEyebrow: 'PRODUKTLINJEN',
    prodH: 'Två produkter. En plattform.',
    prodSub: 'Samma formfaktor, samma läsare, ingen omskolning. Uppgradera från Hexa till Hexa Trinium när kraven förändras.',
    products: [
      {
        label: 'STANDARD',
        name: 'Hexa',
        tech: 'DESFire EV3 · AES-256 · NFC',
        desc: 'COTS-baserat och fältklart. AES-256-kryptering med offline-first-arkitektur. Kompatibelt med standard NFC-läsare utan specialkrav på hårdvara. Avsett för bred driftsättning inom både civil beredskap och fältanvändning.',
        features: ['AES-256-kryptering', 'Offline-first — inget nätverk krävs', 'Standard NFC-läsare', 'Pilot Q3 2027'],
        flagship: true,
      },
      {
        label: 'HÖG SÄKERHET',
        name: 'Hexa Trinium',
        tech: 'JCOP JavaCard · PKI/ECC · STANAG',
        desc: 'Full PKI och JavaCard-säkerhetselement med ECC-baserade identitetsuppgifter. STANAG-kompatibelt och uppgraderingsbart från Hexa standard — utan att byta ut läsare eller utbilda om personal.',
        features: ['ECC-baserad PKI', 'STANAG-kompatibelt', 'Samma formfaktor som Hexa', 'Produktion 2028'],
        flagship: false,
      },
    ],
    tlEyebrow: 'LEVERANSTIDSLINJE',
    tlH: 'Definierad plattform. Klara milstolpar.',
    tlSub: 'Hårdvaruplattformen är designfryst. Byggt uteslutande på standardkomponenter — tillverkning är inte den kritiska vägen.',
    timeline: [
      { period: 'Q1 2027', label: 'Klinisk arbetsflödesvalidering med sjukvårdspersonal' },
      { period: 'Q2 2027', label: 'Hexa teknisk demonstration, enrollmentflöde och kortproduktion' },
      { period: 'Q3 2027', label: 'Hexa pilotklar, 50–100 enheter för fältutvärdering' },
      { period: '2028',    label: 'Produktionsserie båda produkter, inhemsk tillverkning' },
    ],
    useEyebrow: 'ANVÄNDNING',
    useH: 'Dubbel användning.',
    useSub: 'Hexa är konstruerat för dubbel användning från grunden. Samma system identifierar operativ personal, blåljuspersonal, räddningstjänst och civilförsvarspliktiga — ett upphandlingsbeslut täcker båda sidor av totalförsvarets personalspektrum.',
    cases: [
      {
        domain: 'MILITÄR',
        title: 'Försvarsmakten · NATO',
        items: [
          'Fältidentifiering och medicinsk triage',
          'NATO-interoperabilitet via STANAG och IPS',
          'Offline-autentisering utan nätverk',
          'TCCC-journal följer soldaten i CASEVAC-kedjan',
        ],
      },
      {
        domain: 'CIVIL',
        title: 'MSB · Totalförsvar',
        items: [
          'Blåljuspersonal, räddningstjänst och civilförsvarspliktiga',
          'Krishantering och CBRN-scenarier',
          'COTS-läsarkompatibilitet — vilken NFC-telefon som helst',
          'Suverän datainfrastruktur under svensk kontroll',
        ],
      },
    ],
    aboutEyebrow: 'OM OSS',
    aboutH: 'Sendex AB',
    aboutP1: 'Vi utvecklar Hexa-plattformen — identitetssystem för operativa miljöer där tillförlitlighet och säkerhet är kritiska. Offline, autentiserade och baserade på öppna standarder.',
    aboutP2: 'Svensk IP. Standardkomponenter. Skalbara leveranstider.',
    contactRole: 'STRATEGISKA KONTON',
    footerCopy: '© 2026 Sendex AB · Sverige · Svensk IP',
  },
  en: {
    nav: ['What is Hexa', 'Products', 'Timeline', 'Contact'],
    eyebrow: 'HEXATEC · SENDEX AB',
    headline: 'Physical and digital identity tag.',
    sub: 'A wearable system carrying the bearer\'s identity, emergency medical profile and cryptographic credential in a single element — readable offline and verifiable without network infrastructure.',
    cta: 'Learn more',
    tags: ['Offline-first', 'Hardware 2FA · COTS', 'PKI-authenticated', 'NATO / STANAG', 'Dual use', 'Swedish IP'],
    whatEyebrow: 'WHAT IS HEXA',
    whatH: 'Three layers. One tag.',
    whatSub: 'Hexa combines physical and digital identity with medical data storage in a single wearable format.',
    layers: [
      {
        num: 'I',
        title: 'Physical identity carrier',
        desc: 'Two-element design: an NFC hex card worn by the bearer, and a 316L steel tear-away strip engraved with name, organisation and a unique registration ID that stays with the patient. Survives fire at 1,375 °C. No battery, no reader, no infrastructure.',
      },
      {
        num: 'II',
        title: 'Cryptographic identity and 2FA',
        desc: 'The same tag worn in the field acts as a hardware security key when logging into operational apps and systems on COTS devices. No separate token, no proprietary card reader. CAC/PIV requires dedicated hardware that does not work on commercial devices — Hexa works on any NFC-enabled phone.',
      },
      {
        num: 'III',
        title: 'Tiered medical data store',
        desc: 'Emergency medical data stored directly on the card, readable by any NFC phone — without network access. Sensitive records protected behind authenticated access: one card, two security tiers. IPS-structured format enables interoperability with national and allied healthcare systems.',
      },
    ],
    prodEyebrow: 'PRODUCT LINE',
    prodH: 'Two products. One platform.',
    prodSub: 'Same form factor, same readers, no retraining required. Upgrade from Hexa to Hexa Trinium as requirements evolve.',
    products: [
      {
        label: 'STANDARD',
        name: 'Hexa',
        tech: 'DESFire EV3 · AES-256 · NFC',
        desc: 'COTS-based and field-ready. AES-256 encryption with offline-first architecture. Compatible with standard NFC readers, no special hardware required. Designed for broad deployment across civil preparedness and field operations.',
        features: ['AES-256 encryption', 'Offline-first — no network required', 'Standard NFC readers', 'Pilot Q3 2027'],
        flagship: true,
      },
      {
        label: 'HIGH SECURITY',
        name: 'Hexa Trinium',
        tech: 'JCOP JavaCard · PKI/ECC · STANAG',
        desc: 'Full PKI and JavaCard secure element with ECC-based identity credentials. STANAG-compatible and upgradeable from Hexa standard — without changing readers or retraining staff.',
        features: ['ECC-based PKI', 'STANAG-compatible', 'Same form factor as Hexa', 'Production 2028'],
        flagship: false,
      },
    ],
    tlEyebrow: 'DELIVERY TIMELINE',
    tlH: 'Defined platform. Clear milestones.',
    tlSub: 'Hardware platform is design-frozen. Built exclusively on standard components — manufacturing is not the critical path.',
    timeline: [
      { period: 'Q1 2027', label: 'Clinical workflow validation with healthcare professionals' },
      { period: 'Q2 2027', label: 'Hexa technical demonstration, enrolment flow and card production' },
      { period: 'Q3 2027', label: 'Hexa pilot-ready, 50–100 units for field evaluation' },
      { period: '2028',    label: 'Production series both products, domestic manufacturing' },
    ],
    useEyebrow: 'USE CASES',
    useH: 'Dual use.',
    useSub: 'Hexa is built for dual use from the ground up. The same system identifies operational personnel, emergency responders, rescue services and civil defence personnel — one procurement decision covers both sides of the total defence spectrum.',
    cases: [
      {
        domain: 'MILITARY',
        title: 'Armed Forces · NATO',
        items: [
          'Field identification and medical triage',
          'NATO interoperability via STANAG and IPS',
          'Offline authentication without network',
          'TCCC record follows the casualty through CASEVAC',
        ],
      },
      {
        domain: 'CIVIL',
        title: 'MSB · Total defence',
        items: [
          'Emergency services, rescue and civil defence',
          'Crisis management and CBRN scenarios',
          'COTS reader compatibility — any NFC phone',
          'Sovereign data infrastructure under Swedish control',
        ],
      },
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

const NAV_ANCHORS = ['#what', '#products', '#timeline', '#about']

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
          <p style={{ fontSize: 'clamp(16px, 1.8vw, 19px)', color: '#94A3B8', lineHeight: 1.7, margin: '0 0 28px', maxWidth: 580 }}>
            {t.sub}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 44 }}>
            {t.tags.map(tag => (
              <span key={tag} style={{ fontFamily: BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#3B82F6', border: '1px solid #1E3A5F', padding: '5px 13px' }}>
                {tag}
              </span>
            ))}
          </div>
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

      {/* ── TIMELINE ── */}
      <section id="timeline" style={{ background: '#F3F5F9' }} className="px-6 md:px-14 py-20">
        <p style={{ fontFamily: BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.45em', color: '#1D4ED8', textTransform: 'uppercase', margin: '0 0 14px' }}>{t.tlEyebrow}</p>
        <h2 style={{ fontFamily: BC, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, lineHeight: 1.1, color: '#0C1117', margin: '0 0 14px' }}>{t.tlH}</h2>
        <p style={{ fontSize: 17, color: '#546077', lineHeight: 1.7, maxWidth: 600, margin: '0 0 52px' }}>{t.tlSub}</p>
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 1, background: '#DDE3EC', border: '1px solid #DDE3EC' }}>
          {t.timeline.map(item => (
            <div key={item.period} style={{ background: '#fff', padding: '28px 28px', borderTop: '3px solid #1D4ED8', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontFamily: BC, fontSize: 22, fontWeight: 800, color: '#1D4ED8', lineHeight: 1 }}>{item.period}</span>
              <p style={{ fontSize: 14, color: '#546077', lineHeight: 1.6, margin: 0 }}>{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section id="usecases" style={{ background: '#fff' }} className="px-6 md:px-14 py-20">
        <p style={{ fontFamily: BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.45em', color: '#1D4ED8', textTransform: 'uppercase', margin: '0 0 14px' }}>{t.useEyebrow}</p>
        <h2 style={{ fontFamily: BC, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, lineHeight: 1.1, color: '#0C1117', margin: '0 0 14px' }}>{t.useH}</h2>
        <p style={{ fontSize: 17, color: '#546077', lineHeight: 1.7, maxWidth: 640, margin: '0 0 52px' }}>{t.useSub}</p>
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
      <section id="about" style={{ background: '#0C1117' }} className="px-6 md:px-14 py-20 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
        <div>
          <p style={{ fontFamily: BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.45em', color: '#3B82F6', textTransform: 'uppercase', margin: '0 0 14px' }}>{t.aboutEyebrow}</p>
          <h2 style={{ fontFamily: BC, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, lineHeight: 1.1, color: '#F1F5F9', margin: '0 0 14px' }}>{t.aboutH}</h2>
          <p style={{ fontSize: 16, color: '#94A3B8', lineHeight: 1.75, margin: '0 0 18px', maxWidth: 420 }}>{t.aboutP1}</p>
          <p style={{ fontSize: 16, color: '#94A3B8', lineHeight: 1.75, margin: 0 }}>{t.aboutP2}</p>
        </div>
        <div className="self-start" style={{ background: '#0F1E35', border: '1px solid #1E3A5F', borderTop: '3px solid #3B82F6', padding: 36, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontFamily: BC, fontSize: 11, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#3B82F6' }}>{t.contactRole}</span>
          <h3 style={{ fontFamily: BC, fontSize: 24, fontWeight: 700, color: '#F1F5F9', margin: 0 }}>Erik Obitz</h3>
          <div style={{ fontFamily: BC, fontSize: 18, fontWeight: 600, color: '#3B82F6', marginTop: 8, wordBreak: 'break-all' }}>erik.obitz@hexatec.se</div>
          <p style={{ fontSize: 14, color: '#94A3B8', margin: 0 }}>073 735 10 36</p>
          <p style={{ fontSize: 14, color: '#94A3B8', margin: 0 }}>hexatec.se</p>
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
