# ADR-0052: Physical design validation plan — three prototype gates

- **Status:** Accepted
- **Date:** 2026-11-04
- **Principles:** P1, P2, P3
- **Amends:** ADR-0022 (adds explicit validation gates to the hardware risk items noted there), ADR-0041, ADR-0042

## Context

An external engineering review observed that the ADR process, as applied to physical design
decisions, risks giving unvalidated engineering hypotheses the appearance of established facts.
Examples from accepted ADRs:

- ADR-0041: Ti Gr5 accepted as field-grade material before NFC coupling through the Ti geometry
  has been tested.
- ADR-0042: Bayonet-only retention (no front face plate) accepted as adequate before
  separation-force measurements exist.
- ADR-0043 (now superseded by ADR-0050): Separation instruction accepted before usability
  testing with unfamiliar users.
- ADR-0048: Flat coil antenna geometry and read-range figures are nominal design values, not
  bench-verified.

The correct framing: an ADR can legitimately **accept a design hypothesis** — a direction the
team has committed to pursue — while making the validation requirements that would confirm or
falsify the hypothesis explicit. Without explicit gates, the first prototype may reveal failures
in hypotheses the ADR log presents as resolved decisions.

This ADR defines three prototype validation gates that must be passed before first-prototype
release. Failing a gate does not revert an ADR; it triggers a new ADR that either amends the
failed hypothesis or documents the corrected approach.

## Decision

Three validation gates must be completed in the following order on the first physical prototype:

---

### Gate 1 — RF coupling validation

**What we are testing:** whether the flat 2-turn hex coil antenna in the polymer carrier
(ADR-0048) achieves adequate NFC read range through the Ti Gr5 outer shell, in assembled-tag
geometry.

**Entry criteria:** one assembled ring prototype (Ti shell + polymer carrier + Chip A tuned to
coil geometry). No electronic core required for this gate.

**Test method:**
1. Bench measurement: coil-to-reader coupling at 13.56 MHz using a calibrated test fixture
   (IEC 10373-6 reference PCD antenna or equivalent), read range swept from contact to 50 mm.
2. Detuning measurement: compare antenna resonant frequency with and without the Ti shell in
   place, to quantify eddy-current detuning.
3. Ti-shell proximity check: verify that the Ti shell does not create a Faraday cage effect
   that cancels coupling into the coil (expected from ADR-0048 analysis but must be confirmed).

**Minimum pass criteria:** reliable ISO 14443A activation at ≥ 2 cm from the front face in
assembled geometry, using a standard NFC-enabled smartphone (not a research reader).

**If gate fails:** a new ADR must specify the corrected antenna topology. Options include
coil geometry tuning, additional RF-transparent window in the Ti shell, or revision to the
ADR-0048 coil parameters. Ti Gr5 material selection (ADR-0041) is not invalidated by an
antenna geometry failure — the topology can be corrected without changing the material.

---

### Gate 2 — Mechanical retention and contamination

**What we are testing:**
(a) Whether bayonet-only retention (ADR-0042, no front face plate) holds the core securely
under reasonable field-use loads (vibration, impact, clothing snag, accidental contact).
(b) Whether the open front face accumulates contamination (sand, blood, biological material)
in the bayonet engagement groove in a way that impedes separation or creates a hygiene risk.

**Entry criteria:** one assembled ring + core prototype with final bayonet geometry.

**Test method:**
1. **Retention load test:** apply axial pull force from 0 to failure. Record the load at which
   the core releases. Target: core shall not release under < 15 N axial pull and < 2 N·m torque
   without the intentional PUSH + TURN motion (ADR-0050).
2. **Separation-force test:** measure the PUSH force required to compress 0.3 mm and the
   TURN torque to clear the lugs. These must be achievable by a gloved hand with limited
   grip (simulate field gloves). Target: PUSH < 30 N, TURN torque < 0.5 N·m.
3. **Contamination soak test:** introduce sand-and-water slurry, artificial blood analogue,
   and latex glove particles into the open front cavity. Attempt separation after soak and
   after drying. Record whether contamination prevents separation or the core cannot be
   re-seated.

