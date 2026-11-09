# ADR-0056: Alternative physical form factor — NFC hex card + 316L steel tear-away

- **Status:** Proposed
- **Date:** 2026-11-04 (revised 2026-11-09)
- **Principles:** P1, P2, P3
- **Acceptance dependency:** ADR-0057 (chip access model, UUID persistence, auth verification) must be Accepted before this ADR can be accepted. The public partition specification below is amended by ADR-0057 Decision 1.
- **Would supersede (if accepted):** ADR-0022 (ring-and-core), ADR-0038 (Chip A ring-only),
  ADR-0040 (physical identification layer — separation doctrine changes),
  ADR-0041/0051/0055 (Ti Gr5 ring — ring eliminated),
  ADR-0048 (Ti shell + PEEK inner carrier), ADR-0049/0054 (UUID cylinder + break-off plate)
- **Preserves (unchanged if accepted):** ADR-0003 (secure element), ADR-0016 (IPS profile),
  ADR-0052 (validation gates — gate definitions superseded by ADR-0065), all digital-layer ADRs 0001–0039
- **Death confirmation:** two-key principle from ADR-0023 preserved via JCOP applet state
  machine — see ADR-0063

## Context

A first-principles review in November 2026 identified a structural asymmetry in the
ring-and-core design: the electronics have never survived fire. The fire-survival layer
was always the Ti Gr5 engraving. The elaborate bayonet mechanism, the PEEK inner carrier,
and the break-off plate add cost and manufacturing complexity to a layer that burns
regardless.

A second observation: the two-chip architecture was fragile under the update model. Any
change to the person's medical profile requires both chips to be updated in sync. In
practice, one chip would be updated and the other would go stale within months. The
two-chip design would fail operationally faster than the hardware would wear out.

A third observation: the US military dog-tag doctrine already solves this problem in a
proven, manufactured form factor. Two elements on a neck chain. One stays with the person,
one goes with the reporting chain. Personnel worldwide know the doctrine without training.

**The simplest system that satisfies all requirements** is two hexagonal elements, both
54 mm across-corners (see Decision — card size below):

1. A plastic NFC card — electronics carrier, stays with the person
2. A 316L stainless steel tear-away — physical identity token, goes with the reporting chain

## Proposed design

### Element 1 — NFC hex card (stays with person)

- **Body:** PC/PETG laminate, 54 mm across-corners, 3.5 mm thick, chamfered edges;
  hex orientation: pointy-top (one vertex at +Y / chain hole, one vertex at −Y)
- **Electronics:** JCOP 4 (JavaCard 3.0.5 / GP 2.3.1) — chip selection per ADR-0059;
  chip has two logical partitions:
  - **Public partition** (unauthenticated read): random session identifier only in sovereign mode (ADR-0057 Decision 1); in consumer mode Tier 1 emergency profile also returned unauthenticated (ADR-0061 Decision 1). Original: SURNAME, UUID, red-flag line — not adopted; conflicts with ADR-0024.
  - **Protected partition** (authenticated read): full Tier 1 medical profile per ADR-0016 in sovereign mode; Tier 2 and above in both modes
- **Antenna:** flat hexagonal 2-turn etched foil antenna, produced on PET inlay substrate
  and hot-press laminated into the PC/PETG body; ~50–51 mm AC effective aperture; tuning
  capacitor (NPO/C0G, ±1% tolerance) targeting resonant frequency 14.5–15 MHz free air with
  ferrite sheet installed — initial prototype target, confirmed by Gate 1 measurement
  (ADR-0065); loaded Q 15–35 at 13.56 MHz (chip attached, grommet installed; not unloaded coil-only Q); minimum conductor:
  35 μm Cu, 0.3 mm trace width; 10 mm OD keep-out zone around grommet bore
- **Ferrite sheet:** NiZn sintered ferrite sheet (μᵣ ≥ 100 at 13.56 MHz, 0.3–0.5 mm thick;
  e.g. TDK IFL06, Laird BMF-30, or Würth 348005) bonded to card back face, die-cut to
  hexagonal profile with a 10 mm OD aperture centred on the grommet bore; required mitigation
  for 316L tear-away field attenuation in stacked wear configuration (OQ-33 design decision;
  physical validation at Gate 1)
- **Face engraving:** SURNAME / GIVEN NAME / Tag Locator (11-char) / UNIT — laser marked or
  hot-embossed; not fire-survivable but provides quick visual read without scanning
