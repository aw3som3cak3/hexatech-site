# ADR-0041: Frame material — Grade 5 Titanium, bead-blast ring, anodize-blue core

- **Status:** Accepted
- **Date:** 2026-11-04
- **Principles:** P1, P2, P3
- **Supersedes:** —
- **Amends:** ADR-0022 (removes the "material not fixed" deferral; closes Open Question 18)
- **Resolves:** OQ-18

## Context

ADR-0022 explicitly defers the frame material decision to Open Question 18:

> "Frame material is not fixed. The design partner reference uses Ti Gr 5 or steel 316L; the
> correct grade … depends on cost target, durability requirement and deployment context."

The design brief produced in November 2026 evaluated the candidates against the actual use
context: a neck tag worn 24/7 in field conditions (salt spray, sweat, high humidity, potential
MRI exposure), with laser-engraved identification and a titanium electrochemical anodize finish
on the core.

## Decision

**Both ring and core: Grade 5 Titanium (Ti-6Al-4V, ASTM B265)** for field-grade production.

**Ring surface finish:** glass bead blast, 150–180 µm media, standard pressure. Ra 0.6–0.8 µm
(matte, non-reflective). No coating, no anodize, no PVD. Natural titanium grey.

**Core surface finish:** titanium electrochemical anodize (Type II), 60–70 V DC in aqueous
phosphoric acid electrolyte. Interference-based medium blue — Pantone 2727 C / RAL 5005 Signal
Blue. No dye. The anodize is an integral oxide layer; it cannot chip, flake, or abrade separately
from the base metal.

**PoC and training (Drill) variants:** 316L stainless steel is acceptable as a cost-down
substitution. The colour coding is compatible: substitute PVD or Cerakote for the core's blue
where Ti anodize is unavailable. Engraving durability on 316L is marginally lower but adequate
for training cycles.

## Rationale

| Factor | Ti Gr5 | 316L stainless |
|---|---|---|
| Density | 4.43 g/cm³ | 7.98 g/cm³ |
| Corrosion (salt/sweat) | Excellent | Good |
| MRI magnetism | Non-ferromagnetic | Marginally ferromagnetic (cold-work risk) |
| Laser engraving contrast | High (dark oxide marks) | Moderate (requires deeper cuts) |
| Anodize (colour, field grade) | Standard Type II, integral | Not possible; PVD or Cerakote needed |
| Cost | Higher | Lower |

**Weight** is the decisive factor at the product level: the 40 mm hex ring is physically
substantial; a neck tag worn around the clock must not fatigue the wearer. The halved density
of Ti Gr5 over 316L directly reduces wear fatigue and the probability of the tag being removed
(which defeats its purpose).

**MRI safety** matters because the tag will enter clinical environments. Ti Gr5 is unambiguously
non-ferromagnetic. 316L is austenitic and classified as MRI-conditional under IEC 60601-2-33,
but cold-working during CNC milling can induce measurable ferromagnetism. The base material
adds no magnetic risk with Ti Gr5; with 316L, it depends on manufacturing process control.

**Engraving contrast** supports the physical identification function (ADR-0040): dark oxide
marks on a bead-blast Ti surface are higher-contrast than laser marks on 316L and do not require
deeper cuts that weaken the engraved facet.

**Colour coding:** the two-colour split (grey ring / blue core) encodes the operational logic
of the two parts:

- **Grey ring** (stays with casualty): natural bead-blast titanium reads as permanent fixture,
  military hardware, stays here — the same visual register as a standard dogtag blank.
- **Blue core** (travels to records): blue is the global language of identity documents (EU
  passports, national ID cards, NATO credentials). The core carries Chip B — the identity
  reference per ADR-0023/0024 — so blue is accurate colour language for its function.

**Colours rejected for the core:** red, yellow/amber, green, and black are all NATO triage
colours and would create dangerous ambiguity in casualty scenarios. Safety orange communicates
emergency action rather than identity reference, and is not achievable via standard Ti anodize.

## Principle tests

**P1 (break-glass offline):** Ti Gr5 is non-ferromagnetic, reducing MRI conditional risk in
clinical environments where break-glass reads may occur. Material choice does not affect the
offline read path. ✓

**P2 (tag is a cache):** A more durable base material (corrosion, salt, sweat resistance) means
the physical cache — including engraved identification — survives longer without degradation. ✓

**P3 (only data that changes emergency action):** Engraving contrast directly affects legibility
of the physically engraved short-ID under field conditions. Higher-contrast engraving on Ti Gr5
supports reliable identification when the digital layer is unavailable. ✓

## Consequences

- Manufacturing requires a titanium CNC machining step and a bead-blast finishing step for the
  ring, plus a Type II anodize bath step for the core. These are standard aerospace manufacturing
  processes available from precision contract manufacturers.
- The core's blue anodize is applied after engraving: the laser ablates through the oxide layer,
  producing lighter (bare titanium) marks on the blue ground — high contrast, reverse of the ring.
- Render reference values: ring `Color(0.72, 0.72, 0.76)`, core `Color(0.18, 0.38, 0.72)` in
  build123d / Blender.
- Open Question 18 is resolved and closed by this ADR.
- Concept decks in `docs/assets/` that show the tag as uniform grey need regenerating to show
  the two-colour split.

## Alternatives considered

**316L stainless (field grade).** Lower cost, familiar manufacturing. Rejected for field grade:
heavier, lower engraving contrast, MRI magnetism risk under cold-work conditions, and no path
to integral colour differentiation via anodize. Retained for PoC and training variants.

**Anodized aluminium (ring).** Further weight reduction; common in consumer products. Rejected:
lower durability in sustained field use (harder to anodize to sufficient corrosion resistance
in Al than Ti), lower engraving depth without hitting base metal, insufficient stiffness for
the bayonet engagement geometry.

**Polymer / composite.** Not ruled out by ADR-0022 for a low-cost disposable variant. Not
addressed here — a polymer variant would require a separate ADR that re-evaluates engraving
durability, antenna coupling, and manufacturing process.
