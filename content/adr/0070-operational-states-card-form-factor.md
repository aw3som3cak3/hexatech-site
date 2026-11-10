# ADR-0070: Operational states — card form factor

- **Status:** Accepted
- **Date:** 2026-11-10
- **Principles:** P1, P2
- **Depends on:** ADR-0056, ADR-0063
- **Resolves:** OQ-25 (three operational states not formally specified — card form factor)

## Context

OQ-25 noted that the tag has three distinct operational states that were not formally defined for the card form factor. This ADR defines them and specifies the design requirements that follow from each.

## Decision

The card form factor has three operational states:

### State 1 — Intact

Both elements (NFC card + 316L tear-away) are present on the chain. The service member is alive or status is unknown.

**Available:**
- NFC Tier 1 and Tier 2 reads (via medic reader app, authenticated)
- Casualty log append
- Full physical ID (tear-away face engraving + grommet locator)

**Medic action:** tap the NFC card front face (NFC icon side) with the reader app. Move tear-away aside if stacked in front.

### State 2 — Separated

The tear-away has been deliberately removed. The NFC card remains on the chain on the service member. The tear-away is with the reporting party (medic bag, casualty collection point).

**This state indicates KIA** per ADR-0063 and the death confirmation doctrine.

**Available on tag (NFC card):**
- NFC Tier 1 and Tier 2 reads remain fully functional — the card's NFC function is not affected by tear-away removal
- Casualty log and death confirmation state persist on chip
- Grommet locator on card grommet (abbreviated 6-char locator)

**Available on tear-away:**
- Full 11-character Tag Locator on tear-away face
- Physical ID (service member information engraved on tear-away face)

**Medic action:** death confirmation in app (ADR-0063 decision 2). Tear-away handed to reporting chain.

### State 3 — Electronic failure

The NFC card body is destroyed (fire, blast, crush). The grommet may remain on the chain (if fire — 316L survives). The tear-away remains functional (316L does not burn at structural fire temperatures).

**Available:**
- Grommet on chain: 6-character abbreviated locator (loupe-readable, die-struck 316L)
- Tear-away (if retained by reporting party or recovered): full 11-character Tag Locator + physical ID
- No NFC reads possible

**Medic action:** radio the 6-character grommet locator to reporting chain. Retrieve full locator from tear-away if present. Standard STANAG physical identification procedures for the remaining physical elements.

---

## Principle tests

**P1 (break-glass offline):** all three states have a physical identification path. Electronic failure degrades gracefully to the physical layer without requiring any network or app. ✓

**P2 (tag is cache):** the chip holds a copy of data that exists in the backend. Physical destruction of the chip does not destroy the person's record — the enrollment registry holds the Enrollment ID and profile. Reissue restores full NFC function. ✓