- **Surround:** silicone hex edge gasket (modified dog-tag silencer form), ~1.8 mm wall,
  partial face flange; Shore A 40–55 durometer; minimum pull-off force 20 N radial peel from
  card edge; bonded by 0.6–0.8 mm peripheral channel in card laminate edge; resistant to IPA
  wipe (70% isopropanol) without bond degradation; NFC wave icon moulded or laser-marked on
  the card face to identify the chip element to civilian and humanitarian users
- **Chain hole:** at the top (+Y) vertex; fitted with a 316L stainless flange grommet

#### 316L stainless flange grommet (Tag Locator carrier — fire-survival layer)

The grommet is pressed into the card's chain hole and serves two independent functions:

1. **Mechanical:** the chain passes through the steel bore, never touching the plastic card.
   This eliminates wear-through of the card at the chain hole — the most common failure
   mode for thin cards on metal chains.

2. **Physical identification fallback:** when the plastic card burns in a structural fire,
   the grommet remains on the chain. Tag Locator engraved on the flange face is the
   fire-survival identifier — equivalent in function to the UUID cylinder in the previous
   design (ADR-0049/0054), but integrated directly into the card rather than being a
   separate element.

Grommet specification: 316L stainless, double-flange, 9 mm flange OD, 3.5 mm bore.
Grommet centered at approximately 10.4 mm from the vertex along the bisector, giving a
~4.5 mm flange-to-boundary clearance (10.4 × sin 60° − 4.5 ≈ 4.5 mm; chain-hole vertex
= +Y vertex, pointy-top hex orientation).

**Grommet engraving — abbreviated locator (fire-survival identifier):** the 9 mm OD /
3.5 mm bore leaves only 2.75 mm of radial ring width — insufficient for the full 11-char
Tag Locator at a bare-eye-readable character height. The grommet carries the **first
6 Crockford characters of the Tag Locator**, die-struck to ≥ 0.3 mm physical relief depth.
Readable with a 10× loupe under raking light after fire exposure. Treat as forensic fallback
for laboratory identification; bare-eye field identification relies on the tear-away face.
A 6-char prefix spans ~30 bits (Crockford base32). At 10 K enrolled individuals the birthday collision probability is ~4.5% — the prefix is not guaranteed unique by space alone. Per ADR-0060 Decision 4, the enrollment system must enforce prefix uniqueness by re-rolling the Enrollment ID until a unique 6-character prefix is obtained; ambiguous forensic lookup is not an accepted fallback. The grommet abbreviated locator carries no check character; a misread from a fire-damaged part is not self-detecting. Registry lookup with disambiguation by name and unit remains the confirmation path.
The full 11-char Tag Locator is engraved on the tear-away face (bare-eye field read).
Minimum character height on the grommet flange: ≥ 1.5 mm at mid-ring radius (confirm
in CAD before die specification is issued).
**Grommet engraving method:** ≥ 0.3 mm relief depth; method (die-striking or CNC engraving) chosen after the DFM check. **DFM check required before die specification:** stamping 0.3 mm relief into a 0.8 mm flange may distort the flange geometry or bore tolerance; have the machinist confirm feasibility and inspect bore concentricity after a pilot run. The grommet is engraved against its designated Enrollment ID (allocated in enrollment step 1), matched to its card assembly, and recorded in the enrollment transaction. Enrolled grommets must be tracked through assembly — no generic pre-engraving.

**Card grommet:** barrel height = 3.5 mm (CARD_T). **Tear-away grommet:** barrel height =
2.5 mm (TOKEN_T). Both have 0.8 mm flanges on each face. Chain bore through both elements
is 3.5 mm diameter.

**Chain ball/link diameter:** chain ball or link diameter on the grommet's chain segment must
exceed the 3.5 mm bore — minimum ball diameter 4.0 mm — so the grommet cannot slide off
the chain when the plastic card body burns away.

**Chain assembly method:** a ball ≥ 4.0 mm cannot be threaded through a 3.5 mm bore — end-threading
is not an option. The chain design must use one of: (a) a split-bore or crimp-closed grommet that
opens to accept the chain and is then closed, or (b) a closed-link chain topology where the grommet
is captured during assembly rather than threaded. Consequence: the chain cannot be field-swapped
without specialised tools. This must be defined in the manufacturing drawing before tooling is ordered.

