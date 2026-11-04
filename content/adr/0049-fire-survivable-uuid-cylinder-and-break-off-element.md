# ADR-0049: Fire-survivable UUID cylinder and break-off identity element

- **Status:** Accepted
- **Date:** 2026-11-04
- **Principles:** P1, P2, P3
- **Amends:** ADR-0040 (adds a third physical identity element alongside ring and core engraving)

## Context

ADR-0040 establishes that physical identification must survive loss of the digital layer. It
relies on laser-engraved fields on Ti Gr5 surfaces to satisfy this requirement.

A subsequent concern: **fire survival.** In fire or extreme-heat scenarios, the electronic
components (Chip A, Chip B, polymer carrier per ADR-0048) will be destroyed. The Ti outer
shell of the ring will survive structural fire temperatures — Grade 5 titanium melts at 1660°C,
far above any structural fire — but whether the engraved fields remain legible after fire
damage depends on surface oxidation and soot. More critically, the ring and core are attached
to the body; in a fire they may separate or be displaced if the chain fails or is cut by heat
exposure.

**The traditional solution — which this ADR extends** — is the military dog-tag break-off
system (US M1940, Swedish Försvarsmakten standard): two physically identical identity tokens
are carried together; one stays with the remains, one travels with the reporting chain. The
break-off token ensures identification even when the primary tag cannot be recovered.

**The proposed extension** adds a third physical identity element that:
1. Is threaded directly on the chain (cannot separate from the person as long as the chain
   is intact, independent of the ring and core);
2. Survives fire without electronics;
3. Carries a UUID that is the same enrollment short-ID engraved on the ring and core (ADR-0040),
   providing lookup into the digital record when network is available;
4. Includes a break-off piece that follows established military identification procedure.

## Decision

### UUID cylinder insert

A solid Ti Gr5 cylinder is press-fit into the chain mount tab (the top-vertex block on the
ring, per ADR-0048). The cylinder:

- Is the **liner of the chain through-hole**: the ball chain passes through the cylinder's
  inner bore (Ø 3.2 mm, same as the chain hole diameter). The cylinder cannot come off the
  chain unless the chain itself is cut or unclasped — it is permanently threaded.
- **Outer diameter:** ≈ 7–8 mm (to leave ≥ 1.5 mm wall in the tab around the bore).
- **Length:** full Y-extent of the tab (12 mm), flush with both tab faces.
- **Engraved on the outer surface:** the 16-character enrollment short-ID (the same ID on
  ring facet 2+3 and core facet 2+3 per ADR-0040). The cylindrical surface gives adequate
  linear length for a legible engraving at 1.5 mm character height.
- **Material:** Ti Gr5, natural bead-blast finish (same register as the ring outer surface).
- **Survival path:** when the polymer tab is destroyed by fire, the cylinder remains threaded
  on the chain. It is recoverable and machine-readable (UUID → digital record lookup) or
  visually readable if the UUID is known to the responder.

### Break-off element

A flat Ti Gr5 plate (approximately 10 mm × 25 mm × 1.0 mm) is attached to the UUID cylinder
by a thin scored neck (0.5 mm wall). The plate:

- Carries the same 16-character enrollment short-ID, laser-engraved, plus the owner's
  SURNAME and GIVEN NAME fields (consistent with ring facets 0 and 1, ADR-0040).
- Has perforated score marks at the neck connection for clean manual break-off under field
  stress conditions.
- Is stored flat against the chain mount block during wear (a small recessed pocket in the
  tab holds it flush, preventing snagging).
- **Doctrine:** when a casualty is found, the break-off plate is separated and placed with
  the reporting chain (the same procedure as the second half of a traditional dog-tag pair).
  The cylinder stays on the chain with the remains.

### UUID consistency

The enrollment short-ID on the cylinder and break-off plate is the same 16-character value
used on:
- Ring facets 2 (ID-A) and 3 (ID-B) — first and second 8-character halves
- Core facets 2 and 3
- Chip A ring-only profile (tag locator, ADR-0038)
- Chip B identity reference (ADR-0024/0036)

One enrollment ID, six physical and digital locations. Any single surviving element is
sufficient to identify the person given network access; the SURNAME+GIVEN NAME on the
break-off plate and ring engraving provide identification without network when visual
inspection is possible.

## Principle tests

**P1 (break-glass offline):** The cylinder and break-off plate function with zero electronics,
zero network, zero power. Visual identification is the ultimate offline fallback. ✓

**P2 (tag is a cache):** The UUID cylinder is redundant with the ring engraving and the chip
data — it adds survivability without replacing any layer. If the cylinder is destroyed, the
ring engraving and chips still function. The tag can be reissued; the enrollment short-ID is
regenerated to the same value from the account. ✓

**P3 (only data that changes emergency action, low harm if wrong):** Name and UUID are
identification fields, not treatment instructions. Identification changes what a medic does
(enables correct record lookup, casualty log attribution) and is low-harm if wrong (a
misidentification is correctable from the digital record; it does not cause direct clinical
harm in the first hour). ✓

## Consequences

- The chain mount tab is physically larger to accommodate the cylinder outer diameter plus
  wall thickness. Nominal tab increase: +1.5–2 mm per side in Y (tab half-width from 6 mm
  to ≈ 8 mm). CAD params `CHAIN_TAB_HALF_W` and `CHAIN_TAB_DEPTH` need re-evaluation.
- A new manufactured part (the cylinder) must be turned, bored, engraved, and press-fit
  at assembly time. This is standard precision-turning work.
- The break-off pocket in the tab adds a shallow recess feature to the ring CAD.
- The enrollment flow must provision the short-ID on the cylinder and break-off plate at
  the same time as the chip enrollment. The cylinder is a physical part; it must be
  manufactured with the engraved short-ID before the tag is assembled, which means the
  enrollment short-ID must be allocated at order/manufacturing time, not at activation time.
- Concept decks in `docs/assets/` showing the chain mount need updating to reflect the
  cylinder and break-off element.

## Alternatives considered

**Stamp the UUID directly on the tab itself (no separate cylinder).** Simpler, but the tab
(polymer in ADR-0048 construction) may not survive fire. The Ti Gr5 cylinder is the
fire-survivable element — it cannot be the tab itself if the tab is polymer.

**Separate metal tag on a secondary loop on the chain.** A second dogtag-style plate clipped
to the chain nearby. This is functionally equivalent but adds a free-hanging part that can
snag, is separated from the tab if the chain section is cut, and does not benefit from being
threaded through the hole. The cylinder-in-hole approach is geometrically cleaner.

**Full second dogtag (traditional pair).** The traditional US/Swedish solution was two
identical plates, one worn around the neck, one on a shorter secondary chain on the same
loop. This ADR adopts the same doctrine (break-off piece + cylinder-stays-on-chain) using
the tab geometry as the structural anchor rather than a separate plate pair.

**Duplicate all ring facet fields on the cylinder.** All 6 fields × 8 characters would
require ≈ 60 mm of engraved text on a 12 mm cylinder — achievable via helical engraving
but harder to read under field conditions. Name + short-ID on the break-off plate and
short-ID only on the cylinder surface is a better compromise: the small cylinder surface
carries the unique lookup key; the break-off plate carries the human-readable identity.
