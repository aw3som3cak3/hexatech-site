# ADR-0021: Hexagonal break-in-two form factor

- **Status:** Superseded by ADR-0022
- **Date:** 2026-10-05
- **Principles:** P1, P2, P10

## Context
The product is named Hexa and shaped as a hexagon. Swedish and NATO identity tags are designed to snap into two halves: one stays with the body, the other goes to casualty registration. Hexa must keep that function while housing a secure element and NFC antenna.

## Decision
- Hexagonal tag with a scored break line through the centre, splitting it into two halves.
- **Body half** carries the secure element and antenna, so the casualty log and Tier 1 travel with the patient or the deceased.
- **Registration half** carries engraved Tier 0 only (no chip).
- Tier 0 engraved on **both** halves.
- Antenna confined entirely to the body half; the break line must not cross it.

## Consequences
- Chip and antenna area limited to half the tag; drives tag size and antenna design.
- Break line and chip encapsulation need durability testing (bending, water, heat, impact) before certification.
- Registration half cannot be read electronically; registration relies on Tier 0 plus a later read of the body half.

## Alternatives considered
- Chip in both halves (cost, two credentials per person, sync problems).
- Chip in registration half (casualty log separated from the patient).
- No break function (breaks established military and civil-defence practice).
