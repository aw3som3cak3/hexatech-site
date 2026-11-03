# ADR-0013: Attestation formats: ISO mdoc and SD-JWT VC

- **Status:** Accepted
- **Date:** 2026-10-05
- **Principles:** P10

## Context
Need interoperable, NFC-friendly, selective-disclosure credential formats.

## Decision
Store attestations as ISO 18013-5 mdoc (CBOR, NFC-native) or SD-JWT VC — the EUDI Wallet formats.

## Consequences
National PIDs, EU certificates and mobile driving licences can be carried without bespoke formats. CBOR aligns with emergency profile encoding.

## Alternatives considered
Custom format; W3C VC JSON-LD only.
