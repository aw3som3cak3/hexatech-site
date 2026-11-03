# ADR-0005: Offline risk caps and attributable reads

- **Status:** Accepted (amended by ADR-0031)
- **Date:** 2026-10-05
- **Principles:** P1

## Context
Offline readers will be stolen and keys will leak. Pattern borrowed from offline CBDC wallets (eCurrency/Riksbank work).

## Decision
- Chip enforces caps: max reads per terminal cert; max break-glass reads before degraded mode.
- Every read is mutually signed (reader signs challenge, chip signs response with monotonic counter). Both sides store the receipt.
- Receipts are uploaded to the transparency log whenever either side syncs.

## Consequences
Leakage from a compromised reader is bounded and attributable. Data disclosure cannot be clawed back (unlike money), so deterrence relies on attribution plus legal consequence.

## Alternatives considered
Prevention-only (impossible offline); no caps (unbounded leakage).
