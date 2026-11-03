# ADR-0004: EAC-style PKI with national roots and short-lived reader certificates

- **Status:** Accepted (amended by ADR-0033)
- **Date:** 2026-10-05
- **Principles:** P6, P1, P10

## Context
Medics must be authorised offline; nations want control of citizens' roots; allies must interoperate; chips have no clock.

## Decision
Copy ICAO Extended Access Control:
- Each root operator runs a **CVCA** (offline HSM, M-of-N custodians, scripted audited ceremonies, geographically split backups incl. abroad, pre-planned exile ceremony).
- CVCA issues **Document Verifier** certificates to its own and, by agreement, allied medical services.
- DVs issue **short-lived terminal certificates** (hours–days) to readers.
- Chip tracks latest seen date to reject expired certs. **Link certificates** for root rollover without recall.

## Consequences
NATO interoperability by issuing/withholding DV certs. Revocation by expiry rather than CRLs. Ceremony overhead is real and must be budgeted.

## Alternatives considered
Single vendor root (unacceptable to states); online-only authorisation (fails P1).
