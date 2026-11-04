'use client'
// 3D viewer using Google model-viewer web component with GLTF files exported from build123d.
// Generate models: cd hexatech-tag-cad && .\make.ps1 gltf → copy out/gltf/*.gltf to public/models/
// Generate renders: cd hexatech-tag-cad && .venv\Scripts\python tools/hexarender.py --skriv --push

import Script from 'next/script'
import Image from 'next/image'
import { useState, createElement } from 'react'

// model-viewer is a custom element — use createElement to avoid JSX type errors
const ModelViewer = (props: Record<string, unknown>) => createElement('model-viewer', props)

const SCENES = [
  { id: 'assembly', label: 'Assembly' },
  { id: 'ring',     label: 'Ring' },
  { id: 'core',     label: 'Core' },
  { id: 'exploded', label: 'Exploded' },
  { id: 'worn',     label: 'Worn (chain)' },
  { id: 'renders',  label: 'Renders' },
]

const RENDERS = [
  { src: '/renders/hexa-assembly.png', label: 'Assembly — 3/4 view' },
  { src: '/renders/hexa-worn.png',     label: 'Worn on chain' },
]

export default function ModelPage() {
  const [scene, setScene] = useState('assembly')
  const [missing, setMissing] = useState(false)

  return (
    <div className="flex flex-col" style={{ height: 'calc(100dvh - 48px)' }}>
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
      />
      <nav className="flex gap-2 p-3 bg-zinc-900 border-b border-zinc-800 overflow-x-auto shrink-0">
        {SCENES.map(s => (
          <button
            key={s.id}
            onClick={() => { setScene(s.id); setMissing(false) }}
            className={`px-3 py-1 text-sm font-mono whitespace-nowrap transition-colors ${
              scene === s.id
                ? 'bg-zinc-100 text-zinc-900'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {scene === 'renders' ? (
        <div className="flex-1 overflow-y-auto bg-zinc-950 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {RENDERS.map(r => (
              <div key={r.src} className="flex flex-col items-center gap-3">
                <div className="relative w-full" style={{ aspectRatio: '1 / 1' }}>
                  <Image src={r.src} alt={r.label} fill className="object-contain" unoptimized />
                </div>
                <span className="font-mono text-xs text-zinc-500">{r.label}</span>
              </div>
            ))}
          </div>
          <p className="font-mono text-xs text-zinc-700 text-center mt-8">
            Blender Cycles · titanium PBR · transparent background
          </p>
        </div>
      ) : missing ? (
        <div className="flex-1 flex items-center justify-center text-zinc-500 font-mono text-sm p-8 text-center">
          <div>
            <div className="text-amber-400 mb-2">Models not yet generated</div>
            <code className="text-xs bg-zinc-900 px-3 py-2 block">
              cd hexatech-tag-cad{'\n'}.\make.ps1 gltf{'\n'}# copy out/gltf/*.gltf → public/models/
            </code>
          </div>
        </div>
      ) : (
        <ModelViewer
          src={`/models/${scene}.gltf`}
          alt={`Hexa tag — ${scene}`}
          camera-controls={true}
          auto-rotate={true}
          auto-rotate-delay={2000}
          rotation-per-second="20deg"
          environment-image="neutral"
          shadow-intensity="2"
          shadow-softness="0.8"
          exposure="1.1"
          style={{ width: '100%', flex: 1, background: '#09090b' }}
          onError={() => setMissing(true)}
        />
      )}
    </div>
  )
}