The assembly has three Tag Locator carriers: card grommet flange (6-char abbreviated locator,
die-struck), tear-away grommet flange (6-char abbreviated locator, die-struck), tear-away
engraved face (full 11-char Tag Locator).

**RF constraint (EE review 2026-11-09):** NXP JCOP 4 operates at 13.56 MHz; a 316L
grommet acts as a shorted conductive ring with skin depth ~0.12 mm. At ≤9 mm OD the antenna
conductor can route around the grommet with minimal detour; above ~12–13 mm OD the detour
becomes significant (~250 mm² aperture loss) and may require detuning to compensate. 9 mm OD
is the upper end of the safe range; empirical RF verification required at PoC Gate 1.

### Element 2 — 316L steel tear-away (goes with reporting chain)

The tear-away matches US dog-tag short-chain doctrine exactly: on a short chain attached
to the main neck chain, easily separated by the first responder who encounters the person.

- **Body:** 316L stainless steel, 54 mm across-corners (matches card outer size), 2.5 mm thick
- **No NFC chip** — the reporting chain does not need to scan; they need to record an
  identity and look it up in the casualty log system when connectivity is available
- **Engraved fields (both faces):**

| Field | Rationale |
|---|---|
| SURNAME | Offline identification without lookup |
| GIVEN NAME + INITIAL | Disambiguation |
| Tag Locator (11-char) | Digital link — lookup key for casualty log |
| UNIT / NATIONALITY | Routing the report; jurisdiction for remains processing |
| Enrollment date | Age of the data; prompts re-enrollment if stale |

- **Chain hole:** at the top (+Y) vertex; fitted with a 316L stainless double-flange grommet
  (9 mm flange OD, 3.5 mm bore, 2.5 mm barrel to match TOKEN_T). The chain passes through
  the steel bore, protecting the hex edge from wear when the tear-away is pulled free.
  Abbreviated Tag Locator (6 Crockford chars, die-struck to ≥ 0.3 mm relief) is engraved
  on the grommet front flange face; full 11-char Tag Locator is engraved on the face.
- **Short chain connector:** quick-release connector with deliberate separation force 25–50 N;
  resistant to inadvertent separation under 15 N snag or handling load. Connector type must
  be specified in the manufacturing drawing before procurement. Gate 2 (ADR-0065) includes
  an inadvertent-separation test.
- **Separation marking:** "KIA ONLY" (or bilingual equivalent for the target deployment)
  engraved on a reserved area of the tear-away face, character height ≥ 2 mm; communicates
  the separation doctrine to civilian and humanitarian first responders.
- **Fire survival:** 316L melts at 1,375–1,400 °C; grommet and full identity fields survive
  structural fire. Fire-survival engraving depth ≥ 0.3 mm for all 316L elements: **grommet
  flanges die-struck; tear-away face fiber-laser at ≥ 0.3 mm depth.** Both methods produce
  sufficient physical relief for loupe legibility after 700–900 °C fire exposure. Gate 1
  supplementary fire test: expose an engraved 316L sample to 850 °C for 30 minutes in air;
  verify character legibility with 10× loupe after cooling (pass criterion: individual
  characters identifiable).

**RF stacking mitigation (EE review 2026-11-09, OQ-33 decision):** A solid 316L disc
(54 mm × 2.5 mm) is ~21 skin depths thick at 13.56 MHz (δ ≈ 0.12 mm) and suppresses NFC
field coupling by 70–95% in the stacked configuration — reads will fail without mitigation.
"Unclip tear-away first" is excluded (ADR-0063 Decision 1b).

**Required mitigation: ferrite sheet** bonded to the card back face (specified under Element 1
Antenna above). Note: NXP antenna guidance states ferrite changes the field and antenna tuning
but does not necessarily improve operating distance — Gate 1 measurement 8 (config D) is the
empirical confirmation.

The ferrite sheet makes the card functionally asymmetric: the **front face is the readable face**
(NFC icon marked on front). For reliable reads, the reader should be presented to the front face.

**Recommended handling step before tapping:** "move the tear-away aside before presenting the reader
to the card front face." This is deliberate handling, not removal; it does not violate ADR-0063
Decision 1b. First responders and trained users should be instructed to do this. The ferrite sheet
remains required as the passive mitigation for cases where the user does not perform this step or
the reader geometry is unknown (e.g. automated gate reader).

