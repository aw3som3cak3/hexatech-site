# ADR-0058: Chip evaluation and selection — MIFARE DUOX for Hexa, JCOP for Hexa Trinium

- **Status:** Proposed
- **Date:** 2026-11-06 (revised 2026-11-06)
- **Principles:** P1, P2, P6, P10
- **Depends on:** ADR-0003 (NFC secure element), ADR-0057 (V2 chip access model)
- **Tension with:** ADR-0009 (one chip, configurable trust anchors — see Decision 5)

## Context

ADR-0003 established that the tag uses a JavaCard/eID-class secure element over ISO 14443 NFC.
ADR-0057 defines the chip access model and references two product lines. Neither ADR committed
to a specific chip family.

This gap is now load-bearing. The Q3 2027 pilot, cost model, and authentication architecture
all depend on a stable chip choice. This ADR evaluates three candidate chips and records the
selection rationale.

### Two distinct markets, different security requirements

**Hexa** targets civil emergency preparedness (MSB, regional health authorities, blåljus),
field authentication on COTS devices, and broad consumer/civilian deployment. The buyer's
primary concerns are COTS interoperability, unit cost at volume, and time to pilot.

**Hexa Trinium** targets Försvarsmakten, NATO partners, and sovereign identity authorities
who require PKI credential issuance, ECC signing, hardware-backed X.509 certificate chains,
and eventual STANAG interoperability.

The same form factor and the same NFC readers must serve both products.

### The P1 problem: MAC vs. ECDSA signature

P1 requires that every access produces "a mutually signed, attributable record that reaches
the transparency log when either party syncs." This is a strict test: *attributable* means
independently verifiable by a third party; *mutually signed* means both the chip and the
reader contribute a cryptographic commitment.

A MIFARE Transaction MAC (EV3 feature) is a symmetric CMAC over the write payload. It proves
freshness and write integrity *to any holder of the session key*, but it cannot produce a
record verifiable by an independent auditor who does not hold that key. ECDSA, by contrast,
produces a signature anyone can verify against the chip's public key — no key-sharing required.

This matters for Hexa's casualty-log and authentication use cases, where post-incident audit
by parties outside the original session key holders is a plausible requirement.

---

## Candidate evaluation

### Candidate A — MIFARE DESFire EV3 (NXP)

| Property | Value |
|---|---|
| Crypto | AES-**128** only (not 192 or 256); 3DES for legacy |
| File system | ISO 7816-4 APDU; tiered file ACL |
| Signing | None — Transaction MAC (symmetric CMAC) only |
| Certification | CC EAL4+ (MF3DH3xx) |
| NFC | ISO 14443-4 / ISO 7816-4 |
| Unit cost (5k) | ~USD 2–3 |
| Developer tooling | Mature; well-documented; broad Android/iOS NFC library support |
| Availability | Multi-source; in continuous production |

**Strengths:** Lowest cost, fastest integration path, most mature ecosystem, no applet
development required.

**Weaknesses:**
- AES-128 only — the previous version of this ADR incorrectly claimed AES-256 support; that
  error is corrected here.
- No ECDSA signing — cannot satisfy the strict P1 "attributable" test; MAC-based attestation
  only.
- Cannot store X.509 certificates or perform PKI operations.
- EAL4+ — lower than DUOX or JCOP.

### Candidate B — MIFARE DUOX (NXP, launched November 2024)

| Property | Value |
|---|---|
| Crypto | AES-128, AES-256; ECC NIST P-256, brainpoolP256r1 |
| Signing | ECDSA signature generation via `VDE_ECDSASign` command |
| File system | ISO 7816-4 APDU; SELECT FILE, GET CHALLENGE, GENERAL AUTHENTICATE |
| Certification | CC EAL**6+** |
| NFC | ISO 14443-4 A levels 1–4; ISO/SAE 21434 compliant |
| Unit cost (5k) | Not published; estimated USD 5–10 (NXP automotive/security tier) |
| Developer tooling | NXP application note AN14223 (July 2025); SDK behind NXP partner access |
| Availability | Orderable via NXP store; production use confirmed by Safetrust (Feb 2025) |

