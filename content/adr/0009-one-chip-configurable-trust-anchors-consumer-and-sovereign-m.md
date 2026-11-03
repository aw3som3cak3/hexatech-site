# ADR-0009: One chip, configurable trust anchors (consumer and sovereign modes)

- **Status:** Accepted
- **Date:** 2026-10-05
- **Principles:** P6, P10

## Context
Two markets: consumers (we operate root) and nations (own roots). Separate products double certification.

## Decision
Single hardware and applet set. Trust anchors set at personalisation; the applet can hold multiple anchors so a consumer tag can later accept a national CVCA.

## Consequences
One certification path. Consumer base can migrate into sovereign deployments without new hardware.

## Alternatives considered
Two product lines.
