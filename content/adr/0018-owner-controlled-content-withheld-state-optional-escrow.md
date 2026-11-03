# ADR-0018: Owner-controlled content, withheld state, optional escrow

- **Status:** Accepted
- **Date:** 2026-10-05
- **Principles:** P5, P4

## Context
Owners should control how much is stored, even if a nation provides the means.

## Decision
- Per-category, per-tier storage settings, down to zero.
- 'Withheld by owner' is an explicit state.
- Tier 2 escrow for break-glass is optional; app states plainly that without escrow nobody can read Tier 2 in an emergency.
- Sovereign mode may mandate a minimum dataset; owner controls everything above it.

## Consequences
Genuine consent and minimisation. Tag retains value at zero medical data (identity, casualty log).

## Alternatives considered
Mandatory full dataset (consent problem); silent empty fields (dangerous ambiguity).
