# ADR-0068: JCOP applet specification — Phase A (sovereign mode)

- **Status:** Proposed
- **Date:** 2026-11-10
- **Principles:** P1, P2, P5, P6, P9, P10
- **Depends on:** ADR-0057 (V2 access model), ADR-0059 (JCOP platform), ADR-0060 (identifier model), ADR-0061 (mode split — sovereign only per ADR-0067), ADR-0062 (applet domain model), ADR-0063 (death confirmation), ADR-0064 (security corrections), ADR-0066 (physical spike permitted), ADR-0067 (Phase A scope)
- **Resolves:** OQ-22 (offline credential expiry — 24-hour default terminal cert validity, configurable by deployment authority CA policy)

## Context

The accepted architecture commits the JCOP applet to implement: enrollment, authenticated Tier 1 and Tier 2 access, casualty log, death state machine, session controls, and counter/receipt machinery. This ADR specifies the applet's external interface, APDU command set, security domain configuration, and memory budget for Phase A (sovereign mode only, per ADR-0067).

Consumer mode (unauthenticated Tier 1, NDEF fallback) is explicitly excluded from this specification per ADR-0067.

**Platform:** NXP JCOP 4 P71D600, JavaCard 3.0.5, GlobalPlatform 2.3.1. FIPS 140-3 certificate #4679 covers the chip module and NXP applets only — the Hexa applet requires its own assurance boundary definition (see Section 9).

---

## 1. AID and applet lifecycle

**AID:** `[TO BE ASSIGNED]` — a registered AID under the Hexatec RID. Format: RID (5 bytes) + PIX (up to 11 bytes). RID registration required before pilot.

**Applet states:**
- `UNINSTALLED` → install via GlobalPlatform INSTALL [for install] command
- `INSTALLED, NOT PERSONALISED` → enrollment APDU sequence required
- `PERSONALISED` → operational; all access commands available
- `LOCKED` → administrative lock; no access commands respond

**GlobalPlatform security domain:** deployment authority holds the Security Domain key set. Hexatec issues the chip with a known-good factory SCP02/SCP03 key set; deployment authority replaces keys at enrollment.

---

## 2. Enrollment APDU sequence

Enrollment transitions the applet from INSTALLED to PERSONALISED. All enrollment commands require the Security Domain authenticated channel (SCP03).

**Commands (in order):**

1. `WRITE ENROLLMENT ID` — stores 128-bit random Enrollment ID (from enrollment system); chip derives Tag Locator and stores it. Locator uniqueness is an issuance-side constraint (ADR-0060 Decision 4), not enforced on-chip.

2. `WRITE PAIRWISE SECRET` — stores 128-bit pairwise_secret (from enrollment system). Used for Pairwise RP ID derivation (ADR-0060 Decision 2).

3. `GENERATE KEY PAIR` — chip generates ECC P-256 key pair on-chip. Public key returned for enrollment authority to record. Private key never leaves chip.

4. `SET MODE FLAG` — sovereign or consumer. Phase A: sovereign only (ADR-0067).

5. `SET TRUST ANCHORS` — loads terminal CA certificate(s). Four roles per ADR-0069 §7: (a) medic reader — Tier 1 + Tier 2 access + casualty log append; (b) enrollment terminal — write access; (c) revocation terminal — lock access; (d) medical officer — Tier 1 + Tier 2 access + VOID any log entry + RETRACT_DECLARATION.

6. `WRITE TIER 1 DATA` — stores the emergency profile fields per ADR-0062 domain model: identity fields, medical summary, donor status (ADR-0025 currently Proposed; include field but mark optional until ADR-0025 is re-accepted).

7. `FINALISE ENROLLMENT` — transitions applet to PERSONALISED. Irreversible without revocation terminal authentication. Returns a chip-signed enrollment receipt.

**Readback verify:** enrollment system must read back all written fields and verify against the enrollment record before releasing the tag (ADR-0056 sealed manufacturing unit step 5).

---

## 3. Tier 1 access (authenticated, sovereign mode)

Per ADR-0061 Decision 1 (sovereign): Tier 1 requires terminal certificate authentication before any profile data is returned.

**Command:** `READ TIER 1`

**Pre-condition:** terminal has completed mutual authentication (see Section 5). Chip has verified terminal certificate chain against stored trust anchor(s).

**Response:** chip returns the Tier 1 emergency profile (ADR-0062 domain), along with:
- Session Token (ADR-0060 Decision 3) — 128-bit random, fresh per NFC power cycle
- Chip ECDSA signature over `hash(session_token || tier1_data || timestamp_ratchet)`
- Read counter increment (ADR-0005)

**No unauthenticated Tier 1 path** is implemented in Phase A (ADR-0067 Decision 2).

---

## 4. Tier 2 access (ECC challenge-response)

Per ADR-0057 Decision 3: Tier 2 requires user verification (UV) in addition to terminal authentication.

