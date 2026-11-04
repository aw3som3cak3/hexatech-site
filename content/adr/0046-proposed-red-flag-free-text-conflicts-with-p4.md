# ADR-0046: RED_FLAG as bounded free-text advisory — P4 amended

- **Status:** Accepted
- **Date:** 2026-11-04
- **Principles:** P3, P4, P8, P10
- **Amends:** P4 (adds a single bounded free-text advisory exception)

## Context

P4 (the emergency format is semantically quiet) has an explicit test:

> Is there any free text in Tier 1? (Must be no.)

ADR-0038 (chip A ring-only profile) introduces a `RED_FLAG` field defined as:

> the owner's free-text red-flag line (same field as Tier 1 `RED_FLAG`), signed by the same
> clinician or self-asserted key as the full Tier 1 envelope.

The red-flag field is free text. It appears in both the ring-only Chip A profile and the
Tier 1 profile on Chip B. ADR-0038 provides a rationale for the exception but does not formally
amend P4. P4's test therefore fails against the accepted decision in ADR-0038.

**The clinical concern (raised in external architectural review):**

The example values given in ADR-0038 — "NO MORPHINE", "NO PENICILLIN" — are not merely
descriptive facts. They are actionable instructions that can directly affect treatment. A stale
or incorrect instruction to withhold a medication can itself cause harm. This is a qualitatively
different risk from a coded field that might be misclassified: free text from an arbitrary
source has no provenance, no verification date, and no constraints on what it can say.

The reviewer's precise concern: *"A perfectly signed medical statement can be stale, incomplete,
incorrectly mapped or simply wrong."* Cryptographic integrity does not imply clinical correctness.

**Why this was not flagged when ADR-0038 was written:**

ADR-0038 acknowledges the tension implicitly ("the risk of a stale or incorrect red-flag field
is lower because it is a text prompt to a trained responder, not a direct treatment instruction")
but treats this as a resolved trade-off rather than a principle conflict requiring a P4 amendment.
The correct process is to amend the principle explicitly or to bring the data model into
conformance.

## Decision

**Option A is adopted. P4 is amended to allow a single bounded free-text advisory field.**

### Option A — Amend P4 to allow a single free-text advisory field

Revise P4 to permit one bounded free-text field in Tier 1 and the ring-only profile, subject to:
- Maximum 80 characters
- Labelled explicitly as "advisory / self-asserted" in the display layer
- Signed with provenance (key, date, assertion type)
- Not processed, filtered or acted on by the system (P8 satisfied — displayed as entered)

**Argument for:** a trained medic reading "NO MORPHINE" under stress in the field benefits from
a human-readable prompt even if it is imprecise. Coded systems can fail to capture the specific
concern the owner or clinician intended. The free text is a prompt, not a prescription.

**Argument against:** the reviewer is correct that "NO MORPHINE" is actionable, not merely
descriptive. Field medics may act on it without verification. If the text is stale, wrong or
forged, the harm is direct. P4 was written to prevent exactly this.

### Option B — Make RED_FLAG a coded field

Replace the free-text `RED_FLAG` with a structured coded entry:

```
RED_FLAG = [
  {
    code:      <SNOMED CT clinical finding code | ATC medication code>,
    flag_type: "CAUTION" | "WITHHOLD" | "KNOWN_ALLERGY" | "ANAPHYLAXIS",
    source:    <issuer key identifier>,
    date:      <ISO 8601 date>,
    verified:  true | false
  },
  …  // multiple entries allowed
]
```

This satisfies P4 (coded from a closed list), P10 (SNOMED CT and ATC are P10-listed standards),
and addresses the clinical concern by requiring provenance (source, date, verification state).

**Argument for:** removes the P4 conflict entirely. Adds provenance that free text cannot
provide. A coder list of "WITHHOLD: morphine (ATC N02AA01, verified 2026-10-01, source: GP key
#xyz)" is more actionable and more auditable than "NO MORPHINE".

**Argument against:** coding every clinically relevant restriction requires SNOMED CT / ATC
expertise at enrollment time. Many field-enrolled tags will be self-asserted by the owner
without clinical oversight. A person who knows they react badly to penicillin may not know the
ATC code for it. A hybrid (coded when available, free text with an explicit "unverified" flag
otherwise) may be the practical middle ground.

## Resolved

P4 is amended: the `RED_FLAG` field (maximum 80 characters, signed with key and date, labelled
"advisory / self-asserted" in all display contexts) is permitted as a single exception. No
other free-text field is permitted in Tier 1 or the ring-only profile. Option B (coded field)
remains a valid future migration path if clinical certification requirements change.

## Alternatives considered

**Keep ADR-0038 as-is without amending P4:** not acceptable. An accepted ADR that fails a
principle test without an explicit amendment creates false confidence in the architecture's
internal consistency.

**Remove the red-flag field entirely:** satisfies P4 but fails P1 — a medic finding a ring
without its core has no actionable emergency data at all. Rejected.
