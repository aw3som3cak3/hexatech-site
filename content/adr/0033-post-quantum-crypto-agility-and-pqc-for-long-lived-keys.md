# ADR-0033: Post-quantum crypto agility and PQC for long-lived keys

- **Status:** Accepted (self-amended 2026-11-01)
- **Date:** 2026-10-31
- **Principles:** P1, P10
- **Supersedes:** —
- **Amends:** ADR-0004

## Context

ADR-0004 adopts EAC-style PKI using ECC (ECDSA/ECDH), which is broken by a sufficiently large
quantum computer via Shor's algorithm. NIST finalised post-quantum cryptography standards in
2024: ML-DSA (FIPS 204, Dilithium) for signatures and ML-KEM (FIPS 203, Kyber) for key
encapsulation.

The threat is not uniform across the design. The relevant attack is **harvest now, decrypt
later**: an adversary captures ciphertext or signed artefacts today and breaks them once quantum
computing matures. This makes long-lived, high-value artefacts the priority:

- **CVCA root keys** — lifetime of decades; compromise collapses the entire trust chain.
- **Death declarations** (ADR-0023) — permanently verifiable; must be trustworthy indefinitely.
- **Owner keys** — medium-term exposure; tied to FIDO2 roadmap.

Short-lived artefacts are lower priority: a terminal cert valid for 24 hours has negligible
harvest-now-decrypt-later value.

Tier 1 data in consumer mode is signed, not encrypted (ADR-0019), so it is already readable by
any valid terminal cert holder. It is not a confidentiality target.

**Size constraint.** ML-DSA (Dilithium2) signatures are ~2.4 KB; ECDSA is ~64 bytes. This is
a hard constraint on the tag's memory budget and on Tier 1 encoding. JavaCard platforms do not
currently offer native PQC support (as of 2026); production hardware selection must account for
this.

**P10 note.** NIST FIPS 203/204/205 are now the established standards for PQC. FIDO Alliance
is actively working on PQC profiles for FIDO2. This ADR adopts those standards rather than
inventing alternatives.

## Decision

**1. Crypto agility from day one.**
Every signed or encrypted artefact in the Hexa format encodes its algorithm identifier
explicitly. No format assumes a specific algorithm. This applies to: Tier 1 profile signatures,
casualty log entries, receipts, death declarations, and all certificate fields. A reader that
does not support the algorithm in an artefact must surface this explicitly rather than silently
fail.

**2. Hybrid classical + PQC for long-lived keys in production.**
CVCA root keys and death declaration signing keys use hybrid schemes in production deployments.
Both signatures are included; security holds if either algorithm holds. This is the approach
recommended by BSI TR-02102 and ANSSI for transition-period key material.

- **CVCA root keys** use a three-way hybrid: classical ECDSA + ML-DSA (Dilithium, FIPS 204) +
  SLH-DSA (SPHINCS+, FIPS 205). ML-DSA and SLH-DSA rest on different mathematical foundations
  (lattice vs hash-based); a structural break in lattice cryptography does not affect SLH-DSA.
  For a key with a decades-long lifetime, algorithm diversity across foundations is warranted.
- **Death declarations** (ADR-0023) use classical ECDSA + ML-DSA only. SLH-DSA signatures are
  ~8 KB, which is impractical on chip B given its memory constraints. ML-DSA alone provides
  sufficient PQC coverage for death declaration lifetime.

**3. Short-lived terminal certs remain classical for now.**
Terminal certs (hours–days validity) have negligible harvest-now-decrypt-later exposure. They
stay classical (ECDSA) until JavaCard PQC support matures and FIDO Alliance finalises PQC
CTAP. This decision is revisited when either condition is met.

**4. PoC uses classical throughout.**
The PoC (ADR-0029) runs on classical crypto. JavaCard PQC support is not available; the PoC
validates protocol and format, not crypto agility. Algorithm identifiers are included in the
PoC encoding so migration requires no format change.

**5. Monitor and migrate.**
FIDO2 PQC, JavaCard PQC vendor support, and ICAO EAC PQC profile work are tracked. Owner key
migration follows the FIDO Alliance PQC roadmap. A further ADR is written when any of these
matures to a deployable standard.

## Consequences

- All artefact formats must carry algorithm identifiers from the first PoC build. This adds a
  small overhead to every encoded object but eliminates a costly migration later.
- CVCA ceremony planning (ADR-0004) must budget for hybrid key generation and hybrid cert
  structures. Ceremony scripts need updating before the first production ceremony.
- ML-DSA signatures on death declarations (~2.4 KB each) increase memory requirements on
  chip B. This feeds into hardware selection.
- The 4 KB Tier 1 target (ADR-0016) is unaffected: Tier 1 carries a classical signature in
  the PoC and near-term production; the budget is revisited when Tier 1 moves to hybrid signing.
- Sovereign-mode nations running their own CVCA must adopt the same hybrid requirement for
  their root keys; this becomes a condition of interoperability.
- A hybrid CVCA root cert carrying P-256 + ML-DSA-44 + SLH-DSA-128s keys and all three
  signatures is approximately 12–15 KB. Certificate chain depth directly affects chip B's
  memory budget. Hardware selection must account for this before committing to a chip vendor.

## Alternatives considered

**Classical-only with a future migration plan:** Algorithm identifiers not included now.
Migration later requires a format version break and coordinated recall or re-encoding of
deployed tags. Not acceptable given tag lifetime.

**Full PQC now (no hybrid):** ML-DSA only, drop classical. Premature: JavaCard support absent,
FIDO PQC not finalised, ICAO EAC PQC profile not published. Adopting before standards mature
violates P10.

**PQC for all keys including short-lived certs:** No meaningful security benefit for 24-hour
material; adds size and complexity before tooling is ready.
