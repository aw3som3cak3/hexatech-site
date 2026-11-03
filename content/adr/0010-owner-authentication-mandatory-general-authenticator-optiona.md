# ADR-0010: Owner authentication mandatory; general authenticator optional

- **Status:** Accepted
- **Date:** 2026-10-05
- **Principles:** P2, P5, P9

## Context
Earlier position made FIDO2 an optional applet. Owners must authenticate to update data, manage consent, view access logs and report loss — without it freshness is unsolvable.

## Decision
Owner authentication (FIDO2, PIN entered on phone) is always present. Using the tag as a general-purpose authenticator for third-party services or as national e-ID is enabled per deployment.

## Consequences
Daily-carry incentive in consumer mode. Nations can disable function creep. Same applet; difference is policy.

## Alternatives considered
FIDO2 fully optional (breaks update path).
