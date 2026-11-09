# ADR-0065: Physical validation gates — card + tear-away form factor

- **Status:** Proposed
- **Date:** 2026-11-09
- **Principles:** P1, P2
- **Supersedes (gate definitions only):** ADR-0052 (physical design validation plan — ring/core form factor)
- **Depends on:** ADR-0056 (card + tear-away form factor), ADR-0063 (separation doctrine)

## Context

ADR-0052 defines three validation gates for the Hexa physical design:

- Gate 1: RF coupling through Ti shell at ≥ 2 cm
- Gate 2: Bayonet retention and contamination resistance
- Gate 3: PUSH·TURN·PULL separation usability with 10 participants

All three reference the ring/core/bayonet/Ti architecture. ADR-0056 eliminates this architecture
in favour of a PC/PETG NFC hex card + 316L steel tear-away. The existing gate protocols are not
applicable to the new form factor.

This ADR replaces the gate protocols in ADR-0052. ADR-0052's context, rationale, and principles
sections remain valid. If the ring/core design is ever revived, ADR-0052's gate text should be
restored by a new ADR — this document does not invalidate the approach, only the specific tests.

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

1. Resonant frequency, config A. Initial target range: 14.5–15 MHz. Records baseline L and expected C.
2. Resonant frequency, config B. Record grommet-induced frequency shift.
3. Loaded Q factor at resonance, configs A and B (loaded Q = measured with JCOP chip attached and antenna tuned; not unloaded coil-only Q). **Pass criterion: loaded Q 15–35 at 13.56 MHz (config B — grommet installed, chip attached).** Q < 15 reduces power margin; Q > 35 narrows bandwidth and attenuates the 847 kHz load-modulation sidebands, degrading communication. Confirm acceptable window with the inlay vendor before specifying. See ADR-0056 OQ-9 for the derating calculation.
4. Read range sweep 0–50 mm, config B. Reader: standard NFC smartphone (conservative minimum). Pass: ISO 14443A activation ≥ 2 cm.
5. Resonant frequency and Q, config C. Records body-loading shift.
6. Read range sweep, config C. **Pass criterion: ISO 14443A activation ≥ 2 cm on smartphone.**
7. Read range sweep, tear-away stacked directly (no ferrite), free air. Expected fail — record attenuation baseline (OQ-33 reference).
8. Read range sweep, config D. **Hard pass criterion: ISO 14443A activation ≥ 2 cm on smartphone.**
9. End-to-end transaction test, config D (stacked + ferrite, body-loaded). Complete full Tier 1 transfer + chip-signed receipt + authenticated reader exchange. **Pass criterion: 9/10 trials succeed; minimum 3 different NFC-capable phone models tested.** ISO 14443A activation alone is insufficient — the full protocol exchange must complete.
10. Field symmetry: compare read range at card centre vs. near-grommet vertex vs. opposite vertex.
11. P71D600 activation field (if calibrated field generator available): confirm H at 2 cm from test reader exceeds P71D600 H_min from datasheet.
12. Supplementary: resonant frequency with neck chain draped in worn position, config D + chain.
13. Supplementary fire survival: expose engraved 316L sample (tear-away and grommet) to 850 °C for 30 minutes in air; verify character legibility after cooling. Pass: individual characters identifiable under 10× loupe.

### Production target setting

The resonant frequency tuning target for the inlay drawing is set from measurement 2 or 5
(whichever shows the larger downward shift), not from measurement 1. The ferrite sheet must be
bonded to the prototype card before the tuning target is set. The tuning capacitor value in the
inlay drawing is specified with the ferrite sheet in-situ.

### Gate 1 passes when

Measurements 3, 4, 6, 8, and 9 all pass: loaded Q 15–35 (config B, chip attached); ISO 14443A activation ≥ 2 cm in configs B, C, and D; full Tier 1 transaction completes in 9/10 trials in config D. Configurations E and F are expected fails; their results are recorded as documented limitations, not pass/fail items.

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

5b. **Combined fire assembly test:** heat the complete tear-away assembly (316L tear-away + grommet crimped onto chain; card body excluded) to 850 °C for 30 minutes in air. Cool to room temperature. Apply 15 N axial tension to the grommet–chain interface. Pass: (a) grommet remains on chain under 15 N; (b) abbreviated Tag Locator engraving on the grommet is legible under 10× loupe after cooling.

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
Score: tear-away NOT removed; participant reads or scans the tag.

**Pass criteria for Scenario A2 (Wounded):**
1. ≥ 8/10 participants do not remove the tear-away.
2. ≥ 8/10 attempt to read or scan the NFC tag.

**Scenario B — Correct face identification:** participant is asked to scan the tag with a smartphone.
Record which face they present to the reader. Pass: ≥ 9/10 present the front (NFC icon) face
on first attempt, or self-correct on first attempt after a failed read.

**Scenario C — Inadvertent separation:** participants wear the assembled system for a 10-minute
activity simulation (reaching, bending, kneeling, standing, walking). Record any separations.

**Pass criterion for Scenario C:** zero inadvertent separations across all 10 participants.

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

The ring/core gate protocols in ADR-0052 are superseded by this ADR. ADR-0052's acceptance
criteria, testing rationale, and principle tests remain valid as a reference document.
