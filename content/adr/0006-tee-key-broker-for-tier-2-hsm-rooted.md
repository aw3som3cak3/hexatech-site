# ADR-0006: TEE key broker for Tier 2, HSM-rooted

- **Status:** Accepted (amended by ADR-0027)
- **Date:** 2026-10-05
- **Principles:** P1, P6

## Context
Tier 2 needs policy-controlled release that even the operator cannot quietly bypass. IMY sandbox report IMY-2026-5444 (2026-03-30) is positive on TEEs with remote attestation.

## Decision
Tier 2 keys are released by policy code running in an attested enclave (RFC 9334), requiring an authenticated reader and patient-presence proof from the tag. Every release is logged. Root keys live in HSMs. In sovereign mode, national HSMs are the root of trust; TEE is defence in depth.

## Consequences
Operator cannot read records outside policy. Dependence on CPU vendor attestation (Intel/AMD) and side-channel risk acknowledged.

## Alternatives considered
Plain server-side decryption (operator trust); TEE as sole root in sovereign mode (sovereignty objection).
