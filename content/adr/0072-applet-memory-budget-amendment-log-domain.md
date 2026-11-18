# ADR-0072: Applet memory budget amendment — log domain

- **Status:** Accepted
- **Date:** 2026-11-18
- **Principles:** P1, P3
- **Amends:** ADR-0068 §8 (memory budget table, log domain row only)
- **Caused by:** ADR-0071 (casualty log entry format and time-to-document gate)

## Context

ADR-0071 made three decisions that increase the log domain memory requirement:

1. **Entry count raised from 50 to 200.** A 4-hour evacuation with vitals logged every 5 minutes requires 48 VITALS entries alone. 50 entries was too few; the fail-closed LOG_FULL state would prevent treatment entries late in evacuation.

2. **`event_time_offset` field added (4 bytes per entry when flag bit 1 is set).** The retrospective entry model means most entries carry an event time distinct from the commit time. With the flag routinely set, typical entry size increases from ~12–13 bytes to ~16–17 bytes.

3. **Death entry cap raised from 256 to 3072 bytes.** Hybrid ECDSA + ML-DSA (ADR-0033) requires ~2.4 KB per signature. Each death declaration entry is now up to 3,084 bytes.

The ADR-0068 §8 table must reflect these changes before the applet spec is finalised and before Stage 1 prototype build begins.

## Decision

Update the casualty log row in ADR-0068 §8 as follows:

| Row | Old value | New value |
|---|---|---|
| Casualty log (entry count) | 50 entries | 200 entries |
| Casualty log (memory reservation) | ~10 KB | ~20 KB |
| **Total estimated** | **~19 KB** | **~29 KB** |

The P71D600 has up to 450 KB Flash NVM (gross), confirmed from NXP distributor sources (N7122/P71D600 spec sheets). User-available applet storage is in the 80–320 KB range depending on JCOP version and card configuration, with the low end already 2.75× the 29 KB data budget. Applet bytecode and GlobalPlatform overhead (typically 100–200 KB combined) leave substantial headroom for Phase B domains.

**Extended APDU requirement (new):** ADR-0068 §6 (`APPEND CASUALTY LOG ENTRY`) must add a note that death entry types (0x09, 0x0A) require extended APDU support per ISO 7816-4 §5.3.2. This is a conformance clarification, not a new feature — JCOP 4 / JavaCard 3.0.5 supports extended APDUs; the applet must declare and handle them. The applet spec detail (Track B, Stage 0 Task A1) must include this explicitly.

No other rows in ADR-0068 §8 change. ADR-0068 remains the authoritative applet specification; this ADR amends only the values in §8.

## Principle tests

**P1 (break-glass offline; attributable):** raising the entry count reduces the risk of LOG_FULL during a long evacuation, which is a P1 failure mode — a medic who cannot append a treatment entry has broken the attributable offline record. ✓

**P3 (only data that changes emergency action and is low-harm if wrong):** no new entry types, no new data fields beyond event_time (a timestamp). The expanded budget does not change what data is stored, only how much. ✓

## Consequences

**What becomes possible:**
- Stage 1 applet build can proceed with a memory budget consistent with the entry format defined in ADR-0071.
- 4-hour evacuation scenarios with frequent vitals logging are within the log capacity.

**What becomes harder:**
- Nothing material: 29 KB is well within the P71D600's user-available NVM range (80–320 KB depending on configuration). Confirm the exact user partition with NXP application engineering when placing the inlay order.
