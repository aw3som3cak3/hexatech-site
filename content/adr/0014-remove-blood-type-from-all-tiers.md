# ADR-0014: Remove blood type from all tiers

- **Status:** Accepted
- **Date:** 2026-10-05
- **Principles:** P3

## Context
Swedish identity tags state 'do not print blood type'. Wrong blood type risks fatal ABO-incompatible transfusion; emergency transfusion uses universal donor blood and type-specific blood is cross-matched anyway.

## Decision
Blood type is excluded from Tier 0 and Tier 1. Amends ADR-0001.

## Consequences
Removes a high-harm, zero-benefit field. Expect users and buyers to ask for it; this ADR is the answer.

## Alternatives considered
Keep with disclaimer (people act on it regardless).
