# ADR-0055: Field-grade ring material alternatives formally evaluated — Ti Gr5 outer shell confirmed

- **Status:** Accepted
- **Date:** 2026-11-04
- **Principles:** P1, P2, P3
- **Amends:** ADR-0041 (adds formal evaluation and rejection of PEEK and zirconia as ring materials; closes these alternatives)

## Context

ADR-0041 accepts Grade 5 Titanium as the field-grade material for the ring and core outer
shell. It was challenged on cost grounds: Ti Gr5 is expensive, and this is a functional
life-safety device rather than a fashion product. Two alternatives were evaluated by an
industrial designer with wearable hardware manufacturing experience:

1. **Full PEEK (polyether ether ketone)** outer shell — a high-performance medical-grade
   engineering polymer that is RF-transparent, chemically inert, and significantly cheaper
   to machine than Ti Gr5.

2. **Zirconia (Y-TZP, yttria-toughened zirconia)** outer shell — a technical ceramic used
   in Apple Watch Edition and premium phone backs. Non-conductive, RF-transparent,
   8.5 Mohs hardness, ceramic tactile register.

Both were also evaluated for their NFC implication: a non-conductive outer shell would
eliminate the need for the polymer inner carrier (ADR-0048), simplifying the construction.

## Evaluation: Full PEEK outer shell

**Ruled out on two hard constraints.**

### Hard constraint 1 — Bayonet engagement surface

The bayonet lugs (ADR-0022) are a precision engagement surface on a life-safety device that
must be operated under stress by users with varying technique. PEEK tensile strength is
~100 MPa vs Ti Gr5 at ~950 MPa. PEEK is notch-sensitive: lug edges carry repeated torque
and peel loading during core removal.

PEEK bayonet lugs will: (a) creep under sustained load, losing dimensional accuracy over time;
(b) round and wear at the engagement edges under repeated use; (c) fracture under angular
peel force if the user does not apply pure torque. The failure mode is ductile (slow, with
warning), but the outcome — dimensional loss of a life-safety engagement surface — is not
acceptable for field grade.

### Hard constraint 2 — Engraving survivability

Laser engraving on PEEK produces ablated grooves. Ti laser marks are Ti oxide — flush with
the surface, chemically stable, resistant to dissolution, and demonstrably survivable in
military forensic identification after field exposure, water, and body fluid contact.

PEEK engraving grooves fill with blood, soil, and body fluids under field conditions and
degrade legibility faster than Ti oxide marks. For the physical identification function
(the most critical fallback when electronics fail), this is a material downgrade where
it matters most.

**Additional concerns:** UV-stabilised grade required (standard PEEK yellows under extended
UV); colour differentiation requires Cerakote rather than Ti anodize (Cerakote is not an
integral oxide layer — it is applied and can be abraded).

**What PEEK is correct for:** the inner electronics carrier (ADR-0048) — a bonded,
non-structural, non-engagement component requiring only dimensional stability and RF
transparency. PEEK in this role is exactly right.

**Training/drill variant:** a full-PEEK tag is a defensible choice for training and
drill variants (controlled environments, lighter duty). This should be addressed by a
separate ADR when that product variant is scoped.

## Evaluation: Zirconia (Y-TZP) outer shell

**Ruled out. Fails both hard constraints and introduces additional deficits.**

### Hard constraint 1 — Bayonet engagement surface (worse than PEEK)

Y-TZP fracture toughness is ~6–10 MPa·m^0.5 vs Ti Gr5 at ~50–80 MPa·m^0.5. Zirconia
has excellent compressive strength (~2,000 MPa) but poor resistance to tensile stress
concentrations — precisely what a bayonet lug edge experiences during shear and peel loading.

The failure mode ranked against alternatives:

| Material | Failure mode | Warning |
|---|---|---|
| Ti Gr5 | Plastic deformation at extreme overload | High — ductile, absorbs energy |
| PEEK | Creep, gradual dimensional loss | Moderate — slow, detectable |
| Zirconia | Brittle fracture at stress concentration | **None** — sudden, no energy absorption |

Sudden catastrophic failure without warning is the worst possible failure mode for a
life-safety engagement surface operated under stress. Zirconia is worse than PEEK here,
not better.

Secondary concern: zirconia ring against Ti Gr5 core creates a ceramic-on-metal interface
under repeated engagement. Differential hardness produces ceramic abrasion wear particles
(fine oxide grit) and risks lug edge chipping.

