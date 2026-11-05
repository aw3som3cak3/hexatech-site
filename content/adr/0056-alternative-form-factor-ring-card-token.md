# ADR-0056: Alternative physical form factor — NFC hex card + 316L steel tear-away

- **Status:** Proposed
- **Date:** 2026-11-04
- **Principles:** P1, P2, P3
- **Acceptance dependency:** ADR-0057 (chip access model, UUID persistence, auth verification) must be Accepted before this ADR can be accepted. The public partition specification below is amended by ADR-0057 Decision 1.
- **Would supersede (if accepted):** ADR-0022 (ring-and-core), ADR-0038 (Chip A ring-only),
  ADR-0040 (physical identification layer — separation doctrine changes),
  ADR-0041/0051/0055 (Ti Gr5 ring — ring eliminated),
  ADR-0048 (Ti shell + PEEK inner carrier), ADR-0049/0054 (UUID cylinder + break-off plate)
- **Preserves (unchanged if accepted):** ADR-0003 (secure element), ADR-0016 (IPS profile),
  ADR-0052 (validation gates — test criteria updated), all digital-layer ADRs 0001–0039

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
~48 mm across-corners (equivalent area to a standard US dog tag, 51 × 29 mm):

1. A plastic NFC card — electronics carrier, stays with the person
2. A 316L stainless steel tear-away — physical identity token, goes with the reporting chain

## Proposed design

### Element 1 — NFC hex card (stays with person)

- **Body:** PC/PETG laminate, 48 mm across-corners, 3.5 mm thick, chamfered edges
- **Electronics:** single JCOP secure element (NXP SE050 or Infineon SECORA) with
  two logical partitions:
  - **Public partition** (unauthenticated read): random session identifier only — see ADR-0057 Decision 1 for the amended policy (original: SURNAME, UUID, red-flag line — not adopted; conflicts with ADR-0024)
  - **Protected partition** (authenticated read): full Tier 1 medical profile per ADR-0016
- **Antenna:** flat hexagonal 2-turn coil wound inside the laminate body; 48 mm aperture
  provides read range ≥ 2 cm (ADR-0052 Gate 1 criterion)
- **Face engraving:** SURNAME / GIVEN NAME / UUID (8+8) / UNIT — laser marked or
  hot-embossed; not fire-survivable but provides quick visual read without scanning
- **Surround:** silicone hex edge gasket (modified dog-tag silencer form), ~1.8 mm wall,
  partial face flange — edge protection, skin comfort, mild weather seal
- **Chain hole:** at the top (+Y) vertex; fitted with a 316L stainless flange grommet

#### 316L stainless flange grommet (UUID carrier — fire-survival layer)

The grommet is pressed into the card's chain hole and serves two independent functions:

1. **Mechanical:** the chain passes through the steel bore, never touching the plastic card.
   This eliminates wear-through of the card at the chain hole — the most common failure
   mode for thin cards on metal chains.

2. **Physical identification fallback:** when the plastic card burns in a structural fire,
   the grommet remains on the chain. UUID engraved on the flange face is the fire-survival
   identifier — equivalent in function to the UUID cylinder in the previous design
   (ADR-0049/0054), but integrated directly into the card rather than being a separate element.

Grommet specification: 316L stainless, double-flange, ~8 mm flange OD, 3.5 mm bore,
UUID laser-engraved on front flange face.

### Element 2 — 316L steel tear-away (goes with reporting chain)

The tear-away matches US dog-tag short-chain doctrine exactly: on a short chain attached
to the main neck chain, easily separated by the first responder who encounters the person.

- **Body:** 316L stainless steel, 48 mm across-corners (matches card outer size), 2.5 mm thick
- **No NFC chip** — the reporting chain does not need to scan; they need to record an
  identity and look it up in the casualty log system when connectivity is available
- **Engraved fields (both faces):**

| Field | Rationale |
|---|---|
| SURNAME | Offline identification without lookup |
| GIVEN NAME + INITIAL | Disambiguation |
| UUID (8+8) | Digital link — lookup key for casualty log |
| UNIT / NATIONALITY | Routing the report; jurisdiction for remains processing |
| Enrollment date | Age of the data; prompts re-enrollment if stale |

- **Chain hole:** at top vertex, chamfered bore (no grommet needed — solid steel)
- **Fire survival:** 316L melts at 1,375–1,400 °C; full identity fields survive structural fire

### Why no NFC on the tear-away

Adding NFC to the tear-away would require keeping two chips with medical data
synchronized. In practice:

