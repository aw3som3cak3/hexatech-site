# ADR-0042: Open ring front face and circumferential parting-line groove

- **Status:** Accepted
- **Date:** 2026-11-04
- **Principles:** P2, P4, P5
- **Supersedes:** —
- **Amends:** ADR-0022 (changes the ring cavity geometry; ring front face is open, not closed)

## Context

The ring geometry established in ADR-0022 encloses the core inside a closed shell: front face
plate, back face plate, and rim form an opaque hex medallion. No external feature signals that
the tag has two separable parts. A first-time user holding the assembled tag cannot infer the
two-part architecture from the exterior.

This was identified as a critical usability gap: the operational separation procedure (push
0.3 mm, twist 30°, pull from back) cannot be inferred from the exterior of the current design.
Reference designs that achieve immediate legibility:

- **US M1940 dogtag:** two identical pieces on the same chain. Identical form = "these go
  together." Two holes + one chain = "one comes off and one stays." Zero ambiguity from first
  glance.
- **Swedish Försvarsmakten:** one piece with a notched lower segment. The notch is a visual and
  tactile weak line — you can see the split before you understand the mechanism.

The shared principle: **make the separation line visible before the user understands the
mechanism.** The affordance precedes the instruction.

## Decision

### 1. Remove the ring front face plate (RING_FRONT_OPEN = True)

The inner cavity extrude is extended from `z = RING_FACE_T` to `z = RING_T`, removing the
front face plate entirely. The cavity is open at the front; the core face is visible and
accessible from the front of the assembled tag. The ring becomes a hex frame; the core face
is what the viewer sees.

The bayonet lugs (ADR-0022) provide the sole axial retention with the front plate removed.
The front plate was a secondary stop; the bayonet engagement is structurally adequate without it.

**What this achieves:** a viewer immediately sees two distinct objects — a grey outer ring and
a blue inner face (ADR-0041 colour split). The core reads as a foreign element inside the ring.
The viewer's mind recognises it as removable without instructions. The same mechanism that makes
the Swedish notch legible (visible separation boundary) is achieved here through open geometry
rather than a stress concentrator.

**NFC consequence:** the exposed core face makes Chip B more accessible for NFC reads from the
front. Chip B is auth-gated (ADR-0022); exposing its face does not expose its data. Chip A
remains in the ring rim (radial antenna, unchanged).

### 2. Add a circumferential parting-line groove

Add a 0.5 mm wide × 0.4 mm deep circumferential groove on the ring inner bore wall, at
`z = RING_FACE_T` (the front edge of the core seating plane). When the core is seated, this
groove appears as a continuous shadow line around the core perimeter — the parting boundary is
visible in assembled state.

New parameters in `params.py`:

```
PART_LINE_W: float = 0.5   # mm — circumferential groove width
PART_LINE_D: float = 0.4   # mm — groove depth into inner bore wall
```

This is the Hexa equivalent of the Swedish notch. Where the Swedish tag uses a stress-
concentrating notch to signal "this breaks here," Hexa uses a parting groove to signal "this
separates here." Both communicate the separation boundary before the mechanism is understood.

### 3. Set CORE_FLUSH_DEPTH = 0.5 mm

The core face is recessed 0.5 mm below the ring's front bore edge. With the front plate removed,
this creates:

- A visible shadow line around the core perimeter (the grey rim edge casts a shadow on the blue
  core face, amplifying the perceived separation boundary).
- A fingernail purchase point: the user can feel and leverage the 0.5 mm step to initiate the
  push-and-twist separation from the front.

## Principle tests

**P2 (tag is a cache):** Visual legibility of the two-part architecture is a form of offline
user instruction. When no network, no manual, and no training is available, the physical object
itself must communicate how it works. The open front face achieves this. ✓

**P4 (semantically quiet):** The parting groove and open front face are geometric affordances;
they carry no data and do not affect the data format or coding of any field. ✓

**P5 (owner controls content):** Geometry change does not affect what data the owner may
include or exclude. ✓

## Consequences

- The ring's `build_ring()` function in `hexatech-tag-cad` requires a geometry change:
  `cavity_h = ring_t - face_t` (instead of `ring_t - 2 * face_t`) when `RING_FRONT_OPEN = True`.
- An annular groove subtraction at `z = RING_FACE_T` is added to `build_ring()`.
- `CORE_FLUSH_DEPTH` changes from 0.0 to 0.5 in `params.py`.
- The bayonet engagement geometry (ADR-0022) is unchanged. Hardware validation (OQ-13) must
  confirm that bayonet-only retention is sufficient without the front plate.
- Concept decks in `docs/assets/` showing the tag as a closed medallion need regenerating.

## Alternatives considered

**Keep front plate, add external colour band.** A coloured band around the ring rim would
signal the two-part architecture without geometry change. Rejected: a colour band applied to
the exterior (anodize or paint) would need to extend across the parting line, which is in a
recessed bore not visible from outside. The open front face makes the two-part boundary
unambiguous; the colour band is a weaker signal.

**Engrave "RING / CORE" on the exterior.** Text labels could name the two parts. Rejected as
primary affordance: text requires literacy and language match; geometry works across languages
and training levels. Text is included as a tertiary affordance (ADR-0043, back face instruction).

**Notch the ring rim at the parting plane.** A continuous notch around the outer rim at the
ring/core boundary plane. Rejected: the rim carries the engraved facets (ADR-0040); a notch
would interrupt the engraving surface and reduce structural section at the attachment vertex.
