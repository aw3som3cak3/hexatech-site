# ADR-0071: Casualty log entry format and time-to-document gate

- **Status:** Proposed
- **Date:** 2026-11-18
- **Principles:** P1, P3, P4, P8
- **Depends on:** ADR-0062 (casualty log domain on the JCOP tag), ADR-0063 (death state machine), ADR-0065 (physical validation gates), ADR-0068 (applet spec — §6 entry format left TBD), ADR-0069 (terminal session model — who may append)

## Context

ADR-0068 §6 defines the `APPEND CASUALTY LOG ENTRY` command and its pre-conditions but marks the entry format as "TBD in applet spec detail." This ADR fills that gap.

The IDF's Digital Casualty Card System (Hadar et al., JMIR Med Inform 2026;14:e79808) provides directly relevant operational evidence:

- The IDF reached only 39% documentation coverage even with dedicated training and a mature system, because documentation competes with treatment time.
- Their primary treatments were tourniquet application (15%), IV access (48%), and whole blood — a small set of time-critical actions.
- Their system required multiple UI steps and version iterations before it was fast enough for field use.
- The first-to-fail under fire is documentation; the fix is making the most common entries one-tap, not restructuring the security model.

ADR-0065 Gate 3 tests physical separation usability. There is no equivalent gate for the documentation workflow. Stage 0 (ADR-0029 origin, carried into the PoC plan) previously included a stopwatch test that was not preserved in the current plan. This ADR restores it as a formal Stage 0 test.

## Decisions

### Decision 1 — Entry format: structured binary, typed, fixed-width-where-possible

Each casualty log entry is a typed binary record. The applet stores entries as a sequence; the applet does not interpret or validate clinical content — it stores what the terminal writes and counter-signs it. All clinical interpretation stays in the medic app.

**Entry layout:**

```
[type: 1 byte]
[flags: 1 byte]  — bit 0: unverified (SECONDARY AUTH or GRACE mode active)
                 — bit 1: auto-generated (future reserved)
                 — bits 2–7: reserved 0
[timestamp_offset: 2 bytes]  — unsigned minutes since tag enrollment epoch
[cert_serial_hash: 4 bytes]  — low 32 bits of SHA-256(terminal cert serial)
[payload: variable, type-specific, see below]
[payload_length: 1 byte]  — length of payload field only
```

Total overhead: 9 bytes per entry header. Payload bounded per type.

**Entry types (Phase A):**

| Code | Name | Payload | Max payload bytes |
|---|---|---|---|
| 0x01 | TOURNIQUET | limb (1) + time_applied_offset_minutes (2) | 3 |
| 0x02 | HEMORRHAGE_CONTROL | site (1) + method (1) | 2 |
| 0x03 | AIRWAY | intervention (1) | 1 |
| 0x04 | MEDICATION | drug_code (1) + route (1) + dose_code (1) | 3 |
| 0x05 | FLUID | product (1) + volume_100ml (1) | 2 |
| 0x06 | VITALS | HR_div2 (1) + SpO2 (1) + GCS (1) | 3 |
| 0x07 | CASUALTY_STATE | triage (1) | 1 |
| 0x08 | FREE_FLAG | UTF-8 text, max 80 bytes | 80 |
| 0x09 | DEATH_DECLARATION | references ADR-0063 state machine; payload is person_a_signed_payload | ≤ 256 |
| 0x0A | COUNTERSIGN_DEATH | references ADR-0063 state machine; payload is person_b_signed_payload | ≤ 256 |

Codes 0x0B–0xFF reserved for Phase B extension.

**Closed-list values** (illustrative; exact lists governed by ADR-0032 and clinical review):

- Limb: 0=L_ARM, 1=R_ARM, 2=L_LEG, 3=R_LEG
- Method: 0=DIRECT_PRESSURE, 1=WOUND_PACKING, 2=PRESSURE_BANDAGE, 3=OTHER
- Intervention: 0=RECOVERY_POSITION, 1=NPA, 2=OPA, 3=SGA, 4=ETT, 5=CRIC
- Drug code: ATC code mapped to 1-byte index (Phase A list: TBD by clinical review per ADR-0032)
- Route: 0=IV, 1=IO, 2=IM, 3=PO, 4=IN, 5=OTHER
- Triage: 0=T1_IMMEDIATE, 1=T2_DELAYED, 2=T3_MINIMAL, 3=T4_EXPECTANT

**Memory:** worst-case entry is DEATH_DECLARATION at 9 + 256 = 265 bytes. Most common entries (tourniquet, IV, fluid) are 9 + 2–3 = 11–12 bytes. With 50 entries and a mix typical of trauma care, total log occupancy is well under 2 KB. Reserve 10 KB for the log domain in the memory budget (ADR-0068 §8) allows for the larger death-declaration entries and future Phase B types.

### Decision 2 — Applet validates structure, not content

The applet checks:
1. Entry type is a known code (0x01–0x0A for Phase A).
2. Payload length matches the stated `payload_length` byte.
3. For death entries (0x09, 0x0A): the death state machine preconditions are met per ADR-0063.
4. Terminal is Tier 2 authenticated (medic PKI cert) per ADR-0069.

The applet does NOT validate clinical values (drug codes, dose ranges, vital sign plausibility). That is the medic app's responsibility. The applet is a store; the app is the gatekeeper for clinical content.

### Decision 3 — Medic app tap-to-commit pattern for time-critical entries

This decision is a recommendation for the medic app UX, not an applet constraint. It is recorded here as a design intent to be verified by the Stage 0 test.

