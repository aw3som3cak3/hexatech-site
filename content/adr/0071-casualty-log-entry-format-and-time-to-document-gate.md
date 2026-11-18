# ADR-0071: Casualty log entry format and time-to-document gate

- **Status:** Proposed
- **Date:** 2026-11-18
- **Principles:** P1, P3, P4, P8
- **Depends on:** ADR-0062 (casualty log domain on the JCOP tag), ADR-0063 (death state machine), ADR-0065 (physical validation gates), ADR-0068 (applet spec — §6 entry format left TBD), ADR-0069 (terminal session model — who may append)

## Context

ADR-0068 §6 defines the `APPEND CASUALTY LOG ENTRY` command and its pre-conditions but marks the entry format as "TBD in applet spec detail." This ADR fills that gap.

The IDF's Digital Casualty Card System ([Hadar et al., JMIR Med Inform 2026;14:e79808](../references/dccs-idf-2026.md)) provides directly relevant operational evidence:

- The IDF reached only 39% documentation coverage even with dedicated training and a mature system, because documentation competes with treatment time.
- Their primary treatments were tourniquet application (15%), IV access (48%), and whole blood — a small set of time-critical actions.
- Their system required multiple UI steps and version iterations before it was fast enough for field use.
- The first-to-fail under fire is documentation; the fix is making the most common entries one-tap, not restructuring the security model.

**Operational model:** Under direct fire, formal documentation is not possible. Standard TCCC practice is to write critical information — tourniquet time, limb — on whatever is available: the casualty's skin, the tourniquet strap, a strip of tape. The chip is not competing with this. The chip is where that informal record is structured, time-stamped, and attributed at the first safe moment — cover, casualty collection point, during evacuation. Its value is for the rest of the treatment chain: each echelon reads what was done before, adds its own entries, and the whole record travels with the casualty to hospital as a chip-signed log. No paper card to lose, no verbal handoff to misremember, no transcription errors between echelons.

This means the primary documentation scenario is **retrospective entry**: a medic documenting what they did minutes to hours earlier, from memory or from the informal marker they made at the time. Real-time documentation (entering an action as it happens) is a secondary scenario for moments when conditions allow it. Stage 0 must test both.

ADR-0065 Gate 3 tests physical separation usability. There is no equivalent gate for the documentation workflow. Stage 0 (ADR-0029 origin, carried into the PoC plan) previously included a stopwatch test that was not preserved in the current plan. This ADR restores it as a formal Stage 0 test.

## Decisions

### Decision 1 — Entry format: structured binary, typed, fixed-width-where-possible

Each casualty log entry is a typed binary record. The applet stores entries as a sequence; the applet does not interpret or validate clinical content — it stores what the terminal writes and counter-signs it. All clinical interpretation stays in the medic app.

**Entry layout:**

```
[type: 1 byte]
[flags: 1 byte]           — bit 0: unverified (DEGRADED mode active per ADR-0069 §8)
                           — bit 1: event_time_present (see below)
                           — bits 2–7: reserved 0
[timestamp_offset: 4 bytes]   — unsigned minutes since tag enrollment epoch; always the COMMIT time
[subject_hash: 4 bytes]       — low 32 bits of SHA-256(terminal cert subject identifier); person-bound, stable across device replacement
[payload_length: 2 bytes]     — length of entire payload field, placed before payload
[payload: variable, type-specific, see below]
```

Total overhead: 12 bytes per entry header. Payload bounded per type.

**Event time (flag bit 1 = `event_time_present`):** `timestamp_offset` is always the commit time — the moment the entry was written to the chip. For retrospective entries (the primary scenario), the event time differs from the commit time. When `event_time_present` is set, the **first 4 bytes of the payload** are `event_time_offset: 4 bytes` — unsigned minutes since the same enrollment epoch. These 4 bytes come before all type-specific payload bytes.

Applies to entry types: TOURNIQUET, HEMORRHAGE_CONTROL, AIRWAY, MEDICATION, FLUID, VITALS, CASUALTY_STATE, DEATH_DECLARATION, COUNTERSIGN_DEATH. Does not apply to FREE_FLAG (the commit time is the note time). The applet does not validate that `event_time_offset ≤ timestamp_offset`; the medic app enforces this in the UI.