**Gate 1 failure configs (documented limitations):** ADR-0065 Gate 1 also records (config E)
card reversed — reader on ferrite/back face — and (config F) tear-away in front of card without
moving aside. Both are expected fails; they document the design's known orientation sensitivity.

**Gate 1 iOS test harness:** ADR-0065 measurement 9 requires a real iPhone (Core NFC). ADR-0034 defers the full iOS medic app. The Gate 1 iPhone test uses a minimal Core NFC test harness — an app that selects the Hexa AID, exchanges APDUs, and records transaction outcomes. This harness does not need to implement the emergency display UI; it validates the NFC transaction layer only.

### Why no NFC on the tear-away

Adding NFC to the tear-away would require keeping two chips with medical data
synchronized. In practice:

- Profile changes (new medication, change of unit, medical update) require updating both
  chips at the same time
- In the field, re-enrollment infrastructure may update only one chip
- The two chips diverge; it becomes unclear which is current
- Two-chip synchronization failures would occur faster than hardware wear-out

The reporting chain's actual need is a Tag Locator they can enter into the casualty log system.
The Tag Locator is on the engraved face. No chip is required.

This is consistent with ADR-0027 (identity broker — pointers, not copies): the physical
token holds a pointer (Tag Locator); the network holds the data.

### Why no separate Ti ring

The Ti Gr5 ring in the previous alternative (ADR-0056 rev 1) provided fire-survivable
physical identification. In this design, that function is served by:

1. The 316L steel grommet on the card (Tag Locator, always on chain)
2. The 316L steel tear-away (full identity fields, may have been taken but typically present)

Both elements are fire-survivable at structural fire temperatures. The Ti ring added cost
(it was the most expensive element at $20–40) and introduced a third element to the system.
Two elements with both carrying fire-survivable identifiers satisfies the requirement without
the ring.

## Sealed manufacturing unit

The JCOP card, grommet, and silicone surround form a **sealed card assembly**. The 316L
tear-away is enrolled in the same controlled transaction but is a physically separate element.

**Enrollment sequence (not a single atomic write — a controlled transaction with readback verification):**

1. Allocate Enrollment ID in the enrollment system registry; derive Tag Locator; validate Tag Locator and 6-character prefix uniqueness per ADR-0060 Decision 4.
2. Engrave physical carriers:
   a. Die-strike or CNC-engrave grommet flanges (abbreviated Tag Locator — first 6 Crockford chars) at ≥ 0.3 mm relief depth; inspect bore concentricity. Any grommet that fails inspection must be physically defaced (engrave REJECTED or equivalent) and recorded as rejected in the enrollment system before a replacement grommet is substituted.
   b. Fiber-laser engrave tear-away face (full 11-char Tag Locator, identity fields) at ≥ 0.3 mm depth.
   c. Print/engrave card face (Tag Locator, identity fields).
3. Assemble: press-fit grommet into card; bond silicone surround.
4. Personalise the JCOP chip: write Enrollment ID, configure partitions, provision keys.
5. Readback verification: scan card; verify Tag Locator on chip matches grommet engraving and matches enrollment registry entry.
6. Release set, or reject the entire set if any carrier mismatches.

PII (name, unit, allergies) is added to the tear-away and card face at personalisation, after Tag Locator enrollment. The sequence preserves atomicity at the transaction level — a mismatch at step 5 voids the full set before it ships.

The silicone surround is bonded at manufacture with mechanical retention (a 0.6–0.8 mm
peripheral channel in the card laminate edge). The card is not removable without destroying the
surround. PII (name, unit, allergies) is added to the tear-away and card face at personalisation,
after Tag Locator enrollment. **Card assembly reissue**: a replacement sealed card assembly
(JCOP card + grommet + surround) receives the same Enrollment ID and Tag Locator (ADR-0057
Decision 2); the steel tear-away remains valid independently. The grommet moves with the card
assembly — it is not transferred to a new assembly without a controlled enrollment transaction.
Full system replacement (card assembly + tear-away) is also an option. Neither reissue type
is performed in the field without enrollment authority oversight.

## Separation doctrine

| Element | Goes with | Chain type | Action |
|---|---|---|---|
| NFC card + silicone surround | Casualty (stays on body) | Standard neck chain | Stays |
| 316L tear-away | Reporting chain | Short chain (attached to main) | Pull off — **KIA only** (ADR-0063 Decision 1b) |

