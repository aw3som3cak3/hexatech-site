# ADR-0001: Tiered data model

- **Status:** Accepted (amended by ADR-0014)
- **Date:** 2026-10-05
- **Principles:** P1, P3, P5

## Context
Emergency access must work without power, network or specialised equipment, while fuller records need stronger controls.

## Decision
Three tiers:
- **Tier 0 — engraved:** identity and a single critical-allergy flag. Works with no technology. *(Originally included blood type; removed by ADR-0014.)*
- **Tier 1 — on chip, offline:** coded emergency summary (see emergency profile), readable by authenticated readers without network.
- **Tier 2 — online:** fuller record, released via the TEE key broker (ADR-0006).

## Consequences
Graceful degradation from full tech to none. Tier 1 size is bounded by chip memory, which enforces discipline.

## Alternatives considered
Single encrypted blob (fails offline/unpowered); phone-only Medical ID (fails when phone is lost, locked or dead).
