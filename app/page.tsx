import Link from "next/link";
import Image from "next/image";

const WEEKS = [
  { n: 1, label: "CBOR schema & types" },
  { n: 2, label: "Test PKI chain (CVCA→DV→Terminal)" },
  { n: 3, label: "Android HCE service (hexa-tag)" },
  { n: 4, label: "PKI auth handshake (auth-gated read)" },
  { n: 5, label: "Rekor transparency log + enrollment CLI" },
  { n: 6, label: "FastAPI backend (profile store, GDPR delete)" },
  { n: 7, label: "Chip A ring-only profile + E2E integration test" },
];

const CURRENT = ["Android transport abstraction", "Robolectric CI", "Team site"];

const CARDS = [
  { href: "/model",     label: "3D Model",   desc: "Interactive assembly, ring, core, exploded and worn scenes" },
  { href: "/decisions", label: "Decisions",  desc: "40 architecture decision records with status and principles" },
  { href: "/setup",     label: "Setup",      desc: "Physical NFC testing, local backend, protocol test suite" },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 w-full">
      <div className="mb-12">
        <h1 className="text-4xl font-mono font-bold text-zinc-100 mb-2">Hexa</h1>
        <p className="text-lg text-amber-400 font-mono mb-6">Digital identification for the field</p>
        <p className="text-zinc-400 max-w-2xl leading-relaxed">
          Hexa is a hexagonal NFC tag carrying a signed medical profile, PKI-authenticated reader
          access, and a tamper-evident transparency log. The ring stays with the casualty; the core
          travels to records.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
        {CARDS.map(c => (
          <Link key={c.href} href={c.href}
            className="block border border-zinc-800 bg-zinc-900 p-5 hover:border-zinc-600 transition-colors">
            <div className="font-mono font-semibold text-zinc-100 mb-1">{c.label}</div>
            <div className="text-sm text-zinc-400">{c.desc}</div>
          </Link>
        ))}
      </div>

      <div className="mb-14">
        <h2 className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-4">Product renders</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { src: "/renders/hexa-assembly.png", label: "Assembly" },
            { src: "/renders/hexa-worn.png",     label: "Worn on chain" },
          ].map(r => (
            <div key={r.src} className="bg-zinc-900 border border-zinc-800 p-4 flex flex-col items-center gap-3">
              <div className="relative w-full h-48">
                <Image src={r.src} alt={r.label} fill className="object-contain" unoptimized />
              </div>
              <span className="font-mono text-xs text-zinc-500">{r.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-4">Build status</h2>
        <div className="space-y-2 mb-6">
          {WEEKS.map(w => (
            <div key={w.n} className="flex items-center gap-3">
              <span className="font-mono text-xs text-zinc-500 w-14 shrink-0">Week {w.n}</span>
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              <span className="text-sm text-zinc-300 font-mono">{w.label}</span>
            </div>
          ))}
        </div>
        <div>
          <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">In progress</div>
          <div className="flex flex-wrap gap-2">
            {CURRENT.map(s => (
              <span key={s} className="border border-zinc-700 text-zinc-400 text-xs font-mono px-2 py-0.5">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