DUOX is NXP's response to the gap between DESFire (symmetric only) and JCOP (full JavaCard).
It is not a programmable SE — no JavaCard applets — but it natively supports ECC key
generation and ECDSA signing without requiring a loaded applet. The command set follows
ISO 7816-4, so Android and iOS NFC stacks handle it without any special driver.

The EV charging application note (AN14223, July 2025) demonstrates `VDE_ECDSASign` being used
to sign a 32-byte challenge for ISO 15118 / VDE-AR-E 2532-100 EV charging identity. The same
primitive is what Hexa needs for attributable casualty-log entries: the chip signs a hash of
the write payload, and that signature can be verified against the chip's enrolled public key
by any auditor.

No backward-compatibility guarantee with the DESFire command set has been published; DUOX and
DESFire share a product category but use a distinct command layer.

**Strengths:**
- ECDSA on-chip — satisfies the P1 attributable-record requirement properly.
- AES-256 available.
- EAL6+ — highest certification of the three candidates.
- Same ISO 14443 / ISO 7816-4 NFC layer; no reader hardware changes.
- Already shipping in security products.

**Weaknesses:**
- Newer chip (Nov 2024); integration tooling less mature than DESFire.
- SDK is NXP partner-access only; full command reference not publicly posted.
- Higher unit cost than DESFire EV3; exact volume pricing requires NXP quote.
- No JavaCard runtime; Hexa Trinium's PKI applet path still requires JCOP.

### Candidate C — NXP JCOP 4 (JavaCard 3.0.5 / GlobalPlatform 2.3.1)

| Property | Value |
|---|---|
| Crypto | ECDSA ECCP-256/-384; RSA-2048; AES-256 |
| Runtime | Full JavaCard; applets loadable, personalised, locked post-issuance |
| Certification | CC EAL5+; FIPS 140-3 (P71D600, March 2025) |
| NFC | ISO 14443-4; ISO 7816-4 |
| Unit cost (5k) | ~USD 8–15 (varies by variant and certification tier) |
| Developer tooling | ant-javacard (JDK 25 / JC 3.2.0); Gradle wrappers; JCardSim; Eclipse JCOP Tools (NXP partner) |
| Availability | Multi-source; well-established NATO/eIDAS procurement history |

**JavaCard tooling state as of 2026:** The concern that JavaCard development is prohibitively
complex has diminished. The ant-javacard build tool now supports JDK 25 and JavaCard SDK
3.2.0. Gradle wrappers (ph4r05, crocs-muni, bertrandmartel) provide modern build pipelines.
JCardSim enables unit-testable applet development without physical hardware. NXP's FIPS 140-3
re-certification of JCOP 4.5 in March 2025 confirms the platform is actively maintained. A
skilled applet developer working from a well-specified ADR should require approximately 3–6
months from blank CAP file to production-qualified build. This is medium effort — not trivial,
but not a blocker for a 2028 target.

**Strengths:** Full PKI stack; EAC-style certificate chains; FIDO2/CTAP applet capable;
broadest sovereign/military procurement acceptance; same NFC reader as DUOX.

**Weaknesses:** Highest unit cost; requires applet development effort as a gate for
Hexa Trinium; complexity exceeds Hexa pilot requirements.

---

## Decisions

### Decision 1 — Hexa uses MIFARE DUOX

The first product, Hexa, is built on **NXP MIFARE DUOX** (MF3E(H)x3 family, or successor).

The choice over DESFire EV3 is driven by P1. The DUOX `VDE_ECDSASign` command lets a chip
generate an ECDSA signature over a reader-supplied challenge. This enables a treatment-event
record of the form:

> `hash(payload) || chip_ECC_signature(hash(payload)) || reader_ECC_signature(...)`

Both the chip and the reader contribute verifiable cryptographic commitments. Any auditor with
the chip's enrolled public key can verify the chip's contribution without holding any symmetric
key. This satisfies P1's "mutually signed, attributable record" requirement.

DESFire EV3 — with its AES-128-only profile and symmetric MAC — cannot produce this record.
An EV3-based Hexa would require a written P1 exception ADR at audit time. DUOX eliminates
that debt from the start.

