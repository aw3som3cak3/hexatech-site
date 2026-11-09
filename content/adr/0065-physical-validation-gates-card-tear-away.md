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

**Pass criteria:** reliable ISO 14443A activation at ≥ 2 cm in configurations C and D (defined
below). Configurations A and B are characterisation measurements, not pass/fail gates.

### Test configurations

| Config | Description |
|---|---|
| A | Free air, no grommet |
| B | Free air, 316L grommet installed |
| C | Body-loaded: card flat against human chest at mid-sternum, grommet installed |
| D | Stacked: 316L tear-away behind card, ferrite sheet between elements, body-loaded (grommet installed) |

### Measurements

1. Resonant frequency, config A. Initial target range: 14.5–15 MHz. Records baseline L and expected C.
2. Resonant frequency, config B. Record grommet-induced frequency shift.
3. Q factor at resonance, configs A and B. **Pass criterion: Q ≥ 20 at 13.56 MHz (config B — with grommet installed).** Q is the critical power-margin parameter (see ADR-0056 OQ-9); if Q < 20 after body-loading derating, chip terminal voltage may fall below minimum.
4. Read range sweep 0–50 mm, config B. Reader: standard NFC smartphone (conservative minimum). Pass: ISO 14443A activation ≥ 2 cm.
5. Resonant frequency and Q, config C. Records body-loading shift.
6. Read range sweep, config C. **Pass criterion: ISO 14443A activation ≥ 2 cm on smartphone.**
7. Read range sweep, tear-away stacked directly (no ferrite), free air. Expected fail — record attenuation baseline (OQ-33 reference).
8. Read range sweep, config D. **Hard pass criterion: ISO 14443A activation ≥ 2 cm on smartphone.**
9. Field symmetry: compare read range at card centre vs. near-grommet vertex vs. opposite vertex.
10. P71D600 activation field (if calibrated field generator available): confirm H at 2 cm from test reader exceeds P71D600 H_min from datasheet.
11. Supplementary: resonant frequency with neck chain draped in worn position, config D + chain.
12. Supplementary fire survival: expose engraved 316L sample (tear-away and grommet) to 850 °C for 30 minutes in air; verify character legibility after cooling. Pass: individual characters identifiable under 10× loupe.

### Production target setting

The resonant frequency tuning target for the inlay drawing is set from measurement 2 or 5
(whichever shows the larger downward shift), not from measurement 1. The ferrite sheet must be
bonded to the prototype card before the tuning target is set. The tuning capacitor value in the
inlay drawing is specified with the ferrite sheet in-situ.

### Gate 1 passes when

Measurements 3, 4, 6, and 8 all pass: Q ≥ 20 (config B); ISO 14443A activation ≥ 2 cm in configs B, C, and D.

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

6. **Contamination (mud/blood simulation):** apply 10 g fine sand in water to assembled card;
   wipe once with dry cloth; scan tag. Pass: ISO 14443A activation within 5% range degradation
   from baseline.

7. **IPA resistance:** wipe card surround with 70% isopropanol, 10 cycles; inspect surround
   bond and face markings. Pass: no delamination; face engraving legible.

---

## Gate 3 — Separation usability

**Objective:** an untrained participant can correctly identify and separate the tear-away without
briefing, while not removing the NFC card, and with no inadvertent separation under normal handling.

**Test population:** 10 participants minimum; at least 4 must be non-military (civilian paramedic,
humanitarian worker, or general public). Recruit separately from any participant who has prior
knowledge of this design.

**Scenario A — Identification and separation:** participant is handed the assembled system
(card + tear-away on chain) with a simulated casualty and asked: "What would you do with this?"
No briefing on doctrine.

**Pass criteria for Scenario A:**
1. ≥ 8/10 participants correctly identify the tear-away as the element to remove (not the NFC card).
2. ≥ 8/10 successfully separate the tear-away without tools.
3. ≥ 9/10 do not attempt to remove the NFC card.

**Scenario B — Inadvertent separation:** participants wear the assembled system for a 60-second
activity simulation (reaching, bending, standing). Record any separations.

**Pass criterion for Scenario B:** zero inadvertent separations across all 10 participants.

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