**Command sequence:**
1. `GET CHALLENGE` — chip returns a 32-byte random challenge
2. `AUTHENTICATE` — terminal sends: challenge response signed with terminal key + UV attestation. Chip verifies both.
3. `READ TIER 2` — returns pairwise RP ID (ADR-0060 Decision 2) and Tier 2 fields

**Decision (resolves OQ-22):** terminal certificate validity is **24 hours by default**, configurable by the deployment authority's CA policy. The deployment authority sets the validity window when issuing terminal certs; shorter windows (minimum recommended: 1 hour) reduce offline exposure; longer windows (maximum recommended: 7 days, for extended remote operations) are permitted if the deployment authority explicitly accepts the residual risk in their security policy. The chip's ratchet clock enforces expiry relative to the latest valid date it has seen — it does not enforce a minimum validity window. Read caps (ADR-0005) provide a second layer of bound: even with a compromised terminal cert, the number of tags accessible offline is bounded by per-tag read caps.

The configurable validity window is a CA issuance parameter, not an applet parameter. No applet change is needed to adjust it between deployments.

---

## 5. Terminal authentication protocol

Per ADR-0057 D1/D2: the Session Token is returned pre-authentication to allow session initiation without identity disclosure. Mutual authentication follows.

**Protocol (ICAO EAC-style terminal authentication):**
1. Reader sends `SELECT AID` → chip returns Session Token (not identity)
2. Reader sends `MSE:Set DST` loading its terminal certificate parameters, then `PSO:Verify Certificate` to ship the certificate chain; chip verifies chain against stored trust anchor and determines access tier from role attribute
3. Chip issues a challenge; reader signs it with its terminal private key and sends `EXTERNAL AUTHENTICATE`; chip verifies the signature — this proves the reader holds the matching private key
4. Chip sends its own certificate (enrolled public key) → reader verifies (chip authentication)
5. Session key established for the remainder of the NFC power cycle

Note: `INTERNAL AUTHENTICATE` is the chip-side command used in step 4 (chip proves itself). `EXTERNAL AUTHENTICATE` in step 3 is the terminal-side command. The two must not be swapped.

**Per-operation challenges:** each `READ TIER 2` and `APPEND CASUALTY LOG` command includes a fresh challenge; replay attacks across NFC power cycles are blocked by the Session Token.

---

## 6. Casualty log

Per ADR-0062 domain model and ADR-0063 death state machine.

**Append:** `APPEND CASUALTY LOG ENTRY`
- Pre-condition: Tier 2 authenticated terminal
- Payload: structured log entry (format TBD in applet spec detail)
- Chip countersigns: `chip_sig = ECDSA(chip_priv, hash(entry || log_sequence_counter))`
- Returns: chip signature + updated sequence counter

**Death state machine (ADR-0063 Decision 2):**
- State: `ALIVE` | `DECEASED_PENDING` | `DECEASED_CONFIRMED`
- `MARK DECEASED PENDING`: one authorised terminal (medic role) → state → `DECEASED_PENDING`
- `CONFIRM DECEASED`: **second authorised terminal only, with a distinct subject identifier** (ADR-0063 D1 — no single-actor bypass; the applet must reject `CONFIRM DECEASED` from the same subject as `MARK DECEASED PENDING`)
- `READ DEATH STATE`: available to any Tier 1 authenticated terminal

**Consumer mode append:** deferred per ADR-0067.

---

## 7. Counters and receipts

Per ADR-0005 (read caps) and ADR-0031 (receipt format).