Additional rationale:
- EAL6+ certification is a stronger posture than EV3's EAL4+; easier to explain to
  procurement officers comparing against CAC/PIV.
- AES-256 available for Tier 2 file encryption.
- Same ISO 14443 / ISO 7816-4 NFC transport; reader applications require no change.
- Safetrust commercial integration (February 2025) confirms real-world procurement path.

**Open items before Hexa Trinium launch:**
- Obtain volume pricing from NXP (DUOX unit cost at 10 k+ pcs).
- Obtain DUOX command reference from NXP partner access to confirm `VDE_ECDSASign` API.
- Confirm ISO 7816-4 GENERAL AUTHENTICATE compatibility with Android NFC stack on target
  devices (reference: MF3E(H)x3_SDS Rev. 1.1, May 2025).

The DUOX command set for Hexa (enrollment, UUID write, tier ACL, casualty-log append,
ECDSA challenge-response) must be fully specified in a follow-on ADR before firmware
development begins.

### Decision 2 — Hexa Trinium uses JCOP 4

The second product, Hexa Trinium, is built on **NXP JCOP 4** (GlobalPlatform 2.3.1,
JavaCard 3.0.5 or later; or a certified successor).

JCOP is the only commercially available NFC chip with the combination of: full JavaCard
runtime, CC EAL5+/FIPS 140-3, ECDSA + X.509 certificate storage, and an established
NATO/eIDAS procurement record. DUOX lacks the programmable runtime needed for a full
EAC-style credential chain (CVCA → DV → Terminal) and X.509 certificate storage.

Production target: 2028, following Hexa pilot validation. A JCOP applet specification ADR
must be written before Trinium development begins.

### Decision 3 — Shared form factor and reader infrastructure

Both products occupy the same physical hexagonal card form factor (ADR-0056). Both are
read by the same NFC reader applications (Android ISO 14443 / iOS Core NFC). No reader
upgrade is required when an organisation transitions from Hexa to Hexa Trinium.

DUOX and JCOP both operate over ISO 14443-4 / ISO 7816-4 at the transport layer. Practical
command differences between DUOX (fixed-command SE) and JCOP (applet-driven APDU routing)
are handled in the reader application layer, not in reader hardware.

### Decision 4 — NFC, not UHF RFID

Restatement of ADR-0003 for procurement clarity.

Hexa and Hexa Trinium use NFC (13.56 MHz, ISO 14443). They are not passive UHF-RFID.

- **Passive UHF RFID** (860–960 MHz): readable from 1–10 metres without the carrier's
  awareness; no authentication; used for inventory tracking.
- **NFC with secure element** (13.56 MHz, DUOX or JCOP): requires deliberate contact
  within 2–4 cm; the chip does not respond before a cryptographic session is established
  (per ADR-0057 Decision 1); authentication is mandatory before any identity data is
  disclosed.

Military environments where UHF-RFID has failed — passive readability, covert tracking
risk, RF disruption — are problems the Hexa architecture does not inherit.

### Decision 5 — Conflict with ADR-0009 acknowledged; two-chip strategy accepted

ADR-0009 ("One chip, configurable trust anchors") established that a single chip family
should serve both consumer and sovereign deployment modes by varying trust anchor
configuration rather than changing hardware. This ADR departs from that principle by
selecting two distinct chips — DUOX for Hexa and JCOP for Hexa Trinium.

The departure is pragmatic:
- No single commercially available chip currently combines DUOX's ECC-without-applets
  simplicity with JCOP's programmable runtime and NATO certification posture.
- Using JCOP for both products would require JavaCard applet development before the pilot
  can launch, adding 3–6 months to the Q3 2027 schedule.
- Using DUOX for both is impossible; Hexa Trinium requires a programmable runtime for
  certificate chain management.

ADR-0009's intent — that buyers do not need to change reader hardware as they move up
the security tier — is preserved by Decision 3 (shared NFC reader infrastructure).

The principal violation is the two-personalisation-pipeline requirement that ADR-0009's
authors sought to avoid. This cost is accepted. If a future chip achieves both EAL6+
and a JavaCard-class runtime, ADR-0058 should be superseded to reunify on that chip.

