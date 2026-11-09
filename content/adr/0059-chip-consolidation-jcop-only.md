# ADR-0059: Chip consolidation — JCOP 4 for all Hexa variants; DUOX deferred

- **Status:** Proposed
- **Date:** 2026-11-09
- **Principles:** P1, P2, P6, P10
- **Supersedes:** ADR-0058 (chip evaluation — MIFARE DUOX for Hexa, JCOP for Hexa Trinium)
- **Depends on:** ADR-0003 (NFC secure element), ADR-0057 (V2 chip access model)
- **Resolves tension with:** ADR-0009 (one chip, configurable trust anchors — now restored)

## Context

ADR-0058 selected two chips: MIFARE DUOX for Hexa (the first product) and JCOP 4 for
Hexa Trinium (the second). The rationale for the split was time-to-pilot:

> "Using JCOP for both products would require JavaCard applet development before the
> pilot can launch, adding 3–6 months to the Q3 2027 schedule." — ADR-0058

DUOX was chosen for the first product precisely because it eliminates the applet gate:
`VDE_ECDSASign` works without a loaded applet. The Trinium product line existed as a
second vehicle that would eventually carry the full PKI stack.

Two developments since ADR-0058 was written change this calculus:

1. **JavaCard tooling is more workable than the original estimate.** ant-javacard with
   JDK 25 / JavaCard SDK 3.2.0, Gradle wrappers, and JCardSim have matured to the point
   where the applet development gate is medium effort — not a pilot blocker if the
   applet spec is locked early. The concern that drove the DUOX choice was "JCOP is too
   hard to work with quickly." That concern has diminished.

2. **Two products means two of everything.** Two chips, two SDK engagements, two
   personalisation pipelines, two applet stacks, two procurement lines, two customer-facing
   SKUs. This complexity scales with every programme decision — supply diversification,
   certification upgrades, firmware updates, field support. For a team this size, that cost
   is not trivial. It is constant drag on every future decision.

The original speed-to-market hedge is no longer worth carrying. The prudent position is to
consolidate on a single chip that covers the full roadmap and defer DUOX to a shelf option
that can be revived if a supply, cost, or schedule event makes it attractive again.

## Decision

**All Hexa variants use JCOP 4** (GlobalPlatform 2.3.1, JavaCard 3.0.5 or later; NXP
P71D600 or certified successor). There is no longer a separate "Hexa Trinium" product
at pilot stage. The product is **Hexa**; it runs on JCOP 4.

MIFARE DUOX is **deferred, not rejected**. The evaluation in ADR-0058 Section
"Candidate B" remains the definitive technical reference for DUOX. If a supply
disruption, cost event, or schedule pressure makes DUOX attractive, this ADR should
be superseded to revive the dual-chip strategy — the case for DUOX is already written.

### Consequence for ADR-0009

ADR-0058 Decision 5 acknowledged a tension with ADR-0009 ("one chip, configurable
trust anchors") by accepting two personalisation pipelines. This ADR resolves that
tension: a single chip family (JCOP 4) covers both civil and sovereign deployment modes
by varying the loaded applet and trust anchor configuration. ADR-0009's intent is restored.

### Consequence for JCOP applet development

The applet development gate that ADR-0058 tried to route around now becomes the main
engineering deliverable before pilot launch. A JCOP applet specification ADR must be
written before development begins. That ADR must specify:

- Enrollment APDU sequence (UUID write, tier ACL, key provisioning)
- Tier 1 medical read (unauthenticated — per ADR-0057 Decision 1 as amended)
- Tier 2 authenticated read (ECC challenge-response, ECDSA-signed session record)
- Casualty-log append command (chip signs hash of payload — the P1 record)
- Key management lifecycle (re-enrollment, revocation)

A skilled applet developer working from that spec should require approximately 3–6 months
to production-qualified build (JCardSim unit tests, physical JCOP validation, GP security
domain install).

### Product naming

With consolidation, **Hexa Trinium** as a distinct product name is retired for now.
The first product at pilot is **Hexa** on JCOP 4. The Trinium brand may be revived
for a differentiated sovereign/NATO SKU if the market segment demands distinct positioning,
but it carries no technical meaning in this single-chip architecture.

---

## Principle tests

**P1 (break-glass offline; attributable):**
JCOP 4 is passively powered over ISO 14443 NFC — no battery, no network path required
for offline emergency read. The ECDSA signing capability available via JCOP applet
produces the same form of mutually signed, independently verifiable treatment-event
record that DUOX's `VDE_ECDSASign` would have produced:

> `hash(payload) || chip_ECC_signature(hash(payload)) || reader_ECC_signature(...)`

The chip signs with a key pair generated on-chip at enrollment; any auditor holding the
chip's enrolled public key can verify the chip's contribution without a shared symmetric
key. P1's attributable-record requirement is met. ✓

**P2 (tag is cache, not identity):**
Replacing a JCOP card does not change the person's UUID or backend record (ADR-0057
Decision 2). Physical elements (tear-away, grommet engraving) remain valid after a card
swap. Full restoration on a new card requires no data from the old card. ✓

**P6 (we route and store, we don't vouch):**
The JCOP ECC key pair is generated on-chip at enrollment; the public key is enrolled
against the person's account; Hexatec does not hold the private key. The deployment
authority holds the GP security domain key. No Hexatec-signed identity claims are issued
into the chip's certificate chain. ✓

**P10 (adopt existing standards):**
JCOP 4 is JavaCard 3.0.5 / GlobalPlatform 2.3.1 / FIPS 140-3 (re-certified March 2025)
/ CC EAL5+ / ISO 14443-4 / ISO 7816-4. ECDSA P-256 is NIST-standardised. No novel
cryptography is introduced. P10 is not only met — JCOP 4 covers more
standard compliance targets (FIPS 140-3, GP 2.3.1) than DUOX did. ✓

---

## Consequences

**What becomes simpler:**
- One chip, one SDK engagement, one NXP relationship to manage.
- One personalisation pipeline. One supply chain. One certification posture to maintain.
- ADR-0009's single-chip intent is restored.
- No dual-SKU customer-facing positioning at pilot.
- No "which product do you need?" decision tree in the sales process.

**What becomes harder:**
- The applet development gate is now on the critical path to the pilot — there is no
  DUOX shortcut. The applet spec ADR must be written early and held stable.
- JCOP unit cost (~USD 8–15 at 5 k pcs) is higher than DUOX's estimated USD 5–10.
  This is offset by eliminating the second pipeline's operational cost.
- Loss of the DUOX EAL6+ certification advantage for the pilot (JCOP is EAL5+/FIPS 140-3).

**What we give up:**
- The hardware `VDE_ECDSASign` shortcut that DUOX provided. JCOP achieves the same
  outcome via applet, but the implementation is software-defined and must be audited.
- The option of launching a pilot without applet code. That option is closed.

---

## Alternatives considered

**Keep the dual-chip strategy (ADR-0058 as written):**
The original plan. Retained on the shelf — if JCOP applet development runs long, a DUOX
procurement restart remains viable without discarding the ADR-0058 analysis.

**Use DUOX for all variants:**
Not viable. The sovereign/NATO deployment mode requires a programmable runtime for
EAC-style certificate chains and X.509 credential storage. DUOX has no JavaCard runtime.
This was rejected in ADR-0058 and the rejection stands.

**Use DESFire EV3:**
Rejected in ADR-0058. No ECDSA signing; AES-128 only. Cannot meet P1's attributable-record
requirement without a formal exception ADR. This rejection is unchanged.
