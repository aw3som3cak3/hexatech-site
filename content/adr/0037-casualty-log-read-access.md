# ADR-0037: Casualty log read access

- **Status:** Accepted
- **Date:** 2026-11-01
- **Principles:** P1, P5, P9
- **Supersedes:** —
- **Amends:** ADR-0008

## Context

ADR-0008 defines that medics append signed events to an append-only log on the chip. It
specifies write access (any authenticated reader can append) but is silent on read access.

The casualty log contains operationally sensitive data: intervention timestamps, drug and dose
records, triage categories, terminal cert fingerprints identifying which reader performed each
action. This is more sensitive than the static Tier 1 profile because it reveals the patient's
care trajectory and the identities of treating personnel.

Without a defined read access rule, any NFC-capable device that can reach the chip can
read the full casualty log — including the terminal cert fingerprints of every previous reader.

**Principle checks:**
- P1: An authorised medic must be able to read the casualty log offline to understand prior
  care. The read access rule must not require network connectivity. Pass.
- P5: The owner controls their data. The casualty log is written by medics, not the owner, but
  the owner's tag holds it. Read access must be bounded. Pass.
- P9: Casualty log read (like Tier 1 read) must be possible on an unconscious patient. It must
  not require owner verification. Pass.

## Decision

**Casualty log read access requires the same terminal authentication as Tier 1 read.**

- A reader without a valid terminal cert sees only the log entry count (for the read counter
  display) and nothing else. No entry content, no terminal cert fingerprints.
- A reader with a valid terminal cert reads the full log.
- In consumer mode this means: any reader with a valid consumer-mode terminal cert. The bar is
  the same as Tier 1 consumer-mode read.
- In sovereign mode, nations may restrict log read to specific Document Verifier roles (e.g. a
  "medical records" DV scope distinct from a "field read" DV scope). This is a deployment
  configuration, not a protocol-level restriction. A future ADR may define standard DV scopes.

The log remains append-only. No reader (including a privileged one) can delete or modify
existing entries.

## Consequences

- A commodity NFC scanner without a terminal cert cannot read casualty log contents. This
  closes the passive-read attack surface on log data.
- Terminal cert fingerprints in the log are protected to the same level as the log entries
  themselves. They are visible only to authenticated readers.
- The read access rule is symmetric with Tier 1: the same authentication that unlocks the
  profile unlocks the log. This simplifies the medic app — one authentication step serves both.
- Sovereign deployments that want finer-grained control (e.g. only a mortuary team reads the
  death declaration entries; field medics read the treatment log) can implement this via DV
  scope restrictions at their CVCA. The protocol supports it; the mechanism is deployment-
  defined.

## Alternatives considered

**Open log read (no auth required):** Simplest for medics in extremis. But exposes treatment
history and reader identities to passive scanning. Not consistent with P5.

**Separate log-reader cert scope for all deployments:** Increases cert management complexity
without clear benefit in consumer or basic sovereign mode. Deferred to a future ADR if
sovereign deployments require it.

**Owner-only log read:** Would prevent medics from reading prior treatment history — the
primary use case. Rejected.
