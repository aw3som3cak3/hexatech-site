# ADR-0073: Death state machine amendment — RETRACT_DECLARATION while PENDING

- **Status:** Proposed
- **Date:** 2026-11-18
- **Principles:** P1, P9
- **Amends:** ADR-0063 §6 (Decision 2 — state machine)
- **Caused by:** ADR-0071 (casualty log entry format — entry type 0x0C RETRACT_DECLARATION)

## Context

ADR-0063 defines the death confirmation state machine as a one-way sequence:

```
ALIVE → DECEASED_PENDING → DECEASED_CONFIRMED
```

There is no path back from DECEASED_PENDING. If a medic incorrectly marks a casualty as expected dead — by triage error, misidentification, or changed clinical status (a T4 Expectant casualty who is subsequently re-triaged and recovers) — the PENDING state cannot be cleared. The tag remains marked pending-dead until a second medic countersigns, at which point the declaration becomes irrevocable.

This creates a patient safety risk: a re-triaged casualty who recovers carries a tag that claims they are (pending) deceased. Downstream clinicians reading the tag without context may act on stale information.

ADR-0071 adds entry type 0x0C RETRACT_DECLARATION to the casualty log. This ADR formally amends ADR-0063 Decision 2 to add the DECEASED_PENDING → ALIVE transition enabled by that entry type.

## Decision

Add one transition to the ADR-0063 state machine:

**DECEASED_PENDING → ALIVE** via RETRACT_DECLARATION (ADR-0071 entry type 0x0C).

The amended state machine:

```
ALIVE
  → DECEASED_PENDING  (via 0x09 DEATH_DECLARATION, medic role)
      → ALIVE          (via 0x0C RETRACT_DECLARATION, declarer or medical officer — this amendment)
      → DECEASED_CONFIRMED  (via 0x0A COUNTERSIGN_DEATH, different medic — irrevocable)
```

**Authorisation for RETRACT_DECLARATION:** (a) the original declarer — the terminal cert's `subject_hash` must match the `subject_hash` on the DEATH_DECLARATION entry in the log; or (b) a terminal cert carrying the medical-officer role attribute (ADR-0069 §7).

**Constraints:**
- Only available from DECEASED_PENDING. The applet rejects RETRACT_DECLARATION in ALIVE or DECEASED_CONFIRMED.
- Once a COUNTERSIGN_DEATH (0x0A) has been appended (state → DECEASED_CONFIRMED), the declaration is irrevocable. The applet rejects RETRACT_DECLARATION in DECEASED_CONFIRMED.
- The original DEATH_DECLARATION entry and the RETRACT_DECLARATION entry both remain in the log — no data is deleted. The audit trail shows the full sequence.
- After a successful RETRACT_DECLARATION, a new DEATH_DECLARATION sequence may be initiated if the clinical situation warrants it.

The ADR-0023 two-key principle is preserved: DECEASED_CONFIRMED still requires two distinct persons (Person A declares, Person B countersigns). RETRACT is only available before countersigning and does not weaken the two-key confirmation gate.

## Principle tests

**P1 (break-glass offline; attributable):** RETRACT_DECLARATION is an authenticated, appended entry — attributable offline via `subject_hash` + chip countersig + session receipt (ADR-0031). The full correction chain (declaration → retraction → optional re-declaration) is auditable. Unauthenticated retraction is impossible. ✓

**P9 (identity/signing require UV; medical read never does):** RETRACT_DECLARATION requires Tier 2 authentication (medic or medical-officer cert). No unauthenticated path to clear a death declaration. ✓

## Consequences

**What becomes possible:**
- A re-triaged T4 Expectant casualty who was incorrectly declared pending-dead can have the declaration retracted before countersigning. The tag returns to ALIVE state and can be used normally.
- Triage errors under fire no longer permanently mark a casualty as (pending) deceased on their tag.

**What becomes harder:**
- The applet must distinguish DECEASED_PENDING from DECEASED_CONFIRMED in the RETRACT enforcement path. This is already tracked as a state flag; no new state storage is required.
- A medical officer issuing a RETRACT outside a valid clinical reason is auditable; deployment authority policy governs this.
