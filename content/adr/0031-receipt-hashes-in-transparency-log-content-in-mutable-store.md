# ADR-0031: Receipt hashes in the transparency log; content in a mutable store

- **Status:** Accepted
- **Date:** 2026-10-31
- **Principles:** P7, P1, P5
- **Supersedes:** —
- **Amends:** ADR-0002, ADR-0005

## Context

ADR-0005 states that receipts are uploaded to the transparency log whenever either party syncs.
ADR-0002 states that no personal data goes on any immutable store.

A receipt contains at minimum: timestamp, terminal cert reference, a tag-side identifier, and
two signatures. Even with pairwise identifiers (ADR-0024), a receipt carries enough to
reconstruct a read event. An append-only Merkle log cannot satisfy a GDPR Art. 17 erasure
request: the leaf is permanent. The two ADRs therefore conflict unless the receipt format is
designed so that nothing erasable ever enters the log.

Designing receipts to contain zero correlatable data is possible but fragile — it constrains
every future field addition and is hard to audit. A structural fix is preferable.

## Decision

- The transparency log records **only the hash** of each receipt (one Merkle leaf = H(receipt)).
  No identifiers, timestamps, terminal references or signatures go into the log itself.
- Full receipt content is stored in an ordinary mutable store, subject to GDPR erasure.
- To verify a receipt: compute its hash and check it against the log leaf. A valid match proves
  the receipt was not altered after it was logged.
- To erase: delete the receipt content from the mutable store. The hash leaf remains in the log;
  the preimage is gone. Post-erasure the log proves *a read happened* but not by whom or of what.
  That is the correct post-erasure state.
- Attribution (P1) is intact while the receipt exists. After a lawful erasure, attribution is
  gone by design — the erasure is the accountability event.
- The tag-side copy of each receipt (ADR-0008, chip A) is unaffected: it is the owner's record,
  under owner control (P5), and is not subject to this ADR.

## Consequences

- GDPR Art. 17 erasure can be satisfied without touching the log.
- Tamper-evidence is preserved: deletion of a receipt is detectable (the leaf has no matching
  preimage), but the Merkle chain remains intact and auditable.
- Auditors who hold a receipt can verify it; auditors who encounter a post-erasure gap see only
  that a read occurred, with no content.
- The receipt format is no longer constrained by the requirement to contain zero personal data.
  It may include the terminal cert fingerprint, a tag session identifier and a timestamp.
- Operator accountability (proving Hexatech did not delete inconvenient reads from its own store)
  remains: the log proves how many reads were logged; gaps in the mutable store are visible.
- The hash is a stable identifier for any party holding the receipt preimage. An adversary who
  captured the receipt before erasure (or who reads the tag-side copy on chip A, which is not
  subject to this ADR) can correlate the log leaf with the receipt indefinitely. The GDPR
  Art. 17 claim covers controller-side erasure only: the operator's mutable store is erased,
  satisfying the controller's obligation. It does not make the hash non-correlatable to parties
  who independently hold the preimage.

## Alternatives considered

**Full receipts in the log** (current ADR-0005 implication): GDPR Art. 17 conflict; requires
receipts to contain nothing erasable, which is fragile and hard to enforce over time.

**No external log; tag-side receipts only**: acceptable for medical accountability (the tag
carries its own record), but loses operator-level tamper-evidence. May be revisited if
operational complexity of running a log outweighs the benefit.

**Mutable log with tombstone deletions**: deletion is recorded as a marker, hash chain stays
valid, content is removed. Weaker tamper-evidence than an immutable log (a rogue operator can
mark reads as deleted). More complex to implement and audit than the hash-only approach.
