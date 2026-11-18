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
UHF RFID (trackable at distance); active/battery tags (failure-prone, emitting); contact-based flash cards (see Prior art below).

## Prior art

- [US Army Personal Information Carrier (PIC) programme, 1996–2017](../references/us-army-digital-dog-tag-history.md) — the US Army spent ~20 years and $34M+ attempting to field a digital dog tag, reaching ~13,500 troops in Iraq/Afghanistan by 2006. The programme died by attrition without a formal cancellation. The stated cause of failure at every stage: devices could not survive the combat zone. The structural cause: contact-based flash card design — physical insertion into a reader port. Ports fill with sand; connectors corrode. Passive NFC (no ports, no contacts, tap at 2–4 cm) directly addresses this failure mode. The US never built a contactless version; Hexa does.

- [IDF Digital Casualty Card System, 2023–24](../references/dccs-idf-2026.md) — the IDF arrived at the same requirement independently, tried QR codes (failed: alignment) and device-to-device NFC (failed: active pairing), then placed a passive NFC chip on the casualty's dog tag. It worked: point-of-injury documentation improved from 11% to 39% (3.5×) in active operations. Combined with the US Army evidence: the failure mode is architecturally specific (contact-based), and the solution is architecturally specific (passive NFC). Both sides of the equation are now evidenced from independent operational programmes.