> **Note on grace mode:** ADR-0069 §6 explicitly prohibits casualty log appends in grace mode. The `unverified` flag therefore reflects DEGRADED mode only (ADR-0069 §8), not grace. ADR-0069 §7 defines degraded mode as the fallback when the medic's secondary factor (own tag 2FA) cannot be completed but a valid terminal cert chain is present.

**Entry types (Phase A):**

Payload bytes shown here **exclude** the leading `event_time_offset (4)` bytes that are prepended when flag bit 1 is set.

| Code | Name | Payload (type-specific, after optional event_time) | Max payload bytes (excl. event_time) |
|---|---|---|---|
| 0x01 | TOURNIQUET | limb (1) | 1 |
| 0x02 | HEMORRHAGE_CONTROL | site (1) + method (1) | 2 |
| 0x03 | AIRWAY | intervention (1) | 1 |
| 0x04 | MEDICATION | drug_code (1) + route (1) + dose_code (1) | 3 |
| 0x05 | FLUID | product (1) + volume_100ml (1) | 2 |
| 0x06 | VITALS | HR_div2 (1) + SpO2 (1) + GCS (1) + SBP_div2 (1) + RR (1) | 5 |
| 0x07 | CASUALTY_STATE | triage (1) | 1 |
| 0x08 | FREE_FLAG | UTF-8 text, max 80 bytes | 80 |
| 0x09 | DEATH_DECLARATION | person_a_signed_payload (hybrid ECDSA + ML-DSA per ADR-0033) | ≤ 3072 |
| 0x0A | COUNTERSIGN_DEATH | person_b_signed_payload (hybrid ECDSA + ML-DSA per ADR-0033) | ≤ 3072 |
| 0x0B | VOID | seq_num (2) + reason_code (1) | 3 |

Codes 0x0C–0xFF reserved for Phase B extension.

> **VITALS update:** SBP (systolic blood pressure, stored as SBP ÷ 2 to fit one byte, range 0–510 mmHg) and RR (respiratory rate in breaths/minute, range 0–255) added to address the missing TCCC card fields noted in clinical review.

**Closed-list values** (illustrative; exact lists governed by ADR-0032 and clinical review):

- Limb: 0=L_ARM, 1=R_ARM, 2=L_LEG, 3=R_LEG
- Method: 0=DIRECT_PRESSURE, 1=WOUND_PACKING, 2=PRESSURE_BANDAGE, 3=OTHER
- Intervention: 0=RECOVERY_POSITION, 1=NPA, 2=OPA, 3=SGA, 4=ETT, 5=CRIC
- Drug code: ATC code mapped to 1-byte index (Phase A list: TBD by clinical review per ADR-0032)
- Route: 0=IV, 1=IO, 2=IM, 3=PO, 4=IN, 5=OTHER
- Triage: 0=T1_IMMEDIATE, 1=T2_DELAYED, 2=T3_MINIMAL, 3=T4_EXPECTANT

**Memory:** Worst-case entry is DEATH_DECLARATION at 12 + 3072 = 3084 bytes. ADR-0033 specifies hybrid ECDSA (~64 bytes) + ML-DSA-44 (~2.4 KB) for death declarations. Because extended APDU support is unreliable on Android NFC controllers (`IsoDep.isExtendedLengthApduSupported()` returns false on many low-end devices, including Gate 1 target hardware), death entry types (0x09, 0x0A) **must use ISO 7816-4 command chaining** (CLA bit 4 set, standard APDU data blocks of ≤ 255 bytes each), not extended APDUs. JCOP 4 / JavaCard 3.0.5 supports command chaining; the applet handles reassembly. The applet spec (ADR-0068 §6) must state command chaining, not extended APDUs.