**Tear-away doctrine:** the tear-away is NOT pulled from a living wounded person. It is
pulled only from a person confirmed as KIA. For wounded personnel, the tear-away stays
with the person; the JCOP tag remains on the body in all cases.

After separation (KIA scenario):
- Treating/confirming authority reads JCOP tag: authenticated read returns full Tier 1 profile; in consumer mode, Tier 1 also returned unauthenticated (ADR-0061); unauthenticated tap in sovereign mode returns session identifier only (ADR-0057)
- Reporting chain records Tag Locator from tear-away engraving for entry into casualty log
- If casualty is KIA and card has burned: grommet on chain gives Tag Locator for identification
- If tear-away was separated before fire: grommet Tag Locator is the remaining identifier

## Cost estimate

Asia-Pacific precision manufacturer. Card lamination and die-cutting from NFC card
specialist; steel tear-away from precision machining shop.

### NFC hex card system (card body + grommet + silicone surround)

| Component | 1,000 pcs | 5,000 pcs | 50,000 pcs |
|---|---|---|---|
| Hex laminate body (PC/PETG, die-cut) | $4–8 | $2–5 | $1–2.50 |
| JCOP secure element | $5–10 | $3–7 | $2–4 |
| Hex antenna coil (etched foil inlay, laminated) | $3–5 | $2–4 | $1–2 |
| Card face engraving / hot-emboss | $1–2 | $0.80–1.50 | $0.50–1 |
| Silicone hex surround (injection mould + part) | $1–2 | $0.50–1 | $0.20–0.50 |
| 316L grommet (turned, Tag Locator engraved) | $3–5 | $2–4 | $1–2 |
| Grommet press-fit + QC | $0.50–1 | $0.30–0.60 | $0.20–0.40 |
| **Card subtotal** | **$17.50–33** | **$10.60–23.10** | **$5.90–12.40** |

*Silicone surround tooling: ~$2,000–4,000 one-time, amortised from first order.*

### 316L steel tear-away

| Component | 1,000 pcs | 5,000 pcs | 50,000 pcs |
|---|---|---|---|
| 316L hex disc (CNC at low vol / stamped at scale) | $7–14 | $4–8 | $1.50–4 |
| Laser engraving (6 fields, both faces) | $1.50–2.50 | $1–2 | $0.60–1.20 |
| Short chain + connector | $0.50–1 | $0.40–0.80 | $0.25–0.50 |
| **Tear-away subtotal** | **$9–17.50** | **$5.40–10.80** | **$2.35–5.70** |

*Stamping tooling at 50,000 pcs: ~$5,000–10,000 one-time.*

### Chain, packaging, final assembly

| Component | 1,000 pcs | 5,000 pcs | 50,000 pcs |
|---|---|---|---|
| Neck chain (60 cm ball chain + clasp) | $2–4 | $1.50–3 | $0.80–1.80 |
| Assembly + QC | $3–6 | $2–5 | $1–3 |
| **Chain + assembly subtotal** | **$5–10** | **$3.50–8** | **$1.80–4.80** |

### Total system cost

| Volume | Total per tag | vs current ring+core |
|---|---|---|
| 1,000 pcs | **$31.50–60.50** | −45 to −55% |
| 5,000 pcs | **$19.50–41.90** | −45 to −65% |
| 50,000 pcs | **$10.05–22.90** | −55 to −65% |

*Current ring+core design: $53–124 at 5,000 pcs (ADR-0055/0056 rev 1 estimate).*

### Procurement economics

At a 3–4× manufacturer-to-procurement markup typical for defence/medical hardware:

| Volume | Manufacturing | Procurement target |
|---|---|---|
| 5,000 pcs | $20–42 | $60–130/tag |
| 50,000 pcs | $10–23 | $30–70/tag |

Traditional dog tags cost $1–5. Commercial NFC wearables: $20–80. Hexa at 50,000 pcs
lands in the commercial NFC wearable range while delivering a certified secure element,
a partitioned data model, and a physically identical separation doctrine to existing
military ID.

## Open questions

1. ~~**Partitioned JCOP applet spec**~~ — resolved by ADR-0057 (access model and UUID
   persistence) and ADR-0061 (consumer Tier 1 / sovereign mode split).