- **Tier 1 read counter:** incremented once per authenticated NFC session, not per APDU — a medic managing one casualty over 72-hour PFC would otherwise exhaust the per-cert cap in ~4 hours at vitals every 5 minutes. Per-cert-serial cap: 50 sessions per cert serial per tag (ADR-0069 §4), enforced — a captured phone is limited to 50 sessions on any given tag with that cert (each tag's counter is independent; the phone may still reach other tags). Total cap: Tier 1 sessions are exempt from the 500-read total cap (a tag is never permanently locked out for emergency access). Counter saturates at 65,535 rather than refusing. Resolves OQ-41. Cap reset requires enrollment terminal authentication.
- **Tier 2 read counter:** incremented on each `READ TIER 2`. Cap per ADR-0005 defaults: 500 total reads per tag; 50 per cert serial per ADR-0069 §4. Chip refuses Tier 2 reads beyond the per-cert or total cap. Cap reset requires enrollment terminal authentication.
- **Receipt:** each read produces a chip-signed receipt: `hash(session_token || tier_data_hash || read_counter)`. Format per ADR-0031.
- **Ratchet clock:** chip stores `max(notBefore)` of all validated terminal certificates seen — this establishes a time lower bound. **Rejection rule:** a presented certificate is rejected if `cert.notAfter < ratchet`. A cert whose `notAfter` falls before the lower bound has provably expired. (Note: the rejection rule uses `notAfter`, not `notBefore` — using `notBefore < ratchet` would incorrectly reject valid concurrent certificates issued on different dates.)

---

## 8. Memory budget

**P71D600 Flash NVM:** up to 450 KB gross (confirmed from N7122/P71D600 distributor specs); 12.3 KB RAM. User-available applet storage is in the 80–320 KB range depending on JCOP version and card configuration — confirm exact partition with NXP application engineering before the inlay order.

Estimated allocations (per ADR-0062 domain model):

| Domain | Estimated size |
|---|---|
| Enrollment ID + pairwise_secret + key pair | ~200 bytes |
| Tag Locator (stored, not re-derived) | ~16 bytes |
| Mode flag + trust anchors (3 certs × ~1 KB) | ~3 KB |
| Tier 1 emergency profile | ~2 KB |
| Tier 2 extended profile | ~4 KB |
| Casualty log (append-only, LOG_FULL at 20 KB byte cap — ADR-0071) | ~20 KB |
| Death state + audit trail | ~1 KB |
| Counters + receipts | ~512 bytes |
| **Total estimated** | **~29 KB** |

> **Amended by ADR-0072** (2026-11-18): log domain byte reservation raised from 10 KB to 20 KB; cap model changed from entry count to byte cap (ADR-0071 Decisions 1–2). ISO 7816-4 command chaining required for death entry types (0x09, 0x0A) in §6; extended APDUs are unreliable on low-end Android NFC controllers (see ADR-0071 Decision 1).
| **Reserve for Phase B (consumer path)** | ~4 KB |
| **Total with reserve** | **~23 KB** |

This is well within a standard JCOP 4 user partition. Confirm with NXP application engineering before finalising the inlay order.

---

## 9. Certification boundary

Per ADR-0059: FIPS 140-3 certificate #4679 covers the P71D600 chip module and NXP applets. The Hexa applet requires its own assurance boundary definition.

**Options (to decide before pilot):**
- **(a) FIPS 140-3 Level 2 for the Hexa applet on P71D600** — precedent exists: HID Applets v4.0 (cert #5390), OpenFIPS201 v2.0 PIV Applet (cert #5280), ST Engineering SSID Applet (cert #5360). All on the same P71D600 chip.
- **(b) Rely on chip module boundary with a documented rationale** — acceptable for a research/pilot phase; not for production deployment under CC/FIDO L2+ requirements.
- **(c) CC EAL4+ for the applet** — higher bar; required for some NATO procurement paths.

**Recommendation for Phase A:** option (b) with a written rationale. Plan option (a) or (c) engagement before pilot contracts are signed.

---

## Principle tests

**P1 (break-glass offline; attributable):** chip-signed Tier 1 profile returns in NFC field, no network required. ECDSA signature over session_token + data makes the read attributable. Every read increments a counter and produces a receipt that reaches the transparency log on sync. ✓

**P2 (tag is cache):** Enrollment ID is account-bound (ADR-0060); chip holds a copy. Replacement chip gets same Enrollment ID, same locator, same Tier 1 data restored from account record. ✓

**P5 (owner controls content, down to zero):** owner controls Tier 1 and Tier 2 fields at enrollment and via authenticated update. Withheld state (ADR-0018) must be implementable — `WITHHELD` flag per field. ✓

**P6 (we route and store, we don't vouch):** deployment authority holds terminal CA; Hexatec does not. Chip key pair generated on-chip; Hexatec never holds the private key. ✓

**P9 (identity/signing require UV; medical read never does):** Tier 1 (medical read) requires terminal cert authentication only — no biometric/UV from the owner, consistent with P9 (an unconscious owner can be identified). The pairwise RP ID (Tier 2, Identity domain) is returned to authenticated terminals without owner UV per ADR-0062 D1 — this is an explicitly accepted emergency identification exception, not a P9 violation. Identity attestations and signing operations (also Tier 2) require UV from the owner; they cannot be performed on an unconscious person, consistent with P9. Where UV is required (medic Tier 2 access, signing), it is the acting principal's UV, not the owner's. ✓

**P10 (adopt existing standards):** JCOP 4, JavaCard 3.0.5, GP 2.3.1, ISO 7816-4, ISO 14443-4, ECC P-256, ECDSA. Terminal auth follows ICAO EAC-style PKI. No novel cryptography. ✓

---

## Open questions to resolve before implementation begins

- **AID assignment:** RID registration with ISO/IEC JTC 1/SC 17 or via GP registry.
- **Memory budget:** confirm P71D600 NVM partition size with NXP.
- **Certification path:** choose option (a), (b), or (c) for pilot vs. production.
- **Casualty log entry format:** resolved by ADR-0071 (byte-capped at 20 KB, append-only, structured typed entries).
- **Withheld state implementation:** per-field flag or whole-profile flag?
- **Read cap exhaustion → Tier 1 blocked (P1):** resolved — Tier 1 and Tier 2 read counters split in §7; Tier 1 cap set to 65,535 (effectively uncapped). OQ-41 resolved.