> **On-chip signature verification:** the applet verifies the ECDSA-P256 half of the hybrid signature on-chip (JCOP 4 supports ECDSA natively). The ML-DSA-44 half cannot be verified on-chip — JCOP 4 has no PQC primitive support (ADR-0033). The applet stores the full payload verbatim and countersigns it; ML-DSA verification is performed by the reader app or backend. This is an explicit constraint, not an implementation gap.

Common entries with event_time set: 12 + 4 + 1–5 = 17–21 bytes. At ~20 bytes/entry, 20 KB accommodates approximately **1,000 typical entries**. 72-hour prolonged field care at vitals every 5 minutes = 864 VITALS entries × 21 bytes ≈ 18 KB, within the byte cap with headroom for treatment entries. Death entries count at actual size (up to 3,084 bytes each) — the byte cap naturally handles variable-size entries.

Reserve **20 KB** for the log domain. The applet enforces a **byte cap**: LOG_FULL when cumulative log bytes reach 20 KB. This supersedes the entry-count cap model (see ADR-0072). The P71D600 Flash NVM (up to 450 KB gross; 80–320 KB user-available depending on configuration) accommodates this alongside the emergency profile (~2–5 KB), identity domain (~4 KB), and system overhead.

### Decision 2 — Applet validates structure, not content

The applet checks:
1. Entry type is a known code (0x01–0x0B for Phase A).
2. Payload length matches the stated `payload_length` field (2 bytes).
3. Cumulative log bytes after this append would not exceed the 20 KB byte cap. LOG_FULL returned if the entry would exceed the cap.
4. For death entries (0x09, 0x0A): the death state machine preconditions are met per ADR-0063.
5. Terminal is Tier 2 authenticated (medic PKI cert) per ADR-0069.

The applet does NOT validate clinical values (drug codes, dose ranges, vital sign plausibility). That is the medic app's responsibility. The applet is a store; the app is the gatekeeper for clinical content.

### Decision 3 — Medic app tap-to-commit pattern for time-critical entries

This decision is a recommendation for the medic app UX, not an applet constraint. It is recorded here as a design intent to be verified by the Stage 0 test.

For the four tourniquet entries (the most time-critical):
- The app presents four large buttons on the first screen after NFC authentication: **L ARM / R ARM / L LEG / R LEG**
- One tap commits the entry with the current time and no confirmation dialog
- An undo is available for 10 seconds within the same NFC session only

For other entry types: the app may require additional selections, but the common path for each type (e.g., the most recently used drug, the most recently used fluid volume) should be reachable in ≤ 3 taps from the authenticated main screen.

**Undo and correction:** a 10-second same-session undo is available for accidental commits within one NFC session. The undo **appends a VOID entry (0x0B)** with reason code `0x00 ACCIDENTAL`; the original entry is preserved (append-only semantics are never violated). For errors discovered after the session closes, the medic appends a VOID entry in a subsequent authenticated session. See Decision 5.

