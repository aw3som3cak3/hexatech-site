# ADR-0023: Two-key death confirmation

- **Status:** Accepted
- **Date:** 2026-10-05
- **Principles:** P1, P8, P9

## Context
Old tags are snapped to mark a death. The partner design makes this physical, signed and two-person.

## Decision
1. Medic writes a death declaration to chip A, signed with their personal key and time.
2. Two-pin key twists the core out; shear pins break the tamper loop; chip A records SPLIT permanently; orange seat wall exposed.
3. A second person (officer, chaplain, mortuary specialist) scans the core; chip B verifies the declaration and adds a second signature. Only then is the status confirmed.
4. Countersigned core triggers casualty reporting on sync. Ring stays with the body.
- **Position in the declaration is a deployment setting**, default to be decided (open question).
- The core is never released for the wounded.

## Consequences
Irreversible, attributable, two-person. The tag records a human declaration and computes nothing (P8). A captured core with exact positions is intelligence; hence the setting.

## Alternatives considered
Single-signature declaration; automatic death detection (not possible without power, and would be clinical computation).