- Profile changes (new medication, change of unit, medical update) require updating both
  chips at the same time
- In the field, re-enrollment infrastructure may update only one chip
- The two chips diverge; it becomes unclear which is current
- Two-chip synchronization failures would occur faster than hardware wear-out

The reporting chain's actual need is a UUID they can enter into the casualty log system.
The UUID is on the engraved face. No chip is required.

This is consistent with ADR-0027 (identity broker — pointers, not copies): the physical
token holds a pointer (UUID); the network holds the data.

### Why no separate Ti ring

The Ti Gr5 ring in the previous alternative (ADR-0056 rev 1) provided fire-survivable
physical identification. In this design, that function is served by:

1. The 316L steel grommet on the card (UUID, always on chain)
2. The 316L steel tear-away (full identity fields, may have been taken but typically present)

Both elements are fire-survivable at structural fire temperatures. The Ti ring added cost
(it was the most expensive element at $20–40) and introduced a third element to the system.
Two elements with both carrying fire-survivable identifiers satisfies the requirement without
the ring.

## Separation doctrine

| Element | Goes with | Chain type | Action |
|---|---|---|---|
| NFC card + silicone surround | Casualty (stays on body) | Standard neck chain | Stays |
| 316L tear-away | Reporting chain | Short chain (attached to main) | Pull off |

After separation:
- Treating medic reads NFC card for full medical profile (authenticated) or red-flag line (unauthenticated)
- Reporting chain records UUID from tear-away engraving or enters into casualty log
- If casualty is KIA and card has burned: grommet on chain gives UUID for identification
- If tear-away was taken before fire: grommet UUID is the remaining identifier

## Cost estimate

Asia-Pacific precision manufacturer. Card lamination and die-cutting from NFC card
specialist; steel tear-away from precision machining shop.

### NFC hex card system (card body + grommet + silicone surround)

| Component | 1,000 pcs | 5,000 pcs | 50,000 pcs |
|---|---|---|---|
| Hex laminate body (PC/PETG, die-cut) | $4–8 | $2–5 | $1–2.50 |
| JCOP secure element | $5–10 | $3–7 | $2–4 |
| Hex antenna coil (wound, bonded in laminate) | $3–5 | $2–4 | $1–2 |
| Card face engraving / hot-emboss | $1–2 | $0.80–1.50 | $0.50–1 |
| Silicone hex surround (injection mould + part) | $1–2 | $0.50–1 | $0.20–0.50 |
| 316L grommet (turned, UUID engraved) | $3–5 | $2–4 | $1–2 |
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

1. **Partitioned JCOP applet spec:** the public/protected partition boundary must be
   formally specified. What exactly does an unauthenticated scan return? This amends
   ADR-0038 and needs its own ADR before the prototype is built.

2. **Tear-away engraving scope:** enrollment date is proposed; whether NATIONALITY or UNIT
   is the more useful routing field for the first deployment context (Försvarsmakten vs.
   humanitarian) should be resolved by OQ-1 (first customer).

3. **Grommet UUID consistency:** the UUID on the grommet and on the card face must be
   generated from the same enrollment event and must match the JCOP chip UUID. The
   enrollment system must write all three in a single transaction. Procedure not yet defined.

4. **Silicone surround tooling timing:** the injection mould lead time is 6–10 weeks.
   For the Phase A PoC, a 3D-printed or off-the-shelf silicone gasket should be identified
   as a temporary substitute. Prototype gate 1 (RF coupling) does not require the surround.

## Conflict with accepted ADRs

This proposal conflicts with ADR-0022 (ring-and-core form factor) and all physical design
ADRs that build on it. Per AGENTS.md rule 2, this ADR is **Proposed** pending a decision
to adopt the alternative. All referenced accepted ADRs remain in force until this ADR's
status changes to Accepted.

## Principle tests

**P1 (break-glass offline):** 316L grommet survives structural fire with UUID readable —
physical identification after electronics loss is preserved. Public partition on JCOP card
provides emergency red-flag read without authentication credentials. ✓

**P2 (tag is a cache):** Separation doctrine preserved — one element stays, one goes.
Single JCOP card eliminates the synchronization failure mode of two data-carrying chips.
The physical cache is simpler and has fewer failure modes than the ring-and-core design. ✓

**P3 (only data that changes emergency action):** Identification fields (name, UUID, unit)
and emergency red-flag line preserved on both elements. Blood type excluded per ADR-0014.
Enrollment date added to signal data freshness — this is contextual, not treatment-directing,
and complies with the principle's "low harm if wrong" criterion. ✓