### Hard constraint 2 — Engraving survivability after fire

Y-TZP at structural fire temperatures (600–1,100°C) followed by rapid cooling or water
quench (fire suppression) may undergo tetragonal-to-monoclinic phase transformation, causing
surface microcracking, discolouration, and degraded mark legibility. Ti oxide marks after
structural fire are stable and demonstrated in military forensic identification. Zirconia
engraving survivability after fire is uncertain and dependent on thermal history.

### Additional deficits

**Cost:** zirconia is not cheaper than Ti Gr5 at 500–2,000 piece volumes. Ceramic injection
moulding (CIM) — the affordable zirconia path — amortises tooling correctly only above
~50,000 pieces. At prototype and early-production volumes, the route is green machining +
sintering + post-sinter diamond grinding: $200–500+ per ring, more expensive than Ti Gr5.

**Weight:** zirconia density is 6.0 g/cm³ vs Ti Gr5 at 4.43 g/cm³ — 35% heavier for the
same geometry. ADR-0041 chose Ti over 316L stainless partly on weight (316L is 7.98 g/cm³).
Zirconia is heavier than 316L stainless by weight-per-volume, negating the rationale that
justified Ti's cost premium.

**Aesthetic association:** zirconia is now inescapably associated with the Apple Watch Edition
and luxury consumer wearables. The product must communicate authority and permanence at the
moment of use. Ti reads as aerospace, orthopaedic implants, military hardware. Zirconia reads
as premium consumer electronics — the wrong association for a device a medic must trust
instantly under stress.

**Manufacturing lead time:** 8–16 weeks from a ceramic specialist, vs 2–4 weeks for Ti CNC.
Thin features (the 0.5 mm parting groove, chamfers, chain tab) are cracking risks during
green machining and sintering. Bayonet engagement tolerances (±0.01–0.05 mm required;
ceramic post-grind achieves ±0.1–0.3 mm) require careful DFM and prototype iteration.

## Decision

**Ti Gr5 outer shell is confirmed as the field-grade ring material. ADR-0041 stands.**

Both PEEK and zirconia are formally evaluated and rejected for the outer shell on the grounds
documented above. The NFC transparency benefit shared by both alternatives is real, but
ADR-0048 already solves the RF problem for the Ti shell construction. The simplification
does not outweigh the bayonet and engraving regressions.

**Cost lever:** if per-unit cost is a constraint, the productive optimisation is not material
substitution. It is manufacturing strategy: an Asia-based precision CNC contract manufacturer
with in-house bead-blast and Ti anodize capability, targeting the 2,000-piece volume tier
where machining amortisation falls materially. Saving $40–80 per ring by downgrading the
bayonet engagement surface and physical identification layer is the wrong optimisation for
a life-safety device.

## Consequences

- ADR-0041 field-grade material (Ti Gr5 for ring outer shell) is not subject to further
  challenge without new technical evidence (e.g. a novel Ti equivalent at lower cost, or a
  ceramic grade with demonstrated ductile failure mode and bayonet track record in medical
  devices).
- PEEK and zirconia alternatives are closed. Future material proposals should address the
  two hard constraints (bayonet engagement survivability; engraving survivability in fire
  and field conditions) explicitly or propose a geometry that eliminates the bayonet (a
  different separation mechanism).
- A training/drill variant in full PEEK remains open and should be addressed by a separate
  ADR when that product line is scoped.
- UUID cylinder and break-off plate: 316L stainless default per ADR-0054. This cost
  reduction is appropriate because neither part is a bayonet engagement surface or a
  primary fire-identification element (that role is now held by the Ti outer shell engraving
  and the 316L UUID cylinder).

## Principle tests

**P1 (break-glass offline):** Ti Gr5 laser engraving provides the highest-durability physical
identification layer — readable after fire, field exposure, and biological contamination.
Rejecting PEEK and zirconia preserves this. ✓

**P2 (tag is a cache):** Ti Gr5 bayonet lugs maintain engagement accuracy over the product
lifetime without creep (PEEK failure) or sudden fracture (zirconia failure). The physical
cache remains accessible. ✓

**P3 (only data that changes emergency action):** Identification data legibility after fire
is a function of engraving substrate durability. Ti oxide marks are the most reliable substrate
for the identification fields. ✓
