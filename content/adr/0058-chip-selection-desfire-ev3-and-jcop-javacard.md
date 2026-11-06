# ADR-0058: Chip selection — MIFARE DESFire EV3 for Hexa and JCOP JavaCard for Hexa Trinium

- **Status:** Proposed
- **Date:** 2026-11-06
- **Principles:** P1, P2, P6, P10
- **Depends on:** ADR-0003 (NFC secure element), ADR-0009 (two product lines), ADR-0057 (V2 chip access model)

## Context

ADR-0003 established that the tag uses a JavaCard/eID-class secure element over ISO 14443 NFC.
ADR-0009 established a two-product-line architecture — a consumer-root product and a
sovereign/nation-state-root product. Neither ADR named a concrete chip or component family.

ADR-0057 describes the chip access model and references JCOP in the sovereign product context,
but the chip selection has never been formally decided.

This gap has become load-bearing. The pilot timeline (Q3 2027), cost model, procurement
conversations, and authentication architecture all depend on a stable chip choice. This ADR
formalises that choice and documents the rationale for each product line.

### Two distinct markets, different certification requirements

The two product lines target buyers with different security certification demands:

- **Hexa** targets civil emergency preparedness (MSB, regional health authorities, blåljus),
  field authentication on COTS devices, and broad consumer/civilian deployment. The buyer's
  primary concern is COTS interoperability, unit cost at volume, and time to pilot.

- **Hexa Trinium** targets Försvarsmakten, NATO partners, and sovereign identity authorities
  who require PKI credential issuance, ECC signing (ECCP-256 or stronger), hardware-backed
  X.509 certificate chains, and eventual STANAG interoperability. The buyer's primary
  concern is certification posture, auditability, and long-lived credential security.

The same form factor and the same NFC readers must serve both products. A buyer who starts
with Hexa must be able to transition to Hexa Trinium without replacing infrastructure.

### Why not a single chip for both products

MIFARE DESFire EV3 supports AES-256 and ISO 7816-4 file access control, but does not support
JavaCard applets, RSA/ECC signing, or X.509 certificate storage. It cannot serve the PKI
requirements of Hexa Trinium. Conversely, JCOP JavaCard chips capable of full PKI carry a
higher unit cost and require applet development effort that is not on the critical path for
the Q3 2027 pilot. Using JCOP for both products would delay pilot, increase BOM cost, and
add applet complexity before the medical workflow is validated.

## Decisions

### Decision 1 — Hexa uses MIFARE DESFire EV3

The first product, Hexa, is built on **NXP MIFARE DESFire EV3** (or a pin-compatible successor).

Capability baseline:
- AES-128 / AES-192 / AES-256 symmetric cryptography
- ISO 14443-4 compliant; ISO 7816-4 APDU command set
- Tiered file-system access control — public, authenticated, and encrypted partitions per
  ADR-0001's data model
- Hardware random number generation and anti-cloning circuitry
- Transaction MAC for write integrity (EV3 feature; prevents partial writes)
- Passively powered; no battery; operable offline per P1

Rationale:
- Available from multiple NXP-authorised distributors at volume; no single-source dependency
- Unit cost at 5 000 pcs: approximately USD 2–3 per chip; consistent with the target BOM
- Established integration path with Android Host Card Emulation (HCE) and iOS Core NFC
  for the reader application
- AES-256 is sufficient for Tier 1–2 access control in the pilot scope
- Faster path to Q3 2027 pilot than a JavaCard applet build

Limitation:
- Cannot issue or store X.509 certificates
- Cannot perform ECC signing
- Cannot implement the full EAC-style PKI from ADR-0004; the PKI authentication chain in
  Hexa Trinium is not available on DESFire EV3

This limitation is accepted for the pilot scope. Hexa is positioned as the
broad-deployment, COTS-first product. PKI credential issuance belongs to Hexa Trinium.

### Decision 2 — Hexa Trinium uses JCOP JavaCard

The second product, Hexa Trinium, is built on **NXP JCOP 4** (GlobalPlatform 2.3.1,
JavaCard 3.0.5 or later; or a certified successor).

Capability baseline:
- Full JavaCard runtime; applets can be loaded, personalised, and locked post-issuance
- ECDSA / ECCP-256 and ECCP-384; RSA-2048; AES-256
- Hardware-backed key generation and storage; keys are non-extractable
- JCOP hardware certification (CC EAL 5+ or higher) — required for military/sovereign trust
- ISO 7816-4 and ISO 14443-4; backward-compatible with DESFire EV3 readers (NFC reader
  does not need to change)
- GlobalPlatform Secure Channel Protocol (SCP02/SCP03) for applet lifecycle management
- Capable of issuing and storing X.509 certificates per ADR-0004's PKI chain

Rationale:
- The only commercially available NFC chip family with the combination of JavaCard runtime,
  CC EAL 5+ certification, and an established NATO/eIDAS procurement path
