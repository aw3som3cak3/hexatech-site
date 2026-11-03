# ADR-0036: Consumer-mode chip identifier

- **Status:** Accepted
- **Date:** 2026-11-01
- **Principles:** P5, P9
- **Supersedes:** —
- **Amends:** ADR-0024

## Context

ADR-0024 specifies that the chip returns a pairwise identifier per tenant after terminal
authentication. ADR-0019 specifies that in consumer mode, Tier 1 is signed but not encrypted,
and there is no terminal authentication requirement for reading.

These two ADRs leave a gap: what identifier does the chip return in consumer mode, before any
terminal authentication takes place?

If the chip returns a fixed pseudonym in consumer mode, reads are linkable across terminals:
any NFC-capable device that scans the tag twice gets the same identifier and can correlate the
two events. This contradicts ADR-0024's privacy intent.

**Principle checks:**
- P5: Owner controls content. A per-session random identifier means the owner cannot be
  passively tracked without consent. Pass.
- P9: Consumer-mode Tier 1 read does not require user verification. A per-session random ID
  is compatible with an unconscious patient being scanned. Pass.

## Decision

In consumer mode, the chip returns a **per-session random identifier** (fresh random value on
each power cycle or field entry). No stable pseudonym is returned before terminal
authentication.

This means:
- Consumer-mode reads are unlinkable at the chip identifier layer across sessions.
- Attribution in consumer mode relies on: (a) the terminal cert in the receipt, if the reader
  authenticates; (b) the read counter on the chip, which is a monotonic sequence visible to
  any reader; (c) the tag-side receipt log (ADR-0008). The read counter does not identify the
  reader — it only proves that N reads have occurred.
- A reader that does not authenticate against the chip gets a random ID it cannot correlate
  with past or future reads. This is intentionally weaker attribution than sovereign mode.
- After terminal authentication in consumer mode (optional, for readers that do authenticate),
  the pairwise identifier scheme of ADR-0024 applies.

This is weaker attribution than sovereign mode. That is a deliberate trade: consumer mode
prioritises owner privacy; sovereign mode prioritises accountability. The deployment mode is
set at issuance.

## Consequences

- Passive scanning by non-medics (a person with a commodity NFC app in proximity) returns a
  random ID that is useless for tracking. The Tier 1 data is still readable in consumer mode
  (ADR-0019), but the identifier layer no longer aids correlation.
- The threat of passive opportunistic reads remains (see threat model). This ADR removes the
  identifier correlation vector; it does not encrypt the data.
- Readers that rely on a stable chip identifier for lookup (e.g. a hospital's patient matching
  system) must use the owner's account reference or the signed profile contents, not the chip
  identifier, in consumer mode.
- The read counter is still a weak correlation signal: two reads with adjacent counter values
  came from the same tag in sequence. This is unavoidable without encrypting the counter.

## Alternatives considered

**Fixed pseudonym in consumer mode:** Simple to implement; enables reader-side logging. But
any NFC device becomes a passive tracking tool. Rejected on privacy grounds (P5).

**No identifier in consumer mode:** Breaks any reader-side lookup or de-duplication logic.
A random per-session ID is a better compromise — useless for tracking but present for protocol
completeness.

**Per-session ID derived from a stable secret (HMAC-based):** Unlinkable to external observers
but linkable to the owner who holds the secret. Does not improve on a true random for the
threat model at hand, and adds key management complexity. Rejected.
