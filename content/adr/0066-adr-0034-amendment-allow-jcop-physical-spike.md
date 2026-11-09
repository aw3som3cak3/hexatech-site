# ADR-0066: Amend ADR-0034 — allow early JCOP physical spike; remove two-chip anti-collision gate

- **Status:** Accepted
- **Date:** 2026-11-09
- **Principles:** P1, P10
- **Amends:** ADR-0034 (Phase A technical PoC — HCE software simulation)
- **Depends on:** ADR-0059 (single JCOP platform)

## Context

ADR-0034 defines the Phase A technical PoC as Android HCE software simulation only, and sets a
Phase B gate requiring demonstration of anti-collision between chip A and chip B in a two-chip
NFC field.

Two changes in the accepted architecture invalidate these constraints:

1. **Single chip (ADR-0059):** there is no chip A/chip B split. The two-chip anti-collision gate
   is not meaningful for a single-JCOP card. That Phase B gate is obsolete.

2. **Gate 1 test plan (ADR-0065 measurement 9):** Gate 1 requires a full end-to-end NFC
   transaction on physical JCOP hardware, using an iPhone and a low-end Android. HCE alone cannot
   satisfy measurement 9. Early physical JCOP access unblocks this gate.

HCE remains a valid and useful software simulation environment for applet development and unit
testing (JCardSim, applet logic without hardware). It does not need to be deprecated; it is
simply no longer the only permitted first step.

## Decision

1. **HCE PoC remains valid** as a software simulation and applet development environment.
   ADR-0034's HCE-first sequence is preserved as a recommended path, not a mandatory gate.

2. **Early physical JCOP spike is permitted** in parallel with or before the HCE PoC. The spike
   uses a stock JCOP 4 P71D600 with a stub applet to validate: physical NFC activation range,
   ferrite sheet behavior, measurement 9 transaction flow, and grommet/chain assembly. It does
   not require the full applet specification to be complete.

3. **The two-chip anti-collision Phase B gate is removed** from the active implementation plan.
   It was relevant only to the dual-chip ring/core architecture (ADR-0022/ADR-0052), which the
   card form factor does not inherit.

## Principle tests

**P1 (break-glass offline):** early physical JCOP validation confirms the actual hardware can
complete an offline NFC emergency transaction — the central P1 requirement. HCE simulation alone
cannot establish this. ✓

**P10 (adopt existing standards):** no novel protocol or hardware is introduced. JCOP 4 P71D600
is the already-selected chip (ADR-0059). ✓

## Consequences

**What becomes possible:**
- Gate 1 measurement 9 (physical JCOP transaction test) can begin as soon as a stub applet
  is loaded on a P71D600 prototype card, without waiting for the full applet specification.
- HCE development for the Android medic app continues in parallel without blocking physical
  gate testing.

**What is removed:**
- The mandatory sequencing that required HCE PoC completion before physical JCOP work.
- The two-chip anti-collision gate from the Phase B criteria.

**What is unchanged:**
- HCE remains the recommended environment for applet unit testing and Android integration work.
- The full applet specification ADR remains required before production applet development.
