# ADR-0043: Back-face operation instruction engraving — TURN ↺ PULL

- **Status:** Accepted
- **Date:** 2026-11-04
- **Principles:** P2, P5
- **Supersedes:** —
- **Amends:** ADR-0040 (adds back-face instruction engraving; ADR-0040 specifies rim facets only)

## Context

ADR-0040 specifies the engraving content for the six rim facets of both ring and core:
SURNAME / GIVEN NAME / ID-A / ID-B / UNIT / NFC. It does not address the back face plate.

ADR-0022 establishes the bayonet separation mechanism: push 0.3 mm axially, twist 30° to clear
the bayonet lugs, then pull the core from the back. This is not a self-evident operation. A user
encountering the tag for the first time — particularly under stress, in a field environment, with
no training recall — cannot infer the push-twist-pull sequence from the exterior.

ADR-0042 addresses the visual affordance (open front face, parting groove). This ADR adds the
textual affordance: a brief operation instruction on the face encountered at the moment of use.

**The moment of use:** when a medic needs to separate ring from core, they turn the tag over to
access the back face, where the bayonet bore entrance is. The instruction is placed on that face.
It is encountered precisely when it is needed.

## Decision

Engrave **"TURN ↺ PULL"** on the back face plate of the ring, arc-engraved around the core
bore entrance. Character height: 1.0 mm. The text follows the circular bore perimeter; the
rotation arrow (↺) is centred to indicate the twist direction (anticlockwise when viewed from
the back, which corresponds to the bayonet release direction).

This is a gap-fill to ADR-0040. ADR-0040's six rim-facet fields are identity fields — they must
be legible at distance and are read by any responder who finds the tag. The back-face instruction
is an operation field — it is read only by the person actively separating the parts, in close
proximity, with the tag in hand.

## Principle tests

**P8 (no clinical decision support):** "TURN ↺ PULL" is a mechanical operation instruction for
the physical device. It does not compute, infer, prioritise, or recommend any clinical action.
The P8 prohibition covers medical recommendations and computed health flags; this text is of the
same character as the printed instructions on a syringe cap or IV connector. ✓

**P2 (tag is a cache):** A physical instruction on the device itself is the most robust form
of user guidance — it is available offline, requires no training recall, and cannot be lost or
outdated separately from the device. ✓

**P5 (owner controls content):** The back-face instruction is a fixed device marking, not owner
data. It is analogous to a stamped calibre marking on a firearm — a property of the device
itself, not content the owner adds or removes. This is consistent with P5 because P5 governs
identity and medical data content, not device operation markings. ✓

## Consequences

- Manufacturing requires engraving the back face in addition to the six rim facets. The back
  face is flat and geometrically simpler to engrave than the rim facets; no additional tooling
  is required beyond what ADR-0040 already specifies.
- The arc-engraving path around the bore must be generated in the engraving CAM file. The bore
  radius (from `params.py`) sets the arc radius; the character height (1.0 mm) sets the
  standoff from the bore edge.
- The instruction is on the ring back face only. The core does not carry a matching instruction;
  the core does not need to be turned or twisted.
- If RING_FRONT_OPEN (ADR-0042) is set, the back face is the only closed face plate; it carries
  both the bayonet bore and this instruction. This is consistent — the back face is the
  separation interface.

## Alternatives considered

**Instruction on a rim facet.** The six rim facets carry identity fields (ADR-0040). Adding an
operation instruction would displace or compete with identity information. Rejected: identity
legibility at distance is the primary function of the rim facets; operation instructions belong
on the face encountered during the operation.

**Instruction booklet / QR code.** A QR code on the tag linking to a video or document. Rejected:
requires a powered device with network access; fails the offline-first principle (P2); fails at
the exact moment a printed instruction would succeed.

**No instruction (rely on training).** Users are trained on the separation procedure before
deployment. Rejected as sole mechanism: training recall degrades under stress; the tag will be
encountered by people who were not trained on this specific device (allied responders, NGO
personnel, civilian medical staff). A physical instruction costs one engraving path and pays
off in the cases where training is unavailable.
