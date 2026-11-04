# ADR-0048: Ring construction — Ti outer shell with polymer electronics carrier

- **Status:** Accepted
- **Date:** 2026-11-04
- **Principles:** P1, P2, P10
- **Amends:** ADR-0041 (adds construction detail beyond material grade), ADR-0022 (refines NFC antenna topology for the ring), ADR-0040 (updates chain-mount single-hole threading)

## Context

ADR-0041 fixes the ring's material as Grade 5 Titanium. It does not specify whether the ring
is a homogeneous solid or a composite construction. That deferral is closed here.

Two ring constructions are architecturally distinct because the antenna topology of Chip A
(ring-side NFC chip) differs between them:

**Construction A — solid conductive Ti ring with slotted-ring antenna.**
The Ti ring is itself the antenna: a narrow slot (1.2 mm × 2.0 mm, full ring height) is cut
through one flat face of the rim. The slot forces RF current around the gap, making the entire
ring act as a one-turn loop. Chip A's two feed traces bridge the slot gap. Chip A *must* sit
at the slot gap — routing traces across the conductive Ti body would short the feed. The chip
is therefore at an exposed cut on the outer rim, exposed to the elements, wear, and mechanical
stress during core twist-removal (the bayonet slot on the same face).

**Construction B — Ti outer shell, polymer inner carrier, flat coil antenna.**
The outer ring is Ti Gr5 (consistent with ADR-0041 material and finish spec). The inner bore
carries a thin polymer electronics carrier: a hex-shaped insert that lines the inner cavity,
housing Chip A and a flat 2-turn hex coil antenna in the ring opening. The chip is fully
enclosed within polymer; the Ti shell carries all structural load (bayonet torques, wear,
chain tension). The antenna is a flat coil, not the ring body — the slot is not needed.

The antenna slot does not function as a viable antenna in Construction B because the Ti shell
would induce eddy currents cancelling a coil placed inside a fully-closed metal shell. In
Construction B the slot is therefore absent, restoring a structurally continuous rim and
eliminating the exposed cut where Chip A would otherwise sit.

## Decision

**Construction B: Ti Gr5 outer shell with polymer inner electronics carrier.**

The ring's visible and structural form is Ti Gr5 to the full spec of ADR-0041 (bead-blast
finish, ring; anodize blue, core). The antenna slot cut is **not present** in the ring rim.
Chip A and a 2-turn flat hex coil antenna are housed in a polymer inner carrier bonded into
the ring's inner bore cavity.

### Antenna topology

The flat coil geometry: 2 turns, hexagonal profile, turn circumradii approximately 0.86× and
0.68× the inner hex opening circumradius (≈ 14.1 mm and ≈ 11.1 mm). Coil rests on the back
face of the polymer carrier (z ≈ 0.3 mm from the ring back face). Chip A sits on the outer
rim portion of the carrier at the face **opposite** the former slot position, connected to the
coil by a short radial feed trace. Effective antenna area: approximately 1.3 cm² per 2-turn
turn at 13.56 MHz (ISO 14443A). Expected read range: 2–4 cm — adequate for the medic-reader
use case (ADR-0007).

A bench test against a plain-coil tag in the same field geometry is required before the coil
dimensions are locked. The figures above are nominal starting values.

### Chip A placement

Chip A is embedded in the polymer carrier, inset 0.3 mm from the ring back face, fully
enclosed. It is **not** at any outer rim cut, groove, or exposed edge. This eliminates the
mechanical vulnerability of the slotted-ring approach.

### Single chain hole (amends ADR-0040)

ADR-0040 specified two Z-direction holes (axial, top-to-bottom through the tab). Without the
slot, the top vertex is a continuous solid block. The chain mount is redesigned as a single
Y-direction hole through the side of the tab at mid-height — the chain threads side-to-side,
both exits going upward toward the neck. This is geometrically simpler, structurally stronger
(less material removed per cross-section), and more natural to thread. The two-hole
anti-rotation function is preserved by the tab's physical width (12 mm) constraining the chain
loop geometry; the tag cannot rotate freely on the chain.

## Principle tests

**P1 (break-glass offline):** Read range 2–4 cm is consistent with a smartphone placed against
the tag. Coil-based coupling is well-characterised and achievable with standard NTAG2x3 tuning.
No offline capability is degraded. ✓

**P2 (tag is a cache):** The polymer carrier is shielded from wear and environmental exposure
by the Ti outer shell. Chip A failure modes (corrosion, impact) are reduced compared to the
exposed-slot placement. If the carrier fails, the ring can be reissued. ✓

**P10 (adopt existing standards):** Flat coil NFC antenna in polymer is the dominant topology
for all NFC wearables (rings, wristbands, keyfobs). ISO 14443 applies. No deviation from
standard antenna engineering. ✓

## Consequences

- The antenna slot (params: `ANTENNA_SLOT_W`, `ANTENNA_SLOT_D`) is no longer cut into the ring.
  These params remain in the codebase for reference but are not applied to `build_ring()` in
  the Construction B geometry. A build flag or separate builder is needed if a Construction A
  prototype is ever wanted for RF comparison.
- The polymer inner carrier is a new manufactured part. It must be bonded into the Ti ring
  before the bayonet engagement surfaces are verified assembled — sequencing the manufacturing
  process.
- Bench RF testing (read range, detuning from Ti shell, coil-to-core proximity effects) is
  required before first prototype release. ADR-0022 notes this as an open hardware risk; this
  ADR adds the specific test obligation.
- The CAD visualisation `build_ring_electronics()` should be updated to show the flat coil
  in the hex opening with Chip A on the opposite face.
- The `worn` scene now shows a single side-hole chain stub (already updated in CAD).

## Alternatives considered

**Construction A (solid Ti, slotted-ring antenna).** Chip at slot gap = chip at exposed cut.
The bayonet mechanism does not stress the slot face directly, but the chip is at the outer
rim in an open channel — exposed to impact, corrosion, and wear over sustained field use.
The slot also weakens the rim at the face with the highest chain-attachment load path.
Rejected for field grade; retained as a valid prototype topology for RF bench comparison.

**Composite ring (polymer outer).** ADR-0022 does not rule this out. ADR-0041 does not address
it. A polymer outer ring would permit a wound coil or a surface-mounted antenna, further
reducing construction complexity. Deferred — a low-cost or disposable variant ADR can adopt
this if warranted.
