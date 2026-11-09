# ADR-0022: Ring-and-core form factor (partner design)

- **Status:** Accepted (supersedes ADR-0021; self-amended 2026-11-01: wear position and chip B antenna note added; amended by ADR-0038, ADR-0042, ADR-0045, ADR-0048)
- **Date:** 2026-10-05
- **Principles:** P1, P2, P10

## Context
The design partner's concept (HEXA-GA-001 rev 0.1) replaces a snap-in-two tag with a metal ring and a twist-out ceramic core, locked by a bayonet with shear pins and a tamper loop.

## Decision
- 40 mm across corners, 3.6 mm ring frame, ceramic core, silicone rim, two passive NFC chips, no battery.
- **Frame material is not fixed.** The design partner reference uses Ti Gr 5 or steel 316L; the correct grade (or a non-metal alternative such as composite or polymer) depends on cost target, durability requirement and deployment context. A low-cost plastic or composite variant is not ruled out — see Open Question 18.
- **Wear position: neck tag (chain or lanyard). Not a finger ring.** This drives antenna placement, read geometry and survival testing parameters.
- **Chip A (ring):** Tier 1 emergency profile, casualty log, owner key (FIDO2), site access, tamper sensor. Read through a slotted-ring antenna.
- **Chip B (core):** identity reference and the death declaration only (see ADR-0023, 0024). No health data.
- Engraving: Geneva fields on the six facets; service number and nation on the core; tactile mark per ADR-0026.
- Variants: at minimum a field-grade tag and a Drill variant (training; test root only, resettable core). Additional variants (e.g. unidentified-soldier disposable in plastic) are not yet decided.

## Consequences
Ring stays with the body with the casualty log; core travels back. Open hardware risks: read range through the slotted ring, two chips in one reader field, shear-pin torque scatter, fire/blast/immersion/cold testing.

Chip B antenna orientation inside the seated ring is untested — bench testing required before geometry is locked. The frame will attenuate chip B when the core is seated; attenuation varies by material (metal vs composite vs plastic); perpendicular orientation of chip B's antenna to the ring plane may be necessary to achieve adequate coupling in metal frames.

## Alternatives considered
ADR-0021 break-in-two hexagon (no irreversible tamper evidence, chip placement compromises).
