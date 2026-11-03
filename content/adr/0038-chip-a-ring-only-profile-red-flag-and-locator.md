# ADR-0038: Chip A holds a ring-only profile — red-flag line and tag locator only

- **Status:** Accepted
- **Date:** 2026-11-01
- **Principles:** P1, P2, P3, P5
- **Supersedes:** —

## Context

The ring-and-core form factor (ADR-0021, ADR-0022) creates two independently readable chips:

- **Chip A** — embedded in the ring. Present whenever the tag is worn. Readable even when the
  ceramic core has been removed, swapped or destroyed.
- **Chip B** — embedded in the removable ceramic core. Carries the full signed Tier 1 profile.
  Not readable when the core is absent.

The unidentified-casualty scenario (surfaced in UX mapping, Q19) makes the gap concrete:
a medic who finds a casualty whose core is missing — removed for a legitimate update,
swapped by a hostile actor, or simply lost — has no emergency data available if chip A
carries nothing actionable. Without any guidance from chip A, the medic must treat the casualty
as fully unknown.

The question is how much chip A should hold independently of chip B. Three options were
identified:

1. **Duplicate**: chip A holds the full Tier 1 profile, keeping chip A and chip B in sync.
2. **Minimal**: chip A holds only the fields that change emergency action in the first hour,
   plus a pointer back to the authoritative record.
3. **Pointer only**: chip A carries only a tag locator. No offline emergency use.

Option 1 (full duplicate) means every profile update must write two chips. The write-and-verify
cycle for a JavaCard applet is the slowest operation in the flow; doubling it adds meaningful
latency and complexity, and the two chips can get out of sync if an update is interrupted. It
also requires chip A to carry the full CBOR envelope with its signature — a signature over
data that chip B already signs. A second signature over the same data from the same key gives
no additional security.

Option 3 (pointer only) makes chip A useless in offline field conditions, which is the only
scenario where chip A's independence from chip B matters. A locator that requires a network
call is no better than no chip A at all in the unidentified-casualty scenario.

Option 2 (minimal ring-only profile) satisfies the field requirement with minimal sync cost.

The data that passes P3 for offline, first-hour decisions without chip B is narrow:
- **Red-flag line** — the single most important field for a non-medic first responder; changes
  what is administered in the first minutes ("NO MORPHINE", "NO PENICILLIN", known anaphylaxis).
  Blood type explicitly fails P3 (acting on a wrong blood type causes harm) and is excluded.
- **Tag locator** — a pairwise, non-global identifier (per ADR-0024/ADR-0036) that, when a
  network connection is available, allows lookup of the full record.

## Decision

Chip A carries a **ring-only profile** consisting of exactly two elements:

1. **Red-flag text** — the owner's free-text red-flag line (same field as Tier 1 `RED_FLAG`),
   signed by the same clinician or self-asserted key as the full Tier 1 envelope.
2. **Tag locator** — the pairwise chip identifier (ADR-0036), sufficient to look up the full
   record in the account when network is available.

Chip A does **not** carry:
- Blood type (excluded by P3 — see ADR-0014).
- Medication list, allergy codes, condition codes (chip B's responsibility; too complex to sync
  and redundant with the full Tier 1 on chip B).
- Any data from Tier 2 or above.

The ring-only profile is a separate, independently signed CBOR envelope. It shares the same
signing key and PKI chain as the Tier 1 profile on chip B but is a distinct payload, updated
only when the red-flag field changes. Profile updates that do not touch the red-flag field
do not require a chip A write.

## Consequences

- A medic who finds a casualty with a missing core sees the red-flag line and a locator.
  That is the minimum needed to avoid the most dangerous first-responder errors.
- Chip A write operations are rare — only triggered by red-flag field changes, not every profile
  update.
- Chip A and chip B can diverge if a red-flag update to chip B is not followed by a chip A
  update. The app must write both chips whenever the red-flag field changes, and must warn the
  user if only one write succeeded.
- The ring-only profile has a distinct CBOR structure from the full Tier 1 envelope. Readers
  must handle both structures. The distinction is signalled by a flag in the envelope (TBD in
  the CBOR schema extension).
- An adversary who reads chip A without the core learns only the red-flag text and a pairwise
  tag ID. The pairwise ID is unlinkable across contexts (ADR-0024) and the red-flag text is
  minimal medical data — the most sensitive fields (diagnoses, medications) remain on chip B.

## Alternatives considered

**Full Tier 1 duplicate on chip A:** doubles write complexity, risks sync drift, gives a second
signature over the same data with no security gain, and contradicts P2 (the tag is a cache;
duplicating data within the cache adds maintenance without adding trust).

**Pointer only (no red-flag on chip A):** useless in offline field conditions where chip A's
independence from chip B matters most; fails P1 (break-glass must work offline).

**Red-flag plus blood type:** blood type is excluded by P3 and ADR-0014. Acting on a wrong
blood type causes direct harm; the risk of a stale or incorrect red-flag field is lower because
it is a text prompt to a trained responder, not a direct treatment instruction.
