# ADR-0065: Physical validation gates — card + tear-away form factor

- **Status:** Accepted
- **Date:** 2026-11-09
- **Principles:** P1, P2
- **Card-form-factor counterpart to:** ADR-0052 (physical design validation plan — ring/core form factor)
- **Depends on:** ADR-0056 (card + tear-away form factor), ADR-0063 (separation doctrine)

## Context

ADR-0052 defines three validation gates for the Hexa physical design:

- Gate 1: RF coupling through Ti shell at ≥ 2 cm
- Gate 2: Bayonet retention and contamination resistance
- Gate 3: PUSH·TURN·PULL separation usability with 10 participants

All three reference the ring/core/bayonet/Ti architecture. ADR-0056 eliminates this architecture
in favour of a PC/PETG NFC hex card + 316L steel tear-away. The existing gate protocols are not
applicable to the new form factor.

This ADR defines gate protocols for the card + tear-away form factor. ADR-0052's gate protocols remain valid for the ring/core form factor. ADR-0052's context, rationale, and principles sections remain valid as a reference document.

---

## Gate 1 — RF coupling (NFC hex card)

**Objective:** confirm the NFC card reads reliably at ≥ 2 cm in all operational configurations,
including body-loaded and stacked with the 316L tear-away.

**Pass criteria:** see "Gate 1 passes when" below. Configurations E and F are expected failures
recorded as documented limitations, not pass/fail items.

**Note on ferrite:** the ferrite sheet is bonded to the card back face (ADR-0056 Element 1
Antenna) and is present in all configurations B–F unless explicitly noted. Config A is a
no-ferrite baseline for inductance measurement only.

### Test configurations

| Config | Description | Type |
|---|---|---|
| A | Free air, no grommet, no ferrite — inductance baseline | Characterisation |
| B | Free air, 316L grommet installed, ferrite bonded | Characterisation + pass criteria |
| C | Body-loaded: card flat against human chest at mid-sternum, grommet + ferrite | Pass/fail |
| D | Stacked: 316L tear-away behind card, body-loaded, grommet + ferrite | Pass/fail (hard) |
| E | Card reversed: reader on ferrite/back face, body-loaded | Expected fail — documented limitation |
| F | Stacked, tear-away in front of card, no handling step, body-loaded | Expected fail — documented limitation |

### Measurements

1. Resonant frequency, config A (no ferrite, no grommet). Records baseline inductance L and calculates expected tuning capacitor C. No pass/fail target — this is an inductance measurement only.
2. Resonant frequency, config B (grommet + ferrite installed). **Initial prototype target: 14.5–15 MHz.** Record grommet+ferrite-induced shift from measurement 1. The production tuning target is set from this measurement.
3. Loaded Q factor at resonance, configs A and B (loaded Q = measured with JCOP chip attached and antenna tuned; not unloaded coil-only Q). **Design target / diagnostic: Q 15–35 at 13.56 MHz (config B — grommet installed, chip attached). This is not a Gate 1 pass/fail criterion.** Q < 15 risks insufficient power margin; Q > 35 narrows bandwidth and attenuates the 847 kHz load-modulation sidebands. Record the measured value for the inlay vendor and use it to refine the tuning capacitor spec; treat transaction completion (measurement 9) and activation range (measurements 4, 6, 8) as the actual reliability criteria. Note: ISO 14443-2 PICC class dependency applies — 1.5 A/m is the H_min for PICC classes 1–3; classes 4–6 have higher minima. PICC class is determined by antenna coil geometry (ISO 14443-1 defines the antenna size zones for each class), not by the chip. Classify the ~50 mm hex coil against the PICC antenna class zones in ISO 14443-1 and use the class-specific H_min from ISO 14443-2 before interpreting OQ-9's power budget calculation.
4. Read range sweep 0–50 mm, config B. Reader: standard NFC smartphone (conservative minimum). Pass: ISO 14443A activation ≥ 2 cm.
5. Resonant frequency and Q, config C. Records body-loading shift.
6. Read range sweep, config C. **Pass criterion: ISO 14443A activation ≥ 2 cm on smartphone.**
7. Read range sweep, tear-away stacked directly (no ferrite), free air. Expected fail — record attenuation baseline (OQ-33 reference).
8. Read range sweep, config D. **Hard pass criterion: ISO 14443A activation ≥ 2 cm on smartphone.**
9. **End-to-end transaction test, config D:** in the operational minimum configuration (stacked with ferrite, body-loaded), complete a full emergency transaction sequence without losing power: ISO 14443A activation → applet selection → Tier 1 profile transfer → chip-signed receipt → authenticated reader exchange (if sovereign mode available). **Phone model requirements:** minimum 3 models; must include at least (a) one iPhone running Core NFC (Apple's reader has different antenna placement and field strength to Android) and (b) one low-end Android (not a flagship; representative of a field medic's device). **Per-phone pass criterion:** ≥ 4 of 5 trials per phone model complete the full transaction without field loss. A design that passes only on a strong-field flagship fails Gate 1. Total minimum 15 trials (5 per phone, 3 phones). This supplements activation-only testing with the actual operational requirement. **Note:** this threshold is an engineering feasibility gate for prototype evaluation, not a production qualification threshold. Production deployment criteria must be defined separately once field-use requirements are confirmed, with higher sample counts, documented failure modes, and recovery-time measurements. The iPhone test uses a minimal Core NFC test harness (AID selection, APDU exchange, transaction outcome logging), consistent with ADR-0034's deferral of the full iOS medic app. The harness does not need to implement the emergency display UI.
10. Field symmetry: compare read range at card centre vs. near-grommet vertex vs. opposite vertex.
11. PICC activation field (if calibrated field generator available): confirm H at 2 cm from test reader exceeds H_min for the tag's PICC antenna class (from ISO 14443-2), not the chip datasheet — PICC class is determined by coil geometry per ISO 14443-1.
12. Supplementary: resonant frequency with neck chain draped in worn position, config D + chain.
13. Supplementary fire survival: expose engraved 316L sample (tear-away and grommet) to 850 °C for 30 minutes in air; verify character legibility after cooling. Pass: individual characters identifiable under 10× loupe.