For the four tourniquet entries (the most time-critical):
- The app presents four large buttons on the first screen after NFC authentication: **L ARM / R ARM / L LEG / R LEG**
- One tap commits the entry with the current time and no confirmation dialog
- An undo is available for 10 seconds within the same NFC session only

For other entry types: the app may require additional selections, but the common path for each type (e.g., the most recently used drug, the most recently used fluid volume) should be reachable in ≤ 3 taps from the authenticated main screen.

The underlying principle: documentation UX that requires more than 5 seconds for the most common action will be skipped under fire. Building the security model on a foundation that is too slow to use is not a security improvement.

### Decision 4 — Stage 0 time-to-document test

A time-to-document test is added to Stage 0 alongside the existing Stage 0 usability tests. This test is distinct from ADR-0065 Gates 1–3 (which test RF, mechanical retention, and physical separation usability). Gates 1–3 do not test app workflow speed.

**Test population:** 5 participants minimum. At least 3 must be military medical personnel (medic, paramedic, or equivalent). Participants must not have used the Hexa app before the test session. Nitrile examination gloves worn.

**Environment:** indoor, dimmed to simulate low-light conditions (target ≤ 50 lux). NFC phone held in one hand; Hexa prototype tag on a chain around the neck of a mannequin or volunteer.

**Task A — Tourniquet (primary pass criterion):**
Participant is told: "You have just applied a tourniquet to this casualty's right arm. Document it."
- Start time: verbal instruction ends
- Stop time: NFC field disengages (transaction complete) OR participant declares done

Pass criterion: ≥ 4/5 participants complete an authenticated Tier 2 append of a TOURNIQUET R_ARM entry in ≤ 5 seconds from the start cue.

Rationale for 5 seconds: the IDF identified documentation as the first task dropped under fire. A 5-second ceiling on the most critical action (tourniquet timing directly affects limb salvage decision) is both meaningful and achievable with a well-designed one-tap flow. This threshold is consistent with the ≥ 80% / small-N formative test framing in the PoC plan — with n=5, ≥ 4/5 means 80%.

**Task B — Casualty state:**
Participant is told: "Mark this casualty as T1 Immediate."
Pass criterion: ≥ 4/5 participants complete an authenticated CASUALTY_STATE T1_IMMEDIATE append in ≤ 10 seconds.

**Task C — NFC hold time (diagnostic, not pass/fail):**
Record the duration from initial NFC field engagement to transaction complete for each task. Median and worst-case reported to design team. If worst-case hold time exceeds 4 seconds, RF link margin and authentication latency should be reviewed.

**Gate 3 amendment:** ADR-0065 Gate 3 must be re-run with the revised app (incorporating Stage 0 UX feedback) before first deployment. The time-to-document test is a Stage 0 formative test; it is not a substitute for Gate 3.

---

## Principle tests

**P1 (break-glass offline; attributable):**
Entry format is designed for the offline case — no network field in any entry type; timestamps are relative offsets from the enrollment epoch (chip-stored). The applet countersigns each entry at append time; receipts reach the transparency log on next sync. The tap-to-commit UX (Decision 3) reduces the friction that causes documentation to be skipped — an unskipped, attributable, offline append is better P1 compliance than a theoretically correct append that is never made. ✓

**P3 (only data that changes emergency action and is low-harm if wrong):**
Tourniquet timing directly affects limb salvage decisions. IV access type, drug administration, and airway intervention all change downstream treatment choices. These fields change emergency action. A wrong tourniquet limb in the log is low-harm if the tourniquet itself was applied correctly (the downstream medic sees the limb tourniquet and can verify by physical inspection). ✓

**P4 (semantically quiet — coded, fixed-position, explicit state):**
All fields except FREE_FLAG (capped at 80 bytes, same constraint as ADR-0046 RED_FLAG) use closed lists and fixed-width encoding. No unbounded free text in common entry types. ✓

**P8 (store, communicate and display only; no clinical decision support):**
The applet stores typed entries written by a medic. It does not compute drug interactions, triage scores, or recommendations. The medic app displays entries as entered; it does not flag contraindications or suggest treatments. P8 is not violated. ✓

---

## Consequences

**What becomes possible:**
- ADR-0068 §6 "format TBD" is resolved; applet implementation can begin.
- Stage 0 includes a formal time-to-document gate aligned with the operational evidence from IDF DCCS deployment.
- The 50-entry log at ≤ 10 KB fits the ADR-0068 memory budget with room to spare.

**What becomes harder:**
- The closed-list values (drug codes, dose indices) must go through clinical review per ADR-0032 before the Phase A applet is finalised. This is a pre-start task for Track B in the PoC plan.
- The tap-to-commit UX (Decision 3) requires the medic app to disambiguate "confirmed commit" from "accidental tap." The 10-second same-session undo window is the mitigation; this must be evaluated in Stage 0 Task A.

**What we give up:**
- Flexible free-form documentation per entry. The closed lists in Phase A are intentionally narrow — coverage of the most common treatments only. Phase B can extend with additional entry types. This trade-off is explicit: a faster, narrower form completes; a richer, slower form gets skipped.

---

## Open questions

- **Drug code list (Phase A):** ATC code subset selection requires clinical review. Recommended starting point: drugs carried in a standard NATO combat medic kit. ADR-0032 governs the list as an open standard.
- **Timestamp epoch:** enrollment timestamp or deployment-start timestamp? Enrollment is simpler; deployment-start avoids leaking the enrollment date. Deferred to applet spec detail.
- **Task C hold time target:** if measured worst-case hold time in Stage 0 exceeds 4 seconds, is the target 5-second total task time achievable? May require separate app optimisation work before Gate 3.
