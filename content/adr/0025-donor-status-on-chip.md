# ADR-0025: Donor status on chip only, signed and expiring

- **Status:** Proposed
- **Date:** 2026-10-05
- **Principles:** P3

**Note (2026-11-09):** Reverted to Proposed — the ADR's own criteria require customer validation before acceptance. No validation has been recorded.

## Context
Partner v0.1 engraved DONOR and added a tactile donor ridge for walking-blood-bank donors. Donor screening goes out of date; a permanent mark cannot.

## Decision
Donor status is a signed attestation on chip A with an issue date and expiry, from the blood service register. No engraved or tactile donor mark. The ridge pocket becomes an option pocket.

## Consequences
Stale donor marks avoided. **Open:** military medical services may expect a physical mark for speed; validate with a customer before accepting.

## Alternatives considered
Engraved/tactile donor mark (goes stale, medium harm if wrong).