2. **Tear-away engraving scope:** enrollment date is proposed; whether NATIONALITY or UNIT
   is the more useful routing field for the first deployment context (Försvarsmakten vs.
   humanitarian) should be resolved by OQ-1 (first customer).

3. ~~**Grommet Tag Locator consistency**~~ — resolved in the Sealed Manufacturing Unit section of this ADR: the enrollment sequence (6-step controlled transaction with readback verification) defines the procedure. All carriers are matched in one controlled transaction; a mismatch at step 5 voids the full set.

4. **Silicone surround tooling timing:** the injection mould lead time is 6–10 weeks.
   For the Phase A PoC, a 3D-printed or off-the-shelf silicone gasket should be identified
   as a temporary substitute. Prototype gate 1 (RF coupling) does not require the surround.
   The card laminate edge must include a 0.6–0.8 mm peripheral channel for mechanical
   retention of the silicone — this geometry must be in the card drawing before mould tooling
   is ordered.

5. **Single-piece vs two-piece body** *(resolved — not for pilot):* embedding the JCOP chip
   and antenna directly in the surround material (Option B) was evaluated by ID and EE review
   (2026-11-09). Both reviews recommend **two-piece (Option A)** for pilot through at least 50 k
   pcs. Injection-moulding temperatures (220–260°C) destroy NFC chip modules; the correct
   alternative (lamination at 130–160°C) is functionally identical to Option A. Option B collapses
   to Option A under the correct process. Consider Option B only for Gen 3 if field data shows
   delamination failure rates justify a monolithic body.

6. **Grommet RF verification:** a 316L stainless grommet acts as a conductive shorted ring at
   13.56 MHz (skin depth ~0.12 mm). EE review (2026-11-09) confirmed ≤9 mm OD is safe; above
   ~12–13 mm OD antenna aperture loss becomes significant. This must be verified empirically at
   PoC Gate 1: measure read range on a hex PCB with and without the 9 mm grommet in position.
   The antenna keep-out zone around the grommet hole must be explicit in the inlay drawing.

7. **Tear-away character height specification:** EE and ID reviews identified this is not yet
   specified. Minimum: 3 mm for NAME and Tag Locator; 2 mm for UNIT and enrollment date; on both faces.
   Must be in the manufacturing drawing before procurement.

8. **Card size** *(resolved 2026-11-09):* **54 mm across-corners.** The original 48 mm was
   chosen for US dog tag equivalence (51 × 29 mm, ~1,350 mm²), which is not a requirement
   in the Swedish deployment context (Försvarsmakten, MSB, blåljus). Nordic tags are larger.

   | | 48 mm AC | **54 mm AC ✓** | 60 mm AC |
   |---|---|---|---|
   | Face area | 1,497 mm² | **1,897 mm²** | 2,338 mm² |
   | 2-turn coil aperture (est.) | ~1,150 mm² | **~1,560 mm²** | ~2,000 mm² |
   | Grommet vertex margin (9 mm OD) | 1.5 mm | **4.5 mm** | 7.5 mm |
   | Character rows at 3 mm height | ~6 | **~8** | ~10 |

   54 mm improves all three constraints (RF coupling, engraving area, grommet clearance)
   meaningfully without the form-factor step of 60 mm. With surround the card is ~59 mm
   wide — worn under a t-shirt without bulk. Both elements (NFC card and tear-away) use
   54 mm AC.

   **EE review (2026-11-09):** confirmed. The ~36% aperture gain reduces required minimum
   field strength at 2 cm by ~27%, extending undetuned range by ~11%. Two turns still
   correct. Inductance L increases ~14% with the larger aperture; expected L ≈ 1.5–2.5 μH
   (design intent, to be confirmed by measurement). Expected tuning capacitor for 14.75 MHz
   resonance at L = 2 μH: C ≈ 58 pF (NPO/C0G, ±1%). Final tuning target confirmed after
   Gate 1 measurement with ferrite sheet installed (ADR-0065). Inlay drawing must specify
   a 10 mm OD antenna keep-out circle centred on the grommet bore.

   **ID review (2026-11-09):** confirmed. 8 engraving rows at 3 mm resolves OQ-7 (character
   height). Grommet structural risk at 1.5 mm vertex margin is gone at 4.5 mm. Surround
   mould tooling RFQ should be issued now that size is locked. ADR-0056 and manufacturing
   specs must update the antenna aperture reference from "flat hexagonal 2-turn coil, 48 mm
   aperture" to "~50–51 mm aperture" to match the 54 mm body.

