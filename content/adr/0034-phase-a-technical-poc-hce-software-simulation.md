# ADR-0034: Phase A technical PoC — HCE software simulation

- **Status:** Accepted (self-amended 2026-11-01)
- **Date:** 2026-10-31
- **Principles:** P1, P4, P8, P10
- **Supersedes:** —
- **Amends:** ADR-0029

## Context

ADR-0029 (Stage 1) specified a JavaCard demonstrator as the technical PoC. The team is
greenfield on JavaCard development. JCOP4 applet work requires specialist skills (Java Card
3.0.5, GlobalPlatform secure channel, constrained APDU budgets, NXP toolchain) with a steep
learning curve. Attempting to learn and build the applet in a single PoC phase adds 8–12 weeks
of environment risk on top of the protocol risk, and conflates two independent questions:
"does the protocol work?" and "can the protocol be implemented on JavaCard?"

Android HCE (Host Card Emulation, ISO 14443-4 via Android API 19+) allows a phone to emulate
an NFC card. A second Android device running the HCE applet is a faithful enough simulation of
the tag to validate the full protocol — APDU command structure, CBOR encoding, access control,
receipts, read counter — before any hardware is procured or specialist contracted.

**Principle checks:**
- P1: The full offline read flow is validated end-to-end, including the cert-expiry-while-offline
  failure mode. Pass.
- P4: The fixed Tier 1 display layout and four-state model are exercised against the medic app.
  Pass.
- P8: Phase A displays what is entered; it computes nothing clinical. Pass.
- P10: HCE is a standard Android API. CBOR (RFC 8949), Trillian/Tessera, and OpenSSL/Bouncy
  Castle are established. Simplified challenge-response rather than full EAC is a deliberate
  Phase A deviation; full EAC is validated in Phase B against the same test suite. Noted.

## Decision

The technical PoC is split into two phases. This ADR covers Phase A.

**Phase A: Android HCE software simulation (estimated 4–6 weeks)**

A second Android phone runs the HCE tag simulation. The medic app reads it over NFC. No
JavaCard hardware is required. Phase A produces a validated protocol and a test suite that
Phase B (a separate ADR) implements against on real JCOP4 hardware.

Phase A builds and validates:

| Component | Scope |
|---|---|
| HCE tag (Android) | Simulates the tag over NFC. Stores Tier 1 profile as CBOR (hardcoded for Phase A). Simplified challenge-response access control. Read counter with configurable cap. Mutually signed receipts: reader signs challenge, tag signs response + monotonic counter value. Casualty log append. |
| Medic app (Android) | Offline NFC read. Fixed Tier 1 display: red-flag line, medications, conditions, allergies, implants, contact; four states per category. Casualty log entry. Receipt queue flushed on sync. |
| Test PKI | Software CVCA → DV → terminal cert chain (24 h validity). Python/OpenSSL or Bouncy Castle. No HSM, no production ceremony. Exercises cert-expiry-while-offline: reader attempts a read with an expired cert; behaviour is asserted in the test suite. |
| Transparency log | Rekor (Sigstore) instance running locally. Rekor ships as a single binary with an embedded backing store and implements a Merkle transparency log with inclusion proofs out of the box. Accepts receipt hash uploads (per ADR-0031: hashes only, not full receipt content). Verifies inclusion proofs. Trillian requires a separate database, log server, signer and personality layer — too much setup cost for Phase A. |
| CBOR encoding | Tier 1 profile encoded to CBOR with integer codes. Target ≤ 4 KB. Every signed artefact includes an explicit `alg` field (per ADR-0033); Phase A sets it to the classical algorithm. |

**What Phase A explicitly defers:**

- Real JCOP4 / JavaCard hardware (Phase B)
- Owner app — profile is hardcoded on the HCE tag
- Full EAC handshake — simplified challenge-response is sufficient to validate the protocol
  shape; full EAC is Phase B
- Full EAC terminal authentication protocol: Phase B implements BSI TR-03110 terminal
  authentication, passive authentication and chip authentication against the Phase A test suite
- iOS
- Tier 2 TEE broker and identity attestations
- FIDO2 owner authentication
- Production PKI ceremony and HSM
- Ring-and-core hardware validation

**Phase A day-one requirements:**

These must be in place from the first commit — they cannot be retrofitted:

1. **Clock injection:** Both the HCE tag app and the medic app must expose a mockable clock
   interface. This is required to automate the cert-expiry-while-offline exit criterion: issue
   a terminal cert with short validity, advance the mock clock past expiry, assert the expected
   failure behaviour.
2. **APDU size documentation:** Every APDU command and response in the Phase A test suite must
   document its maximum size in bytes. This allows a Phase B JavaCard contractor to identify
   incompatibilities with the JavaCard basic channel limit (255 bytes C-APDU) immediately on
   receiving the spec, not mid-build.

**Phase A exit criteria:**

1. Full offline flow exercised: authorised read → receipt produced → receipt hash uploaded to
   log on sync → inclusion proof verified.
2. Cert-expiry-while-offline failure mode explicitly tested and handled gracefully.
3. CBOR Tier 1 profile ≤ 4 KB with a representative real-world profile (≥ 3 medications,
   ≥ 2 allergies, ≥ 1 condition).
4. Test suite documents the APDU command structure and CBOR schema precisely enough for a
   JavaCard contractor to implement against without further design work.

## Consequences

- Protocol risk and JavaCard porting risk are decoupled. If the protocol needs changes after
  Phase A, they are made before a specialist is contracted, not during their engagement.
- The Phase A test suite is the Phase B spec. A JavaCard contractor receives a clear, tested
  interface definition rather than a design brief.
- Phase A is a working demo. A medic-flow demo on two Android phones is sufficient for a
  letter-of-intent conversation; buyers care that the protocol and format are correct, not
  that the tag is a JCOP4.
- The simplified EAC in Phase A means the PKI validation in Phase A is partial. The test PKI
  exercises cert chaining and expiry but not the full EAC terminal authentication protocol.
  This is a known gap closed in Phase B.
- Phase A does not validate JavaCard applet isolation (ADR-0020). The HCE simulation runs in a
  single Android app sandbox with no hardware security boundary between applets. Security claims
  about applet isolation must be explicitly deferred to Phase B and flagged as untested in the
  Phase A test suite.
- **Phase B entry criterion — anti-collision:** The reader must reliably select chip B after
  chip A in a two-chip NFC field, using the actual medic app NFC stack (Android IsoDep). This
  is the highest-risk hardware interaction Phase A does not cover. It must be demonstrated
  before Phase B is considered complete.
- `alg` fields in every artefact from the first PoC build mean no format break is needed
  when Phase B or production moves to hybrid PQC signing (ADR-0033).

## Alternatives considered

**Learn JavaCard in-house for Phase A:** Adds 8–12 weeks of toolchain learning to the timeline.
Conflates protocol validation with hardware porting. If the protocol changes after the applet
is written, the applet must be rewritten. Rejected.

**Skip Phase A; contract JavaCard immediately:** Contractor receives an unvalidated protocol
design. Changes during the engagement are expensive. Rejected.

**Full EAC in Phase A:** Full EAC implementation is well-defined but adds scope without
validating anything new about the Hexa-specific protocol. The simplified handshake is
sufficient to validate command structure, counter behaviour and receipt signing. Deferred to
Phase B.