### Production target setting

The resonant frequency tuning target for the inlay drawing is set from measurement 2 or 5
(whichever shows the larger downward shift), not from measurement 1. The ferrite sheet must be
bonded to the prototype card before the tuning target is set. The tuning capacitor value in the
inlay drawing is specified with the ferrite sheet in-situ.

### Gate 1 passes when

Measurements 4, 6, 8, and 9 all pass: ISO 14443A activation ≥ 2 cm in configs B, C, and D; per-phone pass criterion met for transaction completion in config D (measurement 9). Measurement 3 (loaded Q) is a diagnostic and design target — its value is recorded and reported to the inlay vendor, but it does not block Gate 1 passage. Configurations E and F are expected fails; their results are recorded as documented limitations, not pass/fail items.

---

## Gate 2 — Mechanical retention and contamination

**Objective:** confirm the card assembly and tear-away survive field handling and that the
connector separates correctly under deliberate pull but not under handling loads.

**Test items:** NFC card assembly (card + grommet + silicone surround); 316L tear-away with
grommet and short chain connector.

### Tests

1. **Grommet press-fit pull-out force (card):** apply axial pull to card grommet along bore axis.
   Pass: ≥ 50 N before grommet pull-out from card body.
   **Grommet press-fit pull-out force (tear-away):** apply axial pull to tear-away grommet along
   bore axis. The 316L body will not burn, but the grommet carries the abbreviated Tag Locator.
   Pass: ≥ 50 N before grommet pull-out from tear-away body.

2. **Silicone surround bond:** apply 20 N radial peel force to surround wall at card edge.
   Pass: no delamination of surround from card edge channel.

3. **Chain connector — deliberate separation:** apply increasing pull force to tear-away
   short chain until separation. Pass: separates at 25–50 N.

4. **Chain connector — inadvertent separation:** apply 15 N load in three orientations (axial,
   radial, 45°) for 60 seconds each. Pass: no separation under 15 N in any orientation.

5. **Chain ball/grommet retention:** remove card body from chain (simulating card burn);
   confirm grommet remains on chain. Pass: grommet cannot pass through chain ball.

5b. **Combined fire assembly test (card grommet):** heat a complete card assembly (JCOP card + grommet + chain, without the tear-away) to 850 °C for 30 minutes in air; allow to cool. The card body burns away. Apply 15 N axial load to the grommet–chain interface. Verify: (a) grommet remains on chain (cannot pass through chain ball); (b) abbreviated locator on grommet flange is identifiable under 10× loupe. Pass: both (a) and (b) satisfied. The claim under test is specifically that the card grommet stays on the chain when the PC/PETG body burns — the tear-away body is 316L and does not burn, so its grommet retention is not in question. Optionally include a tear-away in the same furnace run as a legibility sample for comparative oxidation data; treat as informational, not pass/fail.

