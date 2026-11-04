# ADR-0045: Correct chip A / chip B data assignment stated in ADR-0040

- **Status:** Accepted
- **Date:** 2026-11-04
- **Principles:** P1, P2
- **Amends:** ADR-0040 (separation doctrine section)

## Context

ADR-0040 (physical identification layer, 2026-11-02) describes the separation doctrine as:

> Ring: stays with the casualty. Carries the full Tier 1 digital record (via Chip A) …
> A responder with only the ring can … read the full medical record from Chip A.

ADR-0038 (chip A ring-only profile, 2026-11-01) was accepted one day earlier and established
a different assignment:

- **Chip A (ring):** ring-only profile — red-flag text + tag locator only. No full Tier 1.
- **Chip B (core):** full signed Tier 1 profile.

ADR-0040's separation doctrine was written before the chip A scope was finalised and was not
updated when ADR-0038 was accepted. The two accepted ADRs now contradict each other on a
critical operational question: what does a medic have when only the ring is present?

An external architectural review flagged this as a live contradiction in accepted documentation
that could create false confidence in what has already been decided.

## Decision

The correct assignment, as established by ADR-0038, is:

**Ring (Chip A):** carries the ring-only profile — the owner's red-flag line and a pairwise tag
locator. When the core is absent, Chip A provides the minimum needed to avoid the most dangerous
first-responder errors and to identify the casualty's account when a network connection becomes
available. It does **not** carry the full Tier 1 profile.

**Core (Chip B):** carries the full signed Tier 1 profile (medication list, allergy codes,
condition codes, casualty log). The core is the carrier of the complete medical record.

**Corrected separation doctrine** (replaces the equivalent section in ADR-0040):

| Part | Stays with | Digital layer | Offline emergency use |
|------|-----------|---------------|-----------------------|
| Ring | Casualty | Chip A — ring-only profile (red-flag + locator) | Red-flag line readable without Chip B, without network |
| Core | Reporting party / records | Chip B — full Tier 1 | Full profile available when core is present |

A responder with only the ring can read the red-flag line from Chip A and identify the casualty
from the engraving. They cannot read the full medication list, allergy codes or casualty log
without the core. This is the correct and intended behaviour per ADR-0038.

A records officer with only the core can retrieve the full Tier 1 from Chip B and identify the
individual from the engraving and the tag locator.

Neither half is anonymous after separation; but the ring no longer claims to carry the full
medical record.

## Consequences

- The offline break-glass capability of the ring is correctly bounded: red-flag + locator,
  not full Tier 1. P1 is still satisfied — an authorised medic can read the break-glass
  minimum from the ring with no network.
- Any documentation, marketing material or concept decks that describe the ring as carrying
  "the full medical record" must be corrected.
- The practical operational constraint: a medic who finds a ring without its core has the
  red-flag line and can call for the core. They do not have the full profile offline.
- This correction has no impact on the PoC implementation — the PoC already implements
  ADR-0038's ring-only profile, not a full Tier 1 on Chip A.

## Alternatives considered

**Amend ADR-0040 in place:** ADR-0040 is an accepted ADR. Per project convention, accepted ADRs
are not rewritten; a new ADR that supersedes or amends the relevant section is the correct path.