- Supports the EAC-style PKI from ADR-0004 (CVCA → DV → Terminal chain)
- Supports FIDO2/CTAP applets for the COTS authentication use case per ADR-0044 and
  ADR-0057 Decision 3
- Same physical NFC reader infrastructure as Hexa; no new hardware for existing deployments
- Hardware certification is a prerequisite for Försvarsmakten and STANAG acceptance;
  software-only or non-certified chips cannot substitute

Production target: 2028, following Hexa pilot validation and PKI applet specification ADR.

### Decision 3 — Shared form factor and reader infrastructure

Both products occupy the same physical hexagonal card form factor (ADR-0056). Both are
read by the same NFC reader applications (Android HCE-compatible, iOS Core NFC-compatible).
No reader upgrade is required when an organisation transitions from Hexa to Hexa Trinium.

This is an explicit product strategy constraint: an organisation that pilots Hexa is not
locked in by infrastructure; they can upgrade to Trinium as a card swap.

### Decision 4 — NFC, not UHF RFID

This is a restatement of ADR-0003 for procurement clarity.

Hexa and Hexa Trinium use NFC (13.56 MHz, ISO 14443). They are not passive UHF-RFID.
The distinction matters in procurement conversations with military and civil emergency buyers
who have experience of UHF-RFID in logistics and uniform tracking systems:

- **Passive UHF RFID** (860–960 MHz): readable from 1–10 metres without the carrier's
  awareness; no authentication; used for inventory tracking; frequently disrupted by
  metal and body armour
- **NFC with secure element** (13.56 MHz): requires deliberate contact within 2–4 cm;
  the chip does not respond before a cryptographic session is established (per ADR-0057
  Decision 1); authentication is mandatory before any identity data is disclosed

Military environments where UHF-RFID has failed — passive readability, covert tracking
risk, RF disruption — are not problems the Hexa architecture inherits. This distinction
should be stated in any procurement or capability briefing.

## Principle tests

**P1 (break-glass offline):** Both chips are passively powered over NFC; no battery,
no network path required. Emergency tier access is available to any authenticated reader
offline. ✓

**P2 (tag is cache, not identity):** The enrollment UUID is provisioned onto the chip at
enrollment and is not derived from the chip's hardware identity (ADR-0057 Decision 2).
Replacing a DESFire EV3 card or a JCOP card does not change the person's UUID. Physical
elements (tear-away, engraving) remain valid. ✓

**P6 (we route and store, we don't vouch):** The PKI trust root on Hexa Trinium is held
by the deployment authority (a nation state or military operator). The JCOP chip holds
a hardware certificate from the chip manufacturer and an enrollment certificate from the
issuing authority; Hexatec does not issue or sign identity claims. DESFire EV3 operates
under symmetric keys provisioned by the enrollment authority; Hexatec holds no production
key material. ✓

**P10 (adopt existing standards):** DESFire EV3 is ISO 7816-4 and ISO 14443 compliant;
AES-256 is NIST-standardised. JCOP 4 is JavaCard 3.0.5 and GlobalPlatform 2.3.1 compliant;
ECDSA / ECCP-256 is NIST P-256. Both chips are established commercial products with
documented certification paths. No novel cryptography is introduced. ✓

## Consequences

**What becomes possible:**
- Q3 2027 pilot proceeds on DESFire EV3 without waiting for JavaCard applet development
- Hexa Trinium's STANAG and PKI ambitions are grounded in a concrete chip with an existing
  NATO procurement record
- Sales and procurement conversations can reference certified, commercially available
  components rather than "NFC chip TBD"

**What becomes harder:**
- Hexa (DESFire) cannot be field-upgraded to PKI credentials; a card swap to Hexa Trinium
  is required for organisations that need PKI
- JCOP applet development for Hexa Trinium is a separate engineering effort; the applet
  specification ADR must be written before Trinium development begins

**What we give up:**
- A single-chip architecture that covers both markets; the operational complexity of
  managing two personalisation pipelines is accepted

## Alternatives considered

**Single chip — JCOP for both products:**
Rejected. JCOP unit cost and applet development effort are not justified for the pilot scope.
The Q3 2027 deadline cannot be met with a JavaCard applet build as a prerequisite.

**Single chip — DESFire EV3 for both products:**
Rejected. DESFire EV3 cannot issue X.509 certificates or perform ECC signing.
It cannot meet the PKI and STANAG requirements that define the military product line.

**Alternative SE vendors (Infineon SLE, Samsung S3, Idemia):**
Not selected at this stage. NXP is the dominant vendor in both military eID (JCOP) and
transit/access NFC (DESFire). The existing ecosystem of tools, readers, and integration
libraries is deepest for NXP. Vendor diversification is an option for the production
series if supply concentration becomes a risk.

**UHF RFID:**
Rejected by ADR-0003. Passively readable, no authentication, tracking risk. See
Decision 4 of this ADR.