---

## Principle tests

**P1 (break-glass offline; attributable):**
Both chips are passively powered over NFC; no battery, no network path required. Emergency
Tier 1 access is available to any authenticated reader offline. DUOX `VDE_ECDSASign` enables
treatment-event records that are mutually signed by chip and reader in a form independently
verifiable by third-party auditors. JCOP enables equivalent ECDSA signing via applet.
DESFire EV3 (rejected for Hexa for this reason) would not satisfy the attributable-record
requirement without a formal exception. ✓

**P2 (tag is cache, not identity):**
The enrollment UUID is provisioned onto the chip at enrollment and is not derived from the
chip's hardware identity (ADR-0057 Decision 2). Replacing a DUOX card or a JCOP card does
not change the person's UUID or backend record. Physical elements (tear-away, engraving)
remain valid after a card swap. ✓

**P6 (we route and store, we don't vouch):**
On DUOX, the ECDSA key pair is generated on-chip; the public key is enrolled against the
person's account; Hexatec does not hold the private key and does not sign identity claims.
On JCOP, the deployment authority holds the PKI trust root; Hexatec issues no credentials
into the chip's certificate chain. Symmetric keys provisioned at enrollment are held by the
issuing authority, not Hexatec. ✓

**P10 (adopt existing standards):**
DUOX is ISO 14443-4 / ISO 7816-4 compliant; ECDSA P-256 is NIST-standardised; CC EAL6+
is a recognised certification framework. JCOP 4 is JavaCard 3.0.5 / GlobalPlatform 2.3.1 /
FIPS 140-3 (March 2025) compliant. No novel cryptography is introduced. ✓

---

## Consequences

**What becomes possible:**
- Q3 2027 pilot proceeds on DUOX; ECDSA-attested casualty-log entries from day one.
- P1's attributable-record requirement is met by chip capability, not workaround.
- EAL6+ certification underpins Hexa's security narrative for procurement.
- Hexa Trinium's PKI ambitions are grounded in a concrete chip with an established
  NATO procurement record.

**What becomes harder:**
- DUOX SDK access requires NXP partner engagement before firmware development begins.
- Two personalisation pipelines (DUOX and JCOP) add operational complexity.
- JCOP applet development for Hexa Trinium is a separate engineering gate; the applet
  specification ADR must be written before Trinium development begins.

**What we give up:**
- The single-chip simplicity of ADR-0009; the two-pipeline cost is accepted.
- The lower BOM of DESFire EV3; DUOX carries a higher unit cost that requires
  confirmation at volume.

---

## Alternatives considered

**DESFire EV3 for Hexa:**
Evaluated and rejected. AES-128 only (not 256; a previous version of this ADR incorrectly
claimed AES-256 support — that error is corrected here). No ECDSA signing; records are
MAC-attested only, which does not satisfy P1's "mutually signed, attributable" requirement.
If the P1 reading is relaxed to allow MAC-based attestation for the pilot scope, DESFire EV3
becomes viable and cheaper; this would require a formal P1 exception ADR. Retained as an
escalation option if DUOX procurement proves infeasible before the Q3 2027 deadline.

**JCOP for both products:**
Rejected. JCOP unit cost and applet development effort are not justified for the pilot scope.
A JavaCard applet build is a 3–6 month gate that cannot be inserted before Q3 2027. JavaCard
tooling has matured (ant-javacard supports JDK 25 and JavaCard 3.2.0; Gradle wrappers exist;
JCardSim enables unit testing), so the barrier is effort and schedule, not technical
impossibility.

**DUOX for both products:**
Not viable. Hexa Trinium requires a programmable runtime (JavaCard) for EAC-style
certificate chain management and X.509 credential storage. DUOX has no JavaCard runtime.

**Alternative SE vendors (Infineon SLE78, Samsung S3CT9, Thales):**
Not selected at this stage. NXP is the dominant vendor in both military eID (JCOP) and
transit/access NFC (DESFire/DUOX). Vendor diversification is an option for the production
series if supply concentration becomes a risk.

**UHF RFID:**
Rejected by ADR-0003. See Decision 4.
