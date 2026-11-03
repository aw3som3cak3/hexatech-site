# ADR-0003: Secure element on short-range NFC

- **Status:** Accepted
- **Date:** 2026-10-05
- **Principles:** P1, P10

## Context
Plain RFID cannot enforce policy. Long-range tags are tracking beacons, especially for soldiers.

## Decision
JavaCard / eID-class secure element, passively powered over ISO 14443 NFC (centimetre range). No UHF. Random UID per session; no response before terminal authentication beyond a minimal select.

## Consequences
Battery-less, durable, policy-enforcing. Requires NFC-capable readers (phones qualify).

## Alternatives considered
UHF RFID (trackable at distance); active/battery tags (failure-prone, emitting).
