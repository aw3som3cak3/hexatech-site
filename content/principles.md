# Principles

Principles change slowly and only through an ADR that explicitly amends them.
Each has a **test**: a yes/no question to apply to any proposal. A principle without a test is a slogan.

---

### P1 — Break-glass works offline; abuse is made attributable, not prevented
**Rationale:** The primary reader is a medic with an unconscious patient, possibly no network,
no consent, and a hostile RF environment. Offline access cannot be fully prevented from abuse,
so every access must be signed, counted and later logged (pattern from offline CBDC wallets).
**Test:** Can an authorised medic read Tier 1 with no network? Does every read produce a
mutually signed, attributable record that reaches the transparency log when either party syncs?
(Exception: consumer mode takes a P1 attribution exception — chip-signed but reader-anonymous — see ADR-0061 Decision 1a.)

### P2 — The tag is a cache and an authenticator, never the identity or source of truth
**Rationale:** Tags get lost, destroyed and stale. The account and its attestations are the
identity; the backend record is authoritative; the tag can always be reissued.
**Test:** If this tag is destroyed now, can the owner be fully restored on a new tag without data loss?

### P3 — Only data that changes emergency action and is low-harm if wrong
**Rationale:** Facts that are dangerous to act on when wrong (blood type, DNR) cause harm
without benefit. Allergies and anticoagulants pass; blood type fails.
**Test:** Does this field change what a medic does in the first hour? If it is wrong, is acting on it low-harm?

### P4 — The emergency format is semantically quiet
**Rationale:** Medics need seconds-to-read, consistent data; clinicians record inconsistently;
coded data can be shown in the medic's language.
**Test:** Is the field coded from a closed list, in a fixed position, with explicit state
(known-none / not recorded / present / withheld)? Is there any free text in Tier 1?
(Exception: `RED_FLAG` is bounded free text, max 80 chars — see ADR-0046.)

### P5 — The owner controls content, down to zero
**Rationale:** Data minimisation and genuine consent. In sovereign mode a nation may mandate a
minimum dataset under a non-consent legal basis; the owner controls everything above it.
**Test:** Can the owner remove this data (above any sovereign minimum)? Is "withheld by owner" shown distinctly from "none"?

### P6 — Issuers and nations own trust roots; we route and store, we don't vouch
**Rationale:** States will not cede citizen roots; liability and trust-service regulation
follow whoever vouches. Our base layer stays thin: keys and accounts.
**Test:** Does this feature require *us* to assert a fact about a person, rather than carry an issuer's signed attestation?

### P7 — No personal data on immutable ledgers
**Rationale:** Encrypted data on a permanent ledger is a harvest-now-decrypt-later gift and
conflicts with GDPR erasure. Tamper-evidence comes from transparency logs (Merkle, append-only).
**Test:** Is any personal data, encrypted or not, written somewhere it can never be deleted?

### P8 — Store, communicate and display only; no clinical decision support in the core
**Rationale:** Keeps the core outside EU MDR (MDCG 2019-11). Intended purpose, including
marketing copy, defines classification.
**Test:** Does the system compute, infer, prioritise or recommend anything clinical, rather than display what a person entered or flagged?

### P9 — Identity and signing always require user verification; medical read never does
**Rationale:** Break-glass must work on an unconscious person; signing must never.
Applets are isolated.
**Test:** Can this function be invoked on an unconscious owner? If yes, is it strictly Tier 1 medical read or casualty-log append?

### P10 — Adopt existing standards before inventing
**Rationale:** Interoperability, certification paths and credibility. Defaults: ICAO EAC-style
PKI, FIDO2/CTAP, ISO 14443/7816, HL7 FHIR IPS, SNOMED CT / ATC, ISO 18013-5 mdoc, SD-JWT VC, RFC 9334 attestation.
**Test:** Is there an established standard that does this? If we deviate, is the reason written in an ADR?
