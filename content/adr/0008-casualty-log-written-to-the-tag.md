# ADR-0008: Casualty log written to the tag

- **Status:** Accepted (amended by ADR-0037)
- **Date:** 2026-10-05
- **Principles:** P1, P8

## Context
Paper casualty cards get lost between point of injury and hospital.

## Decision
Medics append signed events (intervention, drug, dose, time, triage category as entered) to an append-only log on the chip, countersigned by the chip.

## Consequences
Record travels with the body. Strong differentiator over phone Medical ID and central EHRs. Recording only, no computation (P8).

## Alternatives considered
Phone-side only logging (separated from patient).
