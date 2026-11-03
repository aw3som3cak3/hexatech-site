# ADR-0002: No personal data on blockchain; transparency log for audit

- **Status:** Accepted (amended by ADR-0027, 0028, 0031)
- **Date:** 2026-10-05
- **Principles:** P7, P1

## Context
Initial concept stored encrypted medical data on a blockchain. No mutually distrusting parties need shared state; data would be permanent.

## Decision
No personal data on any immutable ledger. Data is stored encrypted in ordinary storage with keys in HSMs. Access events go to an append-only Merkle **transparency log** (Certificate Transparency style) that owners and auditors can verify.

## Consequences
GDPR erasure is possible. Tamper-evidence retained without permanence of data. Removes a buzzword from the pitch; replace with 'verifiable access log'.

## Alternatives considered
Encrypted on-chain storage (harvest-now-decrypt-later, Art. 17 conflict); private blockchain (operational cost with no trust benefit over a log).
