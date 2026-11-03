# ADR-0017: Intended purpose: store, communicate, display only

- **Status:** Accepted
- **Date:** 2026-10-05
- **Principles:** P8

## Context
EU MDR classification depends on intended purpose. MDCG 2019-11: storage/communication/display without medical-purpose modification is not a medical device.

## Decision
Core product does not compute clinical warnings, triage categories, interaction checks or derived flags. Red flags are set by people. Intended-purpose statement written early; marketing must match. Decision support, if ever, is a separate certified module.

## Consequences
Avoids MDR in the core. GDPR Art. 9, EHDS EHR-system requirements and security certification still apply. Confirm with regulatory counsel.

## Alternatives considered
Ship decision support (class IIa+ software).
