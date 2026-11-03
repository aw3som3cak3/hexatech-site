# ADR-0007: Smartphone app as medic reader

- **Status:** Accepted
- **Date:** 2026-10-05
- **Principles:** P1, P9

## Context
Lesson from Ukraine: medics carry phones, not specialised readers.

## Decision
- Terminal keys generated in Secure Enclave / StrongBox, non-exportable, biometric-gated.
- App works fully offline in airplane mode (RF silence).
- Receipts and casualty-log entries queue locally and store-and-forward on connectivity.
- iOS: declare chip AIDs for Core NFC ISO 7816.

## Consequences
Ubiquitous readers. Phones are capturable, so short cert lifetimes and caps (ADR-0004/0005) are load-bearing. Platform dependency on Apple/Google accepted because the chip enforces policy.

## Alternatives considered
Dedicated readers (absent when needed, costly).
