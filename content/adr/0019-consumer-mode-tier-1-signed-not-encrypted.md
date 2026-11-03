# ADR-0019: Consumer-mode Tier 1 signed, not encrypted

- **Status:** Accepted
- **Date:** 2026-10-05
- **Principles:** P1

## Context
In consumer mode there is no medic PKI until agreements exist with each health service.

## Decision
Consumer Tier 1 contains only owner-chosen data, signed for integrity, readable by any NFC phone. Encryption value in consumer mode lives in Tier 2 and the log.

## Consequences
Honest positioning; avoids 'encrypted but unreadable when it matters'.

## Alternatives considered
Encrypt consumer Tier 1 (fails P1 without readers).