**Time entry for retrospective documentation:** the app must support entering a past event time, not only "now." The default is the current time; the medic can adjust backward. The adjustment UI must be operable with nitrile gloves — large touch targets, 1-minute scroll increments, or a numeric keypad. When the medic sets a past time, the app sets flag bit 1 (`event_time_present`) and prepends `event_time_offset` (minutes since enrollment epoch, computed from the medic's clock) as the first 4 bytes of the payload. This is a Track C app design requirement, not an applet constraint.

The underlying principle: documentation UX that cannot support retrospective entry will not be used. The medic who applied the tourniquet was under fire; they will document it later.

### Decision 4 — Stage 0 time-to-document test

A time-to-document test is added to Stage 0 alongside the existing Stage 0 usability tests. This test is distinct from ADR-0065 Gates 1–3 (which test RF, mechanical retention, and physical separation usability). Gates 1–3 do not test app workflow speed.

**Test population:** 5 participants minimum. At least 3 must be military medical personnel (medic, paramedic, or equivalent). Participants must not have used the Hexa app before the test session. Nitrile examination gloves worn.

**Environment:** indoor, dimmed to simulate low-light conditions (target ≤ 50 lux). NFC phone held in one hand; Hexa prototype tag on a chain around the neck of a mannequin or volunteer.

**Task A1 — Tourniquet, real-time (secondary scenario):**

**Starting state:** the researcher has completed Tier 2 authentication on behalf of the participant before the clock starts. The medic app main screen (tourniquet buttons visible) is displayed on the phone being held near the mannequin. The NFC session is active. The participant takes the phone for the first time at the start cue.

Participant is told: "You have just applied a tourniquet to this casualty's right arm. Document it."
- Start time: participant takes the phone (or verbal instruction if the participant is already holding it)
- Stop time: NFC field disengages (transaction complete) OR participant declares done

Pass criterion: ≥ 4/5 participants complete a TOURNIQUET R_ARM append in ≤ 5 seconds from the start cue.

Rationale: the 5-second target measures UI speed, not authentication speed. Authentication (NFC session establishment, cert verification, 2FA) is measured separately in Task C. If the 5-second target is met, the one-tap tourniquet flow is validated. If the target is not met with this starting state, the UI design is the bottleneck, not the authentication layer.

> **Separate diagnostic:** a Task A0 (not pass/fail, diagnostic only) measures full end-to-end time from "app closed, phone in pocket" to "transaction complete." This baseline establishes whether the total workflow fits in operationally acceptable time and whether authentication is the dominant factor.

**Task A2 — Tourniquet, retrospective (primary scenario):**
Participant is handed a marker before the scenario begins. They are told: "Eight minutes ago you applied a tourniquet to this casualty's left leg. Write the time 14:23 on your palm — that is what you wrote on the casualty at the time." *(pause while they do this)* "Now document it on the chip."
- Start time: "Now document it" instruction ends
- Stop time: NFC field disengages (transaction complete) OR participant declares done

Pass criterion: ≥ 4/5 participants complete an authenticated Tier 2 append of a TOURNIQUET L_LEG entry with time 14:23 (± 1 minute) in ≤ 15 seconds from the start cue, with nitrile gloves.

Rationale: retrospective entry is the dominant operational pattern — the tourniquet was applied under fire; documentation happens at the first safe opportunity. The marker step replicates the TCCC practice of writing tourniquet time on the casualty's skin. The 15-second ceiling is more generous than Task A1 because the medic is not under fire, but the time-entry UI must still be operable with gloves. Tourniquet timing directly affects limb salvage decisions downstream; an incorrect or missing time in the chip record is a patient safety concern for the surgeons who were not present.

**Task B — Casualty state:**
Participant is told: "Mark this casualty as T1 Immediate."
Pass criterion: ≥ 4/5 participants complete an authenticated CASUALTY_STATE T1_IMMEDIATE append in ≤ 10 seconds.

**Task C — NFC hold time (diagnostic, not pass/fail):**
Record the duration from initial NFC field engagement to transaction complete for each task. Median and worst-case reported to design team. If worst-case hold time exceeds 4 seconds, RF link margin and authentication latency should be reviewed.

**Gate 3 amendment:** ADR-0065 Gate 3 must be re-run with the revised app (incorporating Stage 0 UX feedback) before first deployment. The time-to-document test is a Stage 0 formative test; it is not a substitute for Gate 3.

### Decision 5 — VOID entry type (0x0B)

The append-only log cannot overwrite or delete entries. The 10-second same-session undo (Decision 3) handles immediate accidental commits. For errors discovered after the session closes — wrong limb, wrong drug code, duplicate entry — the medic appends a VOID entry in a subsequent authenticated session.

**VOID entry layout (payload):**
```
[seq_num: 2 bytes]      — 0-indexed sequence number of the entry being voided
[reason_code: 1 byte]   — 0x00 ACCIDENTAL (10-second same-session undo)
                          0x01 WRONG_LIMB · 0x02 WRONG_DRUG · 0x03 WRONG_PATIENT
                          0x04 DUPLICATE · 0xFF OTHER
```

**Applet enforcement:**
1. The applet extracts the `subject_hash` from the authenticated terminal cert of the person appending the VOID, and compares it to the `subject_hash` of the entry at `seq_num`. A medic may void their own entries from any subsequently enrolled device — `subject_hash` is person-bound (derived from the cert subject identifier), not device-bound.
2. Exception: a terminal cert with the medical-officer role attribute (per ADR-0063 death confirmation cert profiles) may void any entry regardless of `subject_hash`, to allow supervisor correction. Medical-officer VOID entries are distinguishable in the transparency log by role.
3. `seq_num` must reference an existing, not-yet-voided entry. Voiding a VOID entry is rejected.
4. VOID entries cannot void death entries (0x09, 0x0A). Death declarations are irrevocable at the applet level.
5. A voided entry remains in the log and is returned on read; the reader app displays it as superseded. No data is deleted.

**Display rule for medic apps:** a voided entry is shown with a strikethrough or "VOIDED" marker, with the VOID entry's timestamp and reason. The original entry value is preserved and shown to allow audit.

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
- The 20 KB byte-capped log accommodates ~1,000 typical entries, covering 72-hour prolonged field care scenarios (864 VITALS entries × 21 bytes ≈ 18 KB).

**What becomes harder:**
- The closed-list values (drug codes, dose indices) must go through clinical review per ADR-0032 before the Phase A applet is finalised. This is a pre-start task for Track B in the PoC plan.
- The tap-to-commit UX (Decision 3) requires the medic app to disambiguate "confirmed commit" from "accidental tap." The 10-second same-session undo window is the mitigation; this must be evaluated in Stage 0 Task A.

**What we give up:**
- Flexible free-form documentation per entry. The closed lists in Phase A are intentionally narrow — coverage of the most common treatments only. Phase B can extend with additional entry types. This trade-off is explicit: a faster, narrower form completes; a richer, slower form gets skipped.

**Phase A known limitations (design questions deferred to Phase B or Track C):**
- **Reader signature (OQ-45):** entries carry no terminal-side signature — attribution relies on `subject_hash` + chip countersig + session receipt (ADR-0031). Full per-entry terminal signatures add ~64 bytes overhead per entry; deferred to Phase B.
- **Combat lifesaver / buddy-aid append (OQ-43):** only Tier 2 authenticated medic cert holders may append. CLS and buddy-aid appending their own interventions requires extending cert issuance to non-medic unit members — a PKI scaling problem deferred to Phase B. Phase A workaround: medics document observed buddy-aid; attribution is to the documenting medic.
- **Civilian hospital access (OQ-42):** civilian hospitals lack the deployment authority terminal cert required for Tier 1 reads in sovereign mode. Phase B design question: a civilian gateway service holding a cert and bridging to FHIR/HL7.
- **FHIR / trauma registry export (OQ-44):** Track C (app/backend) requirement. Entry types map to FHIR Procedure/Observation resources; the reader app or receiving-facility backend performs the mapping. No applet change required; a mapping specification ADR is needed before clinical deployment.

---

## Prior art

- [IDF Digital Casualty Card System (Hadar et al., JMIR Med Inform 2026;14:e79808)](../references/dccs-idf-2026.md) — primary evidence base for this ADR. NFC tag on casualty, air-gapped operation, MVP approach, treatment frequency data informing entry type priority.

## Open questions

- **Drug code list (Phase A):** ATC code subset selection requires clinical review. Recommended starting point: drugs carried in a standard NATO combat medic kit. ADR-0032 governs the list as an open standard.
- **Timestamp epoch:** ~~enrollment vs deployment-start~~ **Resolved:** use enrollment timestamp. Simpler; avoids the complexity of distributing a deployment epoch to all terminals before the first append.
- **Task C hold time target:** if measured worst-case hold time in Stage 0 exceeds 4 seconds, the total workflow (auth + UI) may need separate optimisation work before Gate 3.
- ~~**Extended APDU confirmation:**~~ **Resolved** — command chaining mandated for death entry types (0x09, 0x0A) per Decision 1; extended APDUs are unreliable on low-end Android NFC controllers. ADR-0068 §6 to specify command chaining.
- ~~**Memory budget amendment to ADR-0068:**~~ **Resolved** by ADR-0072 — log domain raised to 200 entries / 20 KB.
