# ADR-0047: Physical finish and interaction-affordance refinements

- **Status:** Accepted
- **Date:** 2026-11-04
- **Principles:** P1, P10
- **Amends:** ADR-0040 (chain geometry), ADR-0042 (open face), ADR-0043 (back-face engraving)

## Context

After first renders, three issues were identified:

1. **Antenna slot facet**: The slotted-ring NFC antenna cuts a 1.2 × 2 mm × full-height slot
   through the +Y flat face. Example-text engravings placed on that face were visually cut
   by the slot, and the slot itself reads ambiguously as a "break here" indicator (cf. Swedish
   dog-tag fracture groove).

2. **Interaction affordance**: With only the back-face "TURN PULL" instruction (ADR-0043),
   a user looking at the front does not know to twist the core before pulling. The colour
   split (grey ring / blue core, ADR-0041) signals "two parts"; the open front face
   (ADR-0042) shows the core as a plug. The missing cue is rotation direction.

3. **Finished-edge appearance**: Raw flat-to-flat hex transitions read as unfinished in
   renders. CNC Ti parts always carry an edge break. The back-face chamfer (ADR-0042) was
   the only chamfer; the front rim and core edges were left sharp.

4. **Chain routing display**: The worn-view STL showed chain stubs exiting the front face of
   the mounting tab (+Z, toward the observer). On a ball-chain necklace, the chain exits the
   back face (toward the body) and goes upward toward the neck.

## Decisions

### 1. Antenna slot facet — no engraving

The facet at alpha=90° (facet index 0, `FACET_LABELS["SURNAME"]`) carries the antenna slot.
No engraving relief pocket and no example text are placed on this face. In production the face
is laser-clean (the slot is the only feature). The five remaining facets carry all owner data.

### 2. "TURN" rotation indicator on core front face

A small "TURN" text (1.4 mm, `CORE_ENGRAVE_DEPTH`) is engraved on the core front face
(visible through the open ring, ADR-0042). Combined with the colour contrast and "TURN PULL"
on the back face (ADR-0043), this gives a full affordance chain:
- Blue plug visible through the front → "this is a separate part"
- "TURN" on the face you see → "rotate first"
- "TURN PULL" on the back → confirmed instruction for medic removing the core

### 3. Rim and core edge chamfers

New params (default values, field-grade):

| Param | Value | Edge |
|---|---|---|
| `FRONT_CHAMFER` | 0.3 mm | Ring front-face outer perimeter |
| `CORE_CHAMFER`  | 0.3 mm | Core front and back hex perimeter |

Back-face ring chamfer (`BODY_CHAMFER = 0.4 mm`) introduced in ADR-0042 is unchanged.
The six hex corner edges (facet-to-facet lines) are **not** chamfered — they define the
hex identity and must stay sharp.

### 4. Chain routing: back-face Y-axis stubs

The worn-view and chain-stubs geometry builders now show chain stubs as Y-axis cylinders
exiting from the back face (z = 0 plane) and going upward (+Y) toward the neck, rather than
Z-axis stubs exiting the front face. A short bridge at z = −4 mm connects the two holes
behind the tag.

## Consequences

- Antenna slot facet is visually clean; ambiguity with "break here" is resolved.
- Five facets carry engraved owner data (unchanged data capacity).
- "TURN" on core face survives core removal; combined with back-face text it makes the
  interaction self-explanatory without any printed manual.
- Chamfers add machined-part character to renders and reduce skin-catch risk.
- Chain in worn view reads naturally as a necklace.
