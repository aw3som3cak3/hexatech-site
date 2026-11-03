# ADR-0035: Per-envelope signing for Tier 1

- **Status:** Accepted
- **Date:** 2026-11-01
- **Principles:** P3, P4
- **Supersedes:** —
- **Amends:** ADR-0016

## Context

ADR-0016 defines the Tier 1 CBOR encoding but does not specify signing granularity: does each
entry carry its own signature, or does one signature cover the whole Tier 1 envelope?

Per-entry signing would enable selective disclosure — a reader could verify one entry
independently of others. Per-envelope signing covers all entries under a single signature.

**Principle checks:**
- P3: Signing granularity does not affect which data is included. Pass.
- P4: Either approach is compatible with the closed-list, fixed-position format. Pass.

**Budget analysis.** A realistic worst-case Tier 1 profile (5 medications, 3 allergies,
2 conditions, 1 implant, contact, red-flag entries, source+date+severity per entry, `alg`
fields per ADR-0033) with ECDSA (~64 bytes per signature):
- Per-entry: ~8–10 signatures × 64 bytes = 512–640 bytes signature overhead, plus per-entry
  `alg` identifiers. Total profile approaches or exceeds 4 KB.
- Per-envelope: 1 signature × 64 bytes = 64 bytes signature overhead. Total profile comfortably
  within 4 KB.

Selective disclosure at the entry level is not required by the current architecture. The tier
model (Tier 1 / Tier 2) handles disclosure granularity at a coarser level. If per-entry
selective disclosure is needed in future, it can be addressed by a Tier 1.5 or by SD-JWT VC
wrapping (ADR-0013) at the identity layer — not by proliferating signatures in the emergency
profile.

## Decision

Tier 1 uses **one signature over the whole envelope**. The signature covers the complete CBOR
Tier 1 map including all entries, states, source fields and dates. No per-entry signatures.

The signed envelope structure:
- `alg`: algorithm identifier (per ADR-0033)
- `payload`: the Tier 1 CBOR map
- `sig`: signature over the canonical CBOR encoding of `payload`
- `signer`: reference to the signing key (owner key or clinician-signed import key)

A reader that cannot verify the envelope signature must display the profile with an explicit
"signature unverified" state and not suppress the data (a medic must still be able to read it).

## Consequences

- Worst-case Tier 1 profile fits within 4 KB with headroom for future field additions.
- A single entry cannot be independently verified without the full envelope. This is acceptable:
  the emergency profile is consumed as a whole, not entry-by-entry.
- If an owner updates one entry, the whole envelope must be re-signed. This is operationally
  correct: the tag holds a coherent snapshot, not a log of individual changes.
- Per-entry attestations from a clinician signing system are handled at import time: the import
  is verified against the source signature, the entry is added to the Tier 1 map, and the whole
  envelope is re-signed by the owner key. The source field records the original attestation
  provenance (CLINICIAN_SIGNED / IMPORTED_CONFIRMED).

## Alternatives considered

**Per-entry signing:** Enables selective disclosure but pushes the CBOR budget past 4 KB in
worst-case profiles, and requires the reader to handle partial verification states. Selective
disclosure is not a Tier 1 requirement.

**No signing at all in consumer mode:** Tier 1 in consumer mode is already signed (ADR-0019).
Removing signing would remove the tamper-evidence and source-provenance guarantees. Rejected.
