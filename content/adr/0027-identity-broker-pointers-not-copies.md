# ADR-0027: Back end as identity broker: pointers, not copies

- **Status:** Accepted (amends ADR-0002, 0006)
- **Date:** 2026-10-05
- **Principles:** P5, P6, P7

## Context
Partner design: the back end connects tags to existing registers and fetches only what a task needs. Earlier ADRs assumed Hexatech-held encrypted Tier 2 storage.

## Decision
- Tier 2 data stays in source registers (military, national, partner). The broker holds pointers, pairwise ID mappings, policy, keys and receipts.
- Separate tenants (military, civil defence, humanitarian, consumer) with separate keys and hosting; tenants never mix.
- Access policy runs in an attested TEE (ADR-0006); keys in HSMs per tenant, nation-owned in sovereign deployments.
- Consumer mode may still offer wearer-escrowed encrypted storage where no source register exists.

## Consequences
Less data held = less to leak or be compelled to produce (ADR-0028). Integration work moves to register connections and agreements.

## Alternatives considered
Central health-data warehouse (rejected: risk, regulation, trust).
