# ADR-0054: UUID cylinder and break-off plate — 316L stainless as default material

- **Status:** Accepted
- **Date:** 2026-11-04
- **Principles:** P1, P2, P3
- **Amends:** ADR-0049 (changes cylinder and break-off plate material from Ti Gr5 to 316L stainless as default)

## Context

ADR-0049 specifies the UUID cylinder and break-off plate as **Ti Gr5** throughout. This was written for material consistency with the Ti Gr5 outer ring (ADR-0041), not because Ti Gr5 is functionally required for either part.

The cylinder's functional requirement is fire survivability: it must remain on the chain and be legible (UUID readable) after a structural fire. It has no structural load beyond the press-fit and the chain passing through its bore. The break-off plate has no structural role at all.

**Structural fire temperatures** peak at 600–900 °C in most scenarios, reaching 1100 °C only in exceptional cases (aircraft cabin, hydrocarbon fire). Both Ti Gr5 and 316L stainless steel melt at temperatures far above this:

| Material | Melting point | Margin above 1100 °C |
|---|---|---|
| Ti Gr5 | 1660 °C | +560 °C |
| 316L stainless | 1375–1400 °C | +275 °C |

316L stainless is surgical-grade austenitic stainless steel, specified for Class VI medical implants. It is:
- Corrosion-resistant in body fluids (sweat, blood) — identical service environment to the tag
- Laser-engravable with readable contrast
- CNC-turned to tight tolerances from standard bar stock
- Available at a fraction of Ti Gr5 cost from any precision machining supplier
- Already accepted in ADR-0041 as the field-grade alternative for PoC and training tag variants

**The only functional advantage of Ti Gr5 over 316L for this part** is MRI behaviour. 316L is austenitic and classified as MRI-conditional under IEC 60601-2-33 because cold-working during machining can introduce slight ferromagnetism. However, a small solid cylindrical liner with no conductive loops presents negligible RF heating risk; the concern is dominated by the larger tag components. Where strict MRI requirements apply (clinical environments with explicit MR-safe policies), Ti Gr5 remains available as an upgrade.

## Decision

**316L stainless steel is the default material for both the UUID cylinder and the break-off plate.**

Ti Gr5 remains a valid option for deployments with documented MRI-environment requirements (e.g. hospital corps units operating in clinical radiology environments), but it is not the baseline manufacturing spec.

### Impact on ADR-0049 specifications

| Element | ADR-0049 | This ADR |
|---|---|---|
| UUID cylinder material | Ti Gr5 | 316L stainless (default); Ti Gr5 (MRI-upgrade option) |
| UUID cylinder finish | Bead-blast | Bead-blast or satin #4 brushed (equivalent texture) |
| Break-off plate material | Ti Gr5 | 316L stainless (default); Ti Gr5 (MRI-upgrade option) |
| Break-off plate finish | As Ti | Satin #4 brushed (equivalent texture, standard 316L finish) |

All other ADR-0049 decisions (dimensions, engraving content, UUID consistency, break-off doctrine, recessed pocket in tab) are unchanged.

## Principle tests

**P1 (break-glass offline):** 316L survives structural fire with 275 °C margin above realistic maximum temperatures. The UUID cylinder's fire-survival function is preserved. ✓

**P2 (tag is a cache):** 316L and Ti Gr5 have equivalent corrosion resistance and engraving durability in the tag's service environment. The physical identification cache is preserved. ✓

**P3 (only data that changes emergency action, low harm if wrong):** The UUID on the cylinder is an identification field. Material change does not affect the data content or its legibility. ✓

## Consequences

- Manufacturing cost of the cylinder and break-off plate decreases significantly.
- 316L bar stock and turning are standard offerings from general precision machining suppliers, reducing supply-chain risk compared to Ti Gr5 specialist turning.
- If the outer ring moves to PEEK or another polymer (under consideration), maintaining Ti Gr5 for the cylinder would be inconsistent with the cost and manufacturing strategy; this ADR removes that inconsistency.
- Procurement spec for the cylinder must specify 316L ASTM A276 or equivalent, annealed condition, to minimise cold-work ferromagnetism.

## Alternatives considered

**Keep Ti Gr5 for the cylinder, 316L for the break-off plate.** The cylinder is the fire-survival element; the break-off plate is replaceable if damaged. Some differentiation is defensible. Rejected: 316L satisfies the fire-survival requirement for both parts; a split material spec adds procurement complexity without functional benefit. Ti Gr5 upgrade remains available for the whole assembly when MRI requirements demand it.