9. **NFC power budget:** EE review (2026-11-09) identified V_oc ≈ 0.5 V using H_min = 1.5 A/m
   as a provisional design assumption (see H_min reference below).
   The derating calculation is documented here:

   **H_min reference (design assumption — pending coil classification):** field-strength requirements for PICCs are in ISO/IEC 14443-2 (RF power and signal interface) and depend on PICC antenna class, which is determined by the antenna coil geometry (ISO 14443-1 defines PICC antenna class zones). **Unverified design assumption:** 1.5 A/m is used as the H_min estimate in the power budget. To confirm this, classify the ~50 mm hex coil against the PICC antenna class zones in ISO 14443-1 and take the applicable H_min from ISO 14443-2 for that class. This is an antenna geometry determination, not a chip datasheet lookup — NXP cannot answer the class question. If the coil falls into a higher PICC class with a stricter H_min, the power budget must be recalculated. ADR-0065 measurement 11 (calibrated field generator) is optional — if equipment is available it provides useful data, but it is not a Gate 1 pass criterion.

   At resonance with matched load, chip terminal voltage ≈ Q × V_oc / 2.
   - Free air (Q = 20): V_chip ≈ 20 × 0.5 / 2 = **5.0 V** — well above chip minimum.
   - Worst-case derated (body loading 25% Q reduction × grommet 10% Q reduction):
     Q_min ≈ 20 × 0.75 × 0.90 = 13.5. V_chip ≈ 13.5 × 0.5 / 2 = **3.4 V** — positive margin.
   - Ferrite sheet increases effective L by ~5–10%, raising V_oc to ~0.52–0.55 V: margin widens slightly.

   Conclusion: **loaded Q 15–35 (chip attached) is the critical Gate 1 design target.** Q < 15 risks insufficient chip voltage; Q > 35 attenuates the 847 kHz load-modulation sidebands.
   **Q criterion (aligned with ADR-0065):** loaded Q 15–35 is a design target / diagnostic range, not a Gate 1 pass/fail criterion. ADR-0065 gates on activation range (measurements 4, 6, 8) and transaction completion (measurement 9). Measured Q is recorded and reported to the inlay vendor for tuning.
   The V_chip calculation above is a sanity estimate, not a
   closed budget — actual performance depends on coupling, loading, resonance, and chip power
   consumption in the assembled device. **Power budget status: provisionally estimated, pending
   Gate 1 confirmation.** The derating calculation establishes the design is not implausible; Gate 1
   measurement 3 (loaded Q) and measurement 8 (full config D read range) provide the empirical closure.

## Conflict with accepted ADRs

This proposal conflicts with ADR-0022 (ring-and-core form factor) and all physical design
ADRs that build on it. Per AGENTS.md rule 2, this ADR is **Proposed** pending a decision
to adopt the alternative. All referenced accepted ADRs remain in force until this ADR's
status changes to Accepted.

## Principle tests

**P1 (break-glass offline):** 316L tear-away survives structural fire with full 11-char Tag
Locator readable bare-eye — physical identification after electronics loss is preserved.
316L grommet carries a 6-char abbreviated locator (die-struck, ≥ 0.3 mm relief) for forensic
identification when the tear-away is absent; loupe required, not bare-eye field read.
Consumer Tier 1 access via ADR-0061 (unauthenticated in consumer mode); authenticated read
in sovereign mode. P1 attribution exception for consumer mode — see ADR-0061 Decision 1a.
⚠ (consumer); ✓ (sovereign)

**P2 (tag is a cache):** Separation doctrine preserved — one element stays, one goes.
Single JCOP card eliminates the synchronization failure mode of two data-carrying chips.
The physical cache is simpler and has fewer failure modes than the ring-and-core design. ✓

**P3 (only data that changes emergency action):** Identification fields (name, Tag Locator,
unit) on both physical elements; emergency medical data in the JCOP Tier 1 partition. The
tear-away carries identification only — no red-flag or medical data. Blood type excluded per
ADR-0014. Enrollment date added to signal data freshness — this is contextual, not treatment-
directing, and complies with the principle's "low harm if wrong" criterion. ✓
