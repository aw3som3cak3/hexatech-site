# ADR-0040: Physical identification layer — engraving content, chain mount, and separation doctrine

- **Status:** Accepted
- **Date:** 2026-11-02
- **Principles:** P1, P2, P3, P5
- **Supersedes:** —
- **Amends:** ADR-0022 (fills in the engraving and chain-mount detail left open there)

## Context

ADR-0022 states "Geneva fields on the six facets; service number and nation on the core" without
specifying which fields, why those fields, how the tag is carried, or what happens to the data
when the tag separates.

Three concrete problems drove this ADR:

**1. Identification must survive loss of the digital layer.**
If the NFC chips fail, are destroyed, or cannot be read (no power, hostile RF, dead reader), the
tag must still allow a responder to identify the casualty from the physical object alone. This is
the same problem the original dog-tag solved in 1906 — it is not new, and the solution is the
same: stamped or engraved marks on a durable surface.

**2. The tag separates in use — both halves must be independently identifiable.**
ADR-0022 establishes that the ring stays with the casualty and the core travels to records. If
only one part carries identifying marks, the other half is anonymous after separation. This has
been the military doctrine for dogtag pairs since at least WWII: each piece must identify the
person without reference to the other.

**3. Chain attachment must prevent rotation.**
A tag on a single lanyard hole rotates freely on the chain. The engraved fields then face
unpredictably — the tag may be face-down when a responder needs to read it, and the NFC read
geometry (antenna slot on the ring face) is compromised if the tag is not oriented correctly
against the reader. Traditional military dogtags (Swedish Försvarsmakten, US M1940) solved this
with two holes threaded through the chain, locking orientation.

## Decision

### Engraving content

Both ring and core carry laser-engraved fields on their six flat facets.

**Ring facets** (RING_T = 5.2 mm height, 1.5 mm character height):

| Facet | Field | Rationale |
|-------|-------|-----------|
| 0 | SURNAME | Primary identification — unique in combination with short-ID |
| 1 | GIVEN NAME | Disambiguation |
| 2 | ID-A | First 8 characters of the 16-character enrollment short-ID |
| 3 | ID-B | Last 8 characters of the enrollment short-ID |
| 4 | UNIT | Operational context for the receiving unit |
| 5 | NFC | Marks the tag as electronic; prompts NFC read attempt |

**Core facets** (CORE_T = 2.8 mm height, 1.0 mm character height): same six fields.
The smaller character height is a manufacturing constraint, not a data-reduction; both pieces
carry the full identification.

**No blood type.** ADR-0014 removes blood type from all tiers. It does not appear on the
physical engraving either. Acting on a wrong blood type causes direct patient harm; the risk
outweighs the benefit when typed blood is available in the field within minutes via portable
analysers.

**Enrollment short-ID.** The chip UUID is 32 hex characters — too long to engrave readably at
field character heights. At enrollment, a 16-character short-ID is derived from the first
16 characters of the chip UUID. This ID is the link between the physical tag and the digital
record; it is not secret and does not need to be. Split as ID-A (first 8) and ID-B (last 8)
across two adjacent facets so a responder reading under poor conditions can confirm both halves
independently.

### Chain mount: two-hole threading

The ring carries two Ø 3.2 mm holes at the top vertex, 6 mm apart centre-to-centre, both
running axially through the rim (Z-axis). The ball chain (standard: 2.4 mm bead, 1.6 mm neck,
stainless steel per NATO STANAG dimensions) is threaded through both holes, bridging behind the
tag. This prevents rotation: the tag hangs with one flat face forward consistently.

The top vertex is the correct attachment point for a hex tag: the tag hangs point-down, placing
the largest flat faces (with the engraved fields and the NFC antenna slot) in the optimal read
plane. A flat-face attachment would orient the tag sideways.

Both holes receive a 0.6 mm chamfer on entry and exit faces to prevent the chain neck wearing
a groove into the hole edge over time.

### Engraving method: laser, not stamped plate

Laser engraving directly on the unit. The stamped-plate approach used on legacy dogtags (US
and Swedish) was driven by the manufacturing technology available at the time — lasers did not
exist. A laser-engraved field on Ti Gr 5 or 316L is more durable (no plate edge to lift,
no adhesive to fail), requires no separate part, and is compatible with the parametric geometry
without adding a recessed plate-seat feature.

### Separation doctrine

Ring: stays with the casualty. Carries the full Tier 1 digital record (via Chip A), the
casualty log, and the engraved identification.

Core: goes with the reporting party to records. Carries the identity reference (via Chip B,
ADR-0023/0024), and the engraved identification.

Neither half is anonymous after separation. A responder with only the ring can identify the
casualty from the engraving and read the full medical record from Chip A. A records officer
with only the core can identify the individual from the engraving and retrieve the account
record via the short-ID.

## Consequences

- Manufacturing requires a laser engraving step. This is standard practice for precision metal
  parts; no unusual tooling.
- The 16-character short-ID must be generated and stored at enrollment time (backend links
  short-ID → chip UUID). The enrollment CLI must produce and record it.
- The `worn` CAD scene (two chain stubs through both holes, bridge behind) demonstrates correct
  chain threading for manufacturing and field-testing reference.
- Open Question 18 (frame material) is not resolved here. The engraving spec assumes laser on
  metal. A polymer or composite variant would need a re-evaluation of engraving durability.
- Character heights (1.5 mm ring, 1.0 mm core) set a minimum on manufacturing precision.
  Standard laser engraving on flat metal achieves 0.5 mm without difficulty; both heights are
  within normal production tolerance.

## Alternatives considered

**Single lanyard hole.** Simpler geometry, but the tag rotates freely on the chain. Rejected:
field orientation matters for NFC read geometry, and an unreadable engraving is a safety gap.

**Stamped ID plate fitted into a recess.** Historical precedent, but adds a separate part,
an assembly step, and a failure mode (plate separates from tag). No benefit over laser engraving
on the unit itself given current manufacturing access. Rejected.

**Blood type on physical engraving.** Rejected by ADR-0014 reasoning: wrong blood type causes
direct patient harm; portable analysers make pre-engraved blood type unnecessary in any context
where the NFC tag would be used.

**Full UUID engraved.** 32 hex characters at 1.5 mm character height would require ~64 mm of
linear space — more than the full circumference of the ring rim (6 facets × 20 mm = 120 mm, but
shared with name fields). A 16-character short-ID is sufficient as a lookup key.
