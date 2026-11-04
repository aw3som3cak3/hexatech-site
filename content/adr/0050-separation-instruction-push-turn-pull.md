# ADR-0050: Separation instruction corrected to PUSH · TURN ↺ · PULL

- **Status:** Accepted
- **Date:** 2026-11-04
- **Principles:** P2, P5
- **Supersedes:** ADR-0043 (TURN ↺ PULL — omits the mandatory push step)

## Context

ADR-0043 engraves **"TURN ↺ PULL"** on the ring back face as the operation instruction for
core separation. ADR-0043's own context correctly describes the full three-step sequence:

> "push 0.3 mm axially, twist 30° to clear the bayonet lugs, then pull the core from the back"

The bayonet geometry requires axial compression before the lugs can clear the channel. Without
the push step, a first-time user reading the engraving will attempt to twist without first
compressing, feel the lug binding, and may apply damaging torque or conclude the tag is stuck.

An external reviewer identified this as a usability defect: someone unfamiliar with the product
cannot successfully separate it using the ADR-0043 instruction alone. The push step must be
present in the engraving.

## Decision

Replace **"TURN ↺ PULL"** with **"PUSH · TURN ↺ · PULL"** on the ring back face plate, arc-
engraved around the core bore entrance.

The three tokens are separated by a centre dot (·) to form a legible sequence without implying
equal weight. The rotation arrow (↺) remains centred between TURN and PULL to indicate
anticlockwise release direction when viewed from the back.

**Character height:** 1.0 mm (unchanged from ADR-0043). **Placement:** arc-engraved around
the core bore perimeter, at the same stand-off as ADR-0043.

This text is encountered at the exact moment of use (the user has the back face toward them and
is about to attempt separation), so all three operation steps are visible simultaneously.

## Principle tests

**P2 (tag is a cache):** A complete operation instruction on the device itself is the most
robust form of user guidance — offline, unseparatable from the device, and correct at the
moment of use. Adding the missing PUSH step makes the instruction accurate and complete. ✓

**P5 (owner controls content):** A fixed device operation marking is not owner content. This
ADR changes one operation instruction token; it does not affect any identity or medical data
field. ✓

## Consequences

- The engraving CAM file for the ring back face must be updated to include "PUSH · TURN · PULL"
  with the PUSH token arc-engraved immediately before TURN ↺.
- The added token increases total arc length. Verify that the arc-engraving path remains within
  the available back-face annular area at 1.0 mm character height; reduce to 0.9 mm if needed.
- ADR-0043 is superseded and its status should be updated to "Superseded by ADR-0050".
- Usability validation (see ADR-0052) should include a blind test of this instruction with
  users unfamiliar with the bayonet mechanism to confirm the three-step sequence is correctly
  inferred.

## Alternatives considered

**Symbol-only engraving (↓ ↺ ↑).** Three directional symbols without text. Language-agnostic
but ambiguous without context — ↓ could be read as "down" (press into a surface) or "insert
something." Rejected: the action "PUSH" is unambiguous in English and NATO-language contexts;
symbols alone are higher interpretation burden for a novel mechanism.

**Two-step simplification: combine push and twist.** Describe the motion as a single compound
gesture. Rejected: the bayonet geometry requires a full stop at the compression before twist
begins; a user who attempts a smooth push-and-twist simultaneously may not compress far enough
to clear the lugs. Explicit step separation is safer.