6. **Contamination (mud/blood simulation):** apply 10 g fine sand in water to assembled card;
   wipe once with dry cloth; scan tag. Pass: ISO 14443A activation within 5% range degradation
   from baseline.

7. **IPA resistance:** wipe card surround with 70% isopropanol, 10 cycles; inspect surround
   bond and face markings. Pass: no delamination; face engraving legible.

---

## Gate 3 — Separation usability

**Objective:** an untrained participant correctly identifies and separates (or retains) the tear-away
in both casualty states, faces the card correctly, and does not cause inadvertent separation under
normal handling.

**Test population:** 10 participants minimum; at least 4 must be non-military (civilian paramedic,
humanitarian worker, or general public). Recruit separately from any participant who has prior
knowledge of this design.

**Scenario A — KIA identification:** participant is handed the assembled system
(tag + tear-away on chain) with a simulated KIA casualty and asked: "What would you do with this?"
No briefing on doctrine. Score: tear-away removed, tag stays on casualty.

**Pass criteria for Scenario A (KIA):**
1. ≥ 8/10 participants correctly identify the tear-away as the element to remove (not the NFC card/tag).
2. ≥ 8/10 successfully separate the tear-away without tools.
3. ≥ 9/10 do not attempt to remove the NFC card/tag.

**Scenario A2 — Wounded identification:** same system, simulated wounded (non-KIA) casualty.
Score: tear-away NOT removed; participant reads or scans the tag. Participant is given a phone with the Hexa reader app installed so that "attempts to scan" can be scored objectively.

**Pass criteria for Scenario A2 (Wounded):**
1. ≥ 8/10 participants do not remove the tear-away.
2. ≥ 8/10 attempt to read or scan the NFC tag.

**Scenario B — Correct face identification:** participant is asked to scan the tag with a smartphone.
Record which face they present to the reader. Pass: ≥ 9/10 present the front (NFC icon) face
on first attempt, or self-correct on first attempt after a failed read.

**Scenario C — Inadvertent separation:** participants wear the assembled system for a 10-minute
activity simulation (reaching, bending, kneeling, standing, walking). Record any separations.

**Pass criterion for Scenario C:** zero inadvertent separations across all 10 participants.

**Scenario C2 — Overlapping-element recovery:** participant is handed the assembled system with the tear-away randomly stacked in front of the card (not the wearing position). No instruction is given about which element to move or why. Participant is asked: "If you needed to scan this, what would you do?" Score: (a) participant moves the tear-away to expose the card front face, and (b) successful emergency-profile display is achieved.

**Pass criteria for Scenario C2 (overlapping recovery):**
1. ≥ 8/10 participants discover and perform the handling step (move tear-away aside, present NFC icon face) without instruction.
2. Measure elapsed time from hand-off to successful scan. Record median and worst-case time for each participant.
3. No participant attempts to detach any element from the chain (would violate ADR-0063 Decision 1b and indicates doctrine failure).

This scenario validates that the NFC icon on the front face is a sufficient cue for an untrained responder to self-correct the stacked configuration. If ≥ 3/10 participants fail to discover the handling step, doctrine marking (NFC icon, text cues) must be revised before Gate 3 is re-run.

**Doctrine marking validation:** record what on-hardware cues participants cite when they succeed.
If the "KIA ONLY" and NFC-icon markings are present, record whether these were cited. This validates
the doctrine markings specified in ADR-0056.

---

## Principle tests

**P1 (break-glass offline):** Gate 1 confirms the NFC card reads reliably at ≥ 2 cm in all
operational configurations, including stacked with the tear-away. Gate 3 confirms an untrained
first responder can access the physical identification layer. Gate 1 supplementary fire test
confirms 316L engraving survives structural fire. ✓

**P2 (tag is cache):** Gate 2 confirms the physical elements survive field handling, the grommet
stays on the chain after a card body is lost, and the connector separates under deliberate pull
but not under snag load. ✓

---

## Consequences

**Gate 1 must be completed before the inlay drawing is finalised** — the production tuning target
is an output of Gate 1 measurement, not an input.

**Gate 2 must be completed before silicone surround mould tooling is ordered** — connector
specification and surround bond criteria must be validated before tooling spend.

**Gate 3 must be completed before first deployment** — usability validation for non-military
populations is required by the humanitarian and civilian use cases in ADR-0056.

ADR-0052's gate protocols govern the ring/core form factor. This ADR governs the card + tear-away form factor. Both gate sets remain valid for their respective form factors.
