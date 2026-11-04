# ADR-0053: Restore SURNAME engraving on face 0 — antenna slot removed by ADR-0048

- **Status:** Accepted
- **Date:** 2026-11-04
- **Principles:** P2, P3
- **Amends:** ADR-0047 (Decision 1 — no engraving on face 0 — is superseded by this ADR)
- **Depends on:** ADR-0048 (Ti shell + polymer carrier — removes the antenna slot from the ring)

## Context

ADR-0040 assigns the six ring rim facets as follows:

| Facet | Field |
|-------|-------|
| 0 (alpha=90°) | SURNAME |
| 1 | GIVEN NAME |
| 2 | ID-A (first 8 characters of enrollment short-ID) |
| 3 | ID-B (second 8 characters) |
| 4 | UNIT |
| 5 | NFC (chip read indicator) |

ADR-0047 Decision 1 overrides this for face 0:

> "The facet at alpha=90° (facet index 0, `FACET_LABELS["SURNAME"]`) carries the antenna slot.
> No engraving relief pocket and no example text are placed on this face. In production the
> face is laser-clean (the slot is the only feature). The five remaining facets carry all
> owner data."

This decision was correct at the time: the slotted-ring NFC antenna (Construction A) requires
a 1.2 × 2 mm slot cut through face 0, leaving insufficient flat surface for a legible SURNAME
engraving. ADR-0047 Decision 1 therefore marked face 0 as slot-only and noted that "five
remaining facets carry all owner data."

**ADR-0048 removes the premise.** The Ti outer shell + polymer carrier construction (ADR-0048)
eliminates the antenna slot from the ring entirely. The Ti rim is now a continuous solid hex
frame at all six faces. Face 0 has the same flat, uninterrupted surface as faces 1–5.

There is no longer any reason to withhold the SURNAME engraving from face 0. Withholding it
reduces the total owner-data surface to five faces and breaks the original ADR-0040 layout.

## Decision

**Face 0 (alpha=90°, the facet that formerly carried the antenna slot) is restored to its
ADR-0040 assignment: SURNAME.**

All six ring facets now carry owner data as originally specified in ADR-0040. ADR-0047
Decision 1 is superseded. Decisions 2, 3, and 4 of ADR-0047 are unaffected.

The full ring facet layout is restored to:

| Facet | Field | Notes |
|-------|-------|-------|
| 0 | SURNAME | Restored by this ADR |
| 1 | GIVEN NAME | Unchanged |
| 2 | ID-A | Unchanged |
| 3 | ID-B | Unchanged |
| 4 | UNIT | Unchanged |
| 5 | NFC | Unchanged |

The same layout applies to the core facets per ADR-0040; that assignment was never modified.

## Principle tests

**P2 (tag is a cache):** Six engravable faces carry more owner data than five. The SURNAME
field is specifically required on the ring for identification when the core is absent (the
casualty is identified by the ring; the reporting chain takes the core). Withholding SURNAME
from face 0 when no technical constraint requires it reduces the physical identification
capability of the ring. ✓

**P3 (only data that changes emergency action, low harm if wrong):** SURNAME is an
identification field (not a treatment instruction). Its presence on the ring improves correct
casualty identification when the digital layer is unavailable. Its absence from face 0 (while
present on the core) creates an asymmetry between ring and core that could cause confusion in
the field (a responder comparing ring and core facets might not understand why the ring is
missing SURNAME). ✓

## Consequences

- The ring engraving CAM file must include a SURNAME engraving pass on face 0 (alpha=90°).
  This face was previously skipped; it must now be treated identically to faces 1–5.
- The design specification (HX-SPEC-002) correctly follows ADR-0040's six-facet assignment;
  this ADR provides the formal basis for that specification.
- Renders and concept decks that showed only five engraved facets on the ring need updating
  to show all six.
- ADR-0047 Decision 2 ("TURN" on the core front face) remains valid and is unchanged.
- ADR-0047 Decisions 3 (edge chamfers) and 4 (chain routing display) remain valid and
  are unchanged.

## Alternatives considered

**Keep five-facet layout and distribute data differently.** Redistribute one field to the core
only and reduce ring fields to five. Rejected: ADR-0040's symmetric ring/core layout (same
six fields on both) is the foundation of the physical identification system. Asymmetry between
ring and core fields creates operational ambiguity and was not intended.

**Move the SURNAME to face 5 and leave face 0 blank.** Preserve the slot-era convention of
a blank face 0 by shifting SURNAME to face 5 (displacing the NFC indicator). Rejected: the
ADR-0040 layout assigns face 5 to the NFC chip read indicator; the indicator is on face 5
because that is the face closest to the radial antenna in the original topology. Reordering
the layout requires a new ADR to ADR-0040 and creates inconsistency with existing tooling and
documentation. The clean path is to restore the original six-field layout.
