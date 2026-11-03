# ADR-0012: Identity = account + attestations; national ID as recovery anchor

- **Status:** Accepted
- **Date:** 2026-10-05
- **Principles:** P2, P6

## Context
User proposal: token registers to a global account first; national ID linked later.

## Decision
- Registering a token creates a pseudonymous **account with keys** (low assurance).
- Identity is a bundle of **issuer-signed attestations** with assurance levels (e.g. 'verified via BankID', 'clinician-signed vaccinations', 'self-asserted allergy').
- Token is one authenticator. Loss → new token → re-verify via national ID (or trusted org/contacts at lower assurance) → rebind.
- Pairwise identifiers per relying party; selective disclosure.

## Consequences
Works globally from day one. 'Primary' identity becomes deployment policy. We route attestations rather than vouch (P6). Check BankID relying-party terms.

## Alternatives considered
National ID as mandatory primary (excludes most of the world).
