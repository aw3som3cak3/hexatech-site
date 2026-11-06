const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-4">{title}</h2>
    {children}
  </section>
)

const Step = ({ n, children }: { n: number; children: React.ReactNode }) => (
  <div className="flex gap-4 mb-3">
    <span className="font-mono text-xs text-zinc-600 w-5 shrink-0 pt-0.5">{n}.</span>
    <div className="text-sm text-zinc-300 leading-relaxed">{children}</div>
  </div>
)

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="font-mono text-xs bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-amber-300">{children}</code>
)

const Block = ({ children }: { children: string }) => (
  <pre className="font-mono text-xs bg-zinc-900 border border-zinc-800 px-4 py-3 text-zinc-300 overflow-x-auto my-3 whitespace-pre">{children}</pre>
)

export default function SetupPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full">
      <h1 className="font-mono font-bold text-2xl text-zinc-100 mb-1">Testing setup</h1>
      <p className="text-zinc-500 text-sm mb-10">Three tiers: protocol tests (no hardware), backend (local), physical NFC (two Android devices)</p>

      <Section title="Protocol tests — no hardware needed">
        <p className="text-sm text-zinc-400 mb-3">
          64+ tests covering the full pipeline: CBOR schema, PKI chain, Chip A/B APDU handshake,
          Rekor receipt, backend API, and GDPR erasure.
        </p>
        <Step n={1}>Install Python 3.11+</Step>
        <Step n={2}>
          <Code>pip install -r requirements.txt</Code>
        </Step>
        <Step n={3}>
          Run all tests:
          <Block>pytest schema/ pki/ chip_a/ enrollment/ api/ tests/ -v</Block>
        </Step>
        <Step n={4}>
          E2E integration test only (full 11-step pipeline):
          <Block>pytest tests/test_e2e.py -v</Block>
        </Step>
      </Section>

      <Section title="Backend — local">
        <p className="text-sm text-zinc-400 mb-3">
          FastAPI + SQLite. Runs the profile store, receipt mutable store, and GDPR delete endpoint.
        </p>
        <Step n={1}>
          Start the server:
          <Block>uvicorn api.main:app --reload --host 0.0.0.0 --port 8000</Block>
        </Step>
        <Step n={2}>
          API docs (Swagger UI): <Code>http://localhost:8000/docs</Code>
        </Step>
        <Step n={3}>
          Key endpoints: <Code>POST /v1/profiles</Code> · <Code>GET /v1/profiles/{"{tag_id_hex}"}</Code> · <Code>GET /v1/profiles/by-short-id/{"{short_id}"}</Code> · <Code>DELETE /v1/receipts/{"{id}"}</Code>
        </Step>
      </Section>

      <Section title="Physical NFC testing — two Android devices">
        <p className="text-sm text-zinc-400 mb-3">
          Tag device (Redmi, dedicated): runs <strong className="text-zinc-300">hexa-tag</strong> — acts as an NFC card via Android HCE.<br />
          Reader device (your Android): runs <strong className="text-zinc-300">hexa-medic</strong> — authenticates and reads the profile.
        </p>
        <p className="text-sm font-mono text-zinc-500 mb-3">Prerequisites</p>
        <Step n={1}>Both devices: Android 9+, NFC enabled</Step>
        <Step n={2}>Both devices: Developer Options on, USB debugging enabled</Step>
        <Step n={3}>
          Build debug APKs:
          <Block>cd android && ./gradlew assembleDebug</Block>
        </Step>
        <Step n={4}>
          Install on each device via ADB:
          <Block>{"adb -s <tag-device>   install hexa-tag/build/outputs/apk/debug/hexa-tag-debug.apk\nadb -s <reader-device> install hexa-medic/build/outputs/apk/debug/hexa-medic-debug.apk"}</Block>
        </Step>
        <Step n={5}>On the tag device: open <strong className="text-zinc-300">Hexa Tag</strong>, tap <strong className="text-zinc-300">Ready</strong></Step>
        <Step n={6}>On the reader device: open <strong className="text-zinc-300">Hexa Medic</strong>, bring phones back-to-back</Step>
        <Step n={7}>
          The medic app authenticates via PKI, reads the Tier 1 profile, and posts a receipt to the
          transparency log and backend.
        </Step>
      </Section>

      <Section title="CAD model — local viewer">
        <Step n={1}>Requires Python 3.12 and VS Code with the OCP CAD Viewer extension</Step>
        <Step n={2}>
          Set up environment:
          <Block>cd hexatech-tag-cad && .\make.ps1 venv</Block>
        </Step>
        <Step n={3}>
          Open a scene in VS Code:
          <Block>{".\make.ps1 view -Scene assembly   # or: ring, core, exploded, worn"}</Block>
        </Step>
        <Step n={4}>
          Export files:
          <Block>{".\make.ps1 gltf   # GLTF for web viewer\n.\make.ps1 step   # STEP for CAD tools\n.\make.ps1 stl    # STL for slicer/print"}</Block>
        </Step>
        <Step n={5}>
          Copy GLTF exports to this site:
          <Block>{"copy hexatech-tag-cad\\out\\gltf\\*.gltf hexatech-site\\public\\models\\"}</Block>
        </Step>
      </Section>

      <Section title="CI / automated tests">
        <p className="text-sm text-zinc-400 mb-3">
          GitHub Actions runs on every push:
        </p>
        <Step n={1}><Code>python-ci.yml</Code> — all Python tests (schema, PKI, Chip A, enrollment, API, E2E)</Step>
        <Step n={2}><Code>android-ci.yml</Code> — Robolectric unit tests (CBOR, APDU handlers, receipt builder) — JVM, no emulator needed</Step>
        <Step n={3}>NFC system tests are manual — requires the two physical devices above</Step>
      </Section>
    </div>
  )
}
