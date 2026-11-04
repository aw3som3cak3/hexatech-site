# ADR-0051: Correct ADR-0041 — anodize sequence, colour specification, and MRI safety framing

- **Status:** Accepted
- **Date:** 2026-11-04
- **Principles:** P1, P2, P3
- **Amends:** ADR-0041 (corrects three technical errors; does not change material selection)

## Context

An external engineering review identified three technical errors in ADR-0041 that must be
corrected before the manufacturing specification is sent to a contract manufacturer:

### Error 1 — Anodize sequence stated backwards

ADR-0041 Consequences states:

> "The core's blue anodize is applied after engraving: the laser ablates through the oxide
> layer, producing lighter (bare titanium) marks on the blue ground."

The phrase "applied after engraving" contradicts the mechanism that follows it. If the laser
ablates through the oxide layer, the oxide must exist before the laser pass. The correct
sequence is: **machine → anodize → laser engrave**. The laser marks bare titanium through the
oxide, producing lighter marks on the blue ground.

Reversed: machine → laser engrave → anodize would apply the oxide over the engraved channels,
producing uniform blue marks and no contrast — the opposite of the intended effect.

### Error 2 — Colour specification locked to voltage alone

ADR-0041 specifies Pantone 2727 C / RAL 5005 Signal Blue and 60–70 V DC as equivalent
statements of the target colour. They are not equivalent. Titanium interference-colour anodizing
depends on applied voltage, electrolyte composition, surface preparation (grit, residual stress,
pre-etch chemistry), temperature, and viewing angle. The same 65 V bath produces measurably
different hues across batches and across machined vs. polished surfaces.

A Pantone/RAL reference locked from a voltage figure alone cannot be guaranteed at manufacture
without process-qualification runs. Specifying it as an ADR decision implies a level of
manufacturing control that has not yet been established.

### Error 3 — MRI safety overstated

ADR-0041 states:

> "Ti Gr5 is unambiguously non-ferromagnetic."

This is correct for the base metal. The ADR then implies the assembled tag is MRI-safe on this
basis. It is not. The assembled Hexa tag includes conductive elements (Chip A flat coil antenna
per ADR-0048, Chip B antenna, secure element interconnects). These can introduce:

- **RF heating** from eddy currents induced in conductive loops at 1.5 T / 3.0 T scanner
  frequencies (63.9 MHz / 127.7 MHz), independent of ferromagnetism.
- **Image artifact** from local field distortion around conductive materials.

Non-ferromagnetism establishes that the tag will not be pulled toward the magnet bore and will
not torque on the static field. It does not establish that the tag produces acceptable heating
or image quality in a clinical MRI environment. Whole-device MR safety is a separate validation
requirement governed by ASTM F2182 (RF heating) and ASTM F2503 (marking standard).

## Decision

The following corrections replace the corresponding statements in ADR-0041:

### Correction 1 — Anodize sequence

**Replaces:** "The core's blue anodize is applied after engraving: the laser ablates through
the oxide layer..."

**Correct text:** "The core is anodized first, then laser engraved: the laser ablates through
the oxide layer, exposing bare titanium and producing lighter marks on the blue ground —
high contrast, reverse of the ring. Sequence: machine → anodize → laser engrave."

### Correction 2 — Colour specification

**Replaces:** "titanium electrochemical anodize (Type II), 60–70 V DC … Pantone 2727 C /
RAL 5005 Signal Blue"

**Correct text:** "Titanium decorative interference-colour anodize (AMS 2488 Class 1 or
equivalent), target appearance: medium-to-dark blue. The 60–70 V DC range in aqueous
phosphoric acid electrolyte is the nominal starting point for the target hue; the exact
voltage, electrolyte chemistry, surface preparation, and batch parameters must be validated
against reference samples before production release. Pantone 2727 C / RAL 5005 Signal Blue
are reference intent only, not a guaranteed process output."

The term "Type II" is removed to avoid confusion with MIL-A-8625 Type II (hard coat for
aluminium), which is a different process entirely.

### Correction 3 — MRI safety framing

**Replaces:** "Ti Gr5 is unambiguously non-ferromagnetic. 316L is austenitic and classified
as MRI-conditional under IEC 60601-2-33, but cold-working during CNC milling can induce
measurable ferromagnetism. The base material adds no magnetic risk with Ti Gr5…"

**Correct text:** "Ti Gr5 is non-ferromagnetic: it adds no magnetic force or torque risk in
the MRI static field — a meaningful base-material property. 316L is austenitic and classified
as MRI-conditional under IEC 60601-2-33, with cold-working risk during CNC milling. However,
non-ferromagnetism is a necessary but not sufficient condition for whole-device MR safety. The
assembled Hexa tag includes conductive antenna elements (Chip A flat coil, Chip B antenna)
that require separate RF heating validation under ASTM F2182 and image artifact assessment
under ASTM F2503 before the assembled device may be labelled MR-conditional or MR-safe. This
is a prototype validation gate, not a property established by material selection alone."

## Principle tests

**P1 (break-glass offline):** Correctly sequencing the manufacturing process ensures the
engraving contrast is achieved. Without the anodize-first sequence, the back-face identification
marks (ADR-0040) lose contrast, potentially degrading legibility in the break-glass visual
read path. ✓

**P2 (tag is a cache):** Accurate manufacturing instructions reduce the probability of a
production defect destroying the physical cache (legible engraving) or creating a false sense
of validated MR safety. ✓

**P3 (only data that changes emergency action, low harm if wrong):** Overstating MRI safety is
a harm vector: a tag incorrectly believed to be MRI-safe on the basis of base-material
ferromagnetism alone may be left on a patient entering a scanner. The corrected framing makes
MR safety a device-level validation requirement, not an inferred material property. ✓

## Consequences

- The manufacturing brief for the core must specify: machine → anodize → laser engrave
  (not machine → laser engrave → anodize).
- The colour specification should be sent to two or three precision Ti anodize shops for
  process-qualification samples before the production specification is locked.
- Marketing and product materials must not describe the tag as "MRI-safe" or "MRI-compatible"
  until ASTM F2182 / F2503 testing has been completed on the assembled device.
- ADR-0041's material selection (Ti Gr5 for field grade) is unchanged.
- The NFC RF validation gate is specified separately in ADR-0052.

## Alternatives considered

**Supersede ADR-0041 entirely.** A full supersession would require restating the entire
material rationale for three corrections that do not change the material decision. An amendment
is the more proportionate and readable approach.

**Accept the anodize-sequence error as a CAD/CAM implementation detail.** The sequence is not
a CAD parameter — it is a process step that could be misunderstood in a manufacturing brief.
The error is in the ADR text, which is used as source documentation for manufacturing. It must
be corrected here.
