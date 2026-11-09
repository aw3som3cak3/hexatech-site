# ADR-0062: Tag and tear-away data model — card form factor

- **Status:** Proposed
- **Date:** 2026-11-09
- **Principles:** P1, P2, P3, P5
- **Amends:** ADR-0056 (adds data model section)
- **Depends on:** ADR-0060 (identifier model), ADR-0061 (access mode split)
- **Note on ring form factor:** Earlier ADRs (0008, 0022, 0038, 0040, 0045) define a
  two-chip ring form factor with Chip A and Chip B. That terminology and data assignment
  is specific to the ring form factor and does not apply here. The card form factor uses
  the terms **tag** (the JCOP hex card) and **tear-away** (the 316L stainless element).

## Context

ADR-0056 defines the physical form factor — a 54 mm hexagonal JCOP card on a neck chain
with a 316L stainless hexagonal tear-away — but does not formally specify what data each
physical element holds. This gap leaves open which element carries the casualty log, what
the tear-away stores electronically, and how the data model relates to the identifier model
in ADR-0060.

The reviewer noted a chip data-assignment inconsistency across the ring form factor ADRs
(0008, 0022, 0038, 0040, 0045). Those inconsistencies are real but belong to the ring form
factor, which may or may not be built. This ADR defines the card form factor data model
only. Ring form factor data assignment is a separate concern left for if and when that
form factor is revisited.

## Decisions

### Decision 1 — The tag (JCOP hex card) is the sole electronic element

The JCOP card is the only element in the card form factor that carries electronic storage
and NFC communication capability. It holds:

**Tier 0 — Session and authentication state**
- Session token (random, per power cycle — ADR-0060 Decision 3)
- Deployment mode flag (consumer / sovereign — ADR-0061 Decision 3)
- JCOP hardware key pair and chip certificate (chip identity, not exposed as person UUID)

**Tier 1 — Emergency profile**
- Signed HL7 FHIR IPS emergency profile (ADR-0016)
- Read access per ADR-0061: unauthenticated in consumer mode; terminal-cert gated in
  sovereign mode

**Tier 2 — Identity and attestations**
- Enrollment ID (ADR-0060 Decision 1)
- Pairwise RP ID derivation material
- Identity attestations (national ID pointers, mdoc / SD-JWT VC — ADR-0013)
- Owner verification required

**Tier 3 — Casualty log**
- Append-only log of treatment events, each chip-signed (ADR-0008)
- Must travel with the person — placing the log on the tag (which remains on the neck
  chain with the person) satisfies ADR-0008's physical co-location requirement
- Owner verification not required for append (a medic appends without owner consent,
  per P9 — casualty-log append is an authorised third-party write)

### Decision 2 — The tear-away is a passive physical identifier; it holds no electronic data

The 316L stainless tear-away is:
- A fire-survivable physical identification element (ADR-0049 / ADR-0054)
- Engraved with the **Tag Locator** (the 8-character short-ID from ADR-0060 Decision 4)
- **No chip. No antenna. No electronic storage.**

The tear-away's identification function is entirely physical: a first responder who finds
the tear-away separated from the tag can read the engraved short-ID and look up the
person's record via the enrollment authority's locator search.

This is a design simplification compared to the ring form factor (where Chip B in the
core carries authentication data). In the card form factor, all electronic capability
is concentrated in the single JCOP tag. The tear-away is purely physical.

### Decision 3 — Casualty log stays with the person; tear-away does not

In a triage or death scenario where the tear-away is separated:

- The **tag** remains on the person (on the neck chain). It carries the casualty log and
  the full Tier 1 emergency profile. Any medic arriving after the separation can still
  read the tag and see the complete treatment record.
- The **tear-away** carries only the engraved Tag Locator. It serves as a physical token
  for reporting — a rescue chain or reporting party can hold the tear-away as a physical
  record of a contact without requiring the tag.

This satisfies ADR-0008 (casualty log travels with the person / tag) without requiring a
second electronic element.

**Note:** The two-key death confirmation mechanism (ADR-0023) is redesigned for this
form factor by ADR-0063.

### Decision 4 — Ring form factor chip A/B data model is not in scope

The ring form factor ADRs (0022, 0038, 0040, 0045) contain data assignment decisions
using the terms Chip A (ring) and Chip B (core). Those decisions apply to the ring form
factor only. The inconsistencies noted by the reviewer (ADR-0045 placing the casualty log
on Chip B, ADR-0038 contradicting ADR-0022's "no health data on Chip B") are real but
are left for a ring form factor ADR if that design is ever revisited.

The card form factor terminology is **tag** and **tear-away**. No ring or core terminology
is used for this form factor.

---

## Principle tests

**P1 (break-glass offline; attributable):**
The JCOP tag carries both Tier 1 emergency profile and the casualty log. Both are
accessible offline (tag is passively powered). Consumer Tier 1 is unauthenticated per
ADR-0061. The tag stays with the person even when the tear-away is separated. A medic
arriving at any point can read a complete, up-to-date record from the tag. ✓

**P2 (tag is cache, not identity):**
The tag can be replaced without data loss: the account holds the person's data; a new JCOP
is provisioned with the same Enrollment ID and data. The tear-away's engraved Tag Locator
derives from the Enrollment ID and is reproduced on a new tear-away if needed. ✓

**P3 (only data that changes emergency action and is low-harm if wrong):**
Data content is governed by existing tier ADRs (ADR-0016 for Tier 1 scope). This ADR
defines placement only, not content. ✓

**P5 (owner controls content, down to zero):**
Owner controls what is in each tier (above any sovereign minimum). The tier structure is
preserved. ✓

---

## Consequences

**What becomes possible:**
- Clear, unambiguous data model for the card form factor with no dependence on ring
  form factor concepts.
- Casualty log definitively assigned to the tag (stays with person), consistent with
  ADR-0008.
- Ring form factor inconsistencies are explicitly scoped out rather than silently
  inherited.

**What becomes harder:**
- The single JCOP tag holds all tiers including the casualty log. Chip memory budget
  must accommodate the full set. JCOP 4 (NXP P71D600) has 80 KB EEPROM; a Tier 1
  FHIR IPS profile is typically 2–5 KB; a 100-entry casualty log at ~200 bytes/entry
  is 20 KB. This is within budget but must be validated in the applet specification ADR.
- The tear-away carries no electronic verification. A found tear-away cannot be
  cryptographically proven to belong to a specific person — only the engraving links it.
  This is acceptable: the tear-away is a physical reporting token, not a primary
  identity credential.
