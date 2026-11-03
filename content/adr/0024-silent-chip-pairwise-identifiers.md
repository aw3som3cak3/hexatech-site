# ADR-0024: Silent chip and pairwise identifiers

- **Status:** Accepted (amended by ADR-0036)
- **Date:** 2026-10-05
- **Principles:** P9, P10; refines ADR-0003, 0012

## Context
Partner v0.1 had a pseudonymous ID on the chip readable by anyone. A fixed ID readable by any antenna is a tracking beacon.

## Decision
The chip returns nothing identifying before terminal authentication (random ISO 14443 UID). After authentication it reveals a **pairwise identifier per tenant**; the broker maps it. Hospital and door readers never see the same identifier.

## Consequences
No passive tracking; cross-tenant correlation only via the broker, under policy and logged.

## Alternatives considered
Static pseudonymous ID (trackable); no ID at all (breaks hospital lookup).
