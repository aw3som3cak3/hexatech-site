# ADR-0020: Identity and signing require user verification; medical read does not

- **Status:** Accepted
- **Date:** 2026-10-05
- **Principles:** P9

## Context
Risk of coercing or misusing an unconscious person's tag.

## Decision
Medical read and casualty-log append work without owner verification. Identity, signing and authentication functions always require PIN and ideally biometric. Applets isolated by the JavaCard firewall; no shared keys.

## Consequences
Break-glass cannot become break-glass signing. Certification complexity (CC + FIDO) accepted.

## Alternatives considered
Shared unlock state across applets.