**Minimum pass criteria:** core does not release under handling load; separation is achievable
by a gloved hand after contamination exposure; re-seating is achievable after field decontam.

**If gate fails:** a new ADR must address the failure mode. Options include a front-face
retention lip (geometry change to ADR-0042), a protective cover for the bayonet groove
(a separate part, to be evaluated against P2 survivability), or a torque/force spec change
in the bayonet geometry.

---

### Gate 3 — Separation usability

**What we are testing:** whether a person who has never seen the Hexa tag and receives no
verbal instruction can successfully separate ring from core by reading the engraved instruction
alone (ADR-0050: PUSH · TURN ↺ · PULL).

**Entry criteria:** ADR-0050 engraving on a physical prototype. Test participants: minimum 10,
none of whom have been briefed on the Hexa tag. Mix of profiles: clinical, military, civilian.
No time limit; they may attempt as long as they wish.

**Test method:**
1. Hand the participant the assembled tag. Tell them only: "Separate the two parts."
2. Record: (a) whether they read the engraving, (b) whether they attempt PUSH before TURN,
   (c) whether they successfully separate, (d) time to separation, (e) any comments.
3. Note any users who apply damaging torque (TURN without PUSH) or who cannot separate after
   reading the instruction.

**Minimum pass criteria:** ≥ 8 of 10 participants separate successfully without further
instruction. ≤ 1 participant applies visibly damaging torque. Mean separation time ≤ 60 s.

**If gate fails:** the instruction text, format, or supplementary affordances (additional
marking, colour, texture) must be revised and the test repeated before first-prototype release.

---

## Three operational states

A note for future design iteration: the reviewer correctly observes that the design encodes
three operational states that have not been formally articulated:

1. **Intact:** ring and core assembled; full digital + physical identification available.
2. **Separated:** ring with casualty (Chip A red-flag + locator + engraving); core with
   reporting chain (Chip B full Tier 1 + engraving).
3. **Damaged / incomplete:** electronic layer absent; physical engraving and UUID cylinder
   (ADR-0049) are the surviving identification layer.

The visual design should communicate not only how the product separates (affordance, addressed
by ADR-0042) but also whether it has been separated or tampered with (tamper evidence, not yet
addressed). This is out of scope for this ADR and is captured in OQ-24.

## Principle tests

**P1 (break-glass offline):** Gate 1 directly validates the break-glass NFC read path. Without
this gate, the core design assumption (flat coil achieves 2 cm read range through Ti shell)
is unconfirmed and P1 may not be satisfied in hardware. ✓

**P2 (tag is a cache):** Gate 2 directly validates that the tag does not accidentally separate
(losing the core cache) and that the physical cache remains accessible after contamination. ✓

**P3 (only data that changes emergency action, low harm if wrong):** Gate 3 validates that the
physical access mechanism for the data layer works for an untrained responder. If separation
fails, Chip B (full Tier 1) is inaccessible at the moment of emergency use. ✓

## Consequences

- The first prototype build should sequence manufacturing to enable Gates 1–3 in order. Gate 1
  can be done on a ring-only prototype; Gates 2 and 3 require a full ring+core assembly.
- Gate results should be documented and referenced from the relevant ADRs (0041, 0042, 0050)
  as evidence that the accepted hypotheses have been confirmed.
- Budget and timeline for prototype fabrication (OQ-13) should include test fixtures and
  usability session logistics.
- If any gate fails, the corrective ADR must be accepted before proceeding to production
  tooling.

## Alternatives considered

**Leave validation to OQ-13 (existing hardware validation open question).** OQ-13 covers
hardware validation broadly but does not specify pass criteria, test methods, or sequencing.
Without explicit gates, the prototype could be declared "good enough" on informal observation
rather than structured testing. Rejected: given the operational consequences of a tag that
fails in the field (incorrect identification, inaccessible medical profile, or unintended
separation during critical procedures), explicit gates are warranted.
