# ADR-0067: Phase A scope — sovereign mode only; consumer track deferred to Phase B

- **Status:** Accepted
- **Date:** 2026-11-10
- **Principles:** P1, P2, P6
- **Amends:** ADR-0061 (consumer/sovereign mode split — defers consumer implementation)
- **Depends on:** ADR-0059 (single JCOP), ADR-0061 (mode split), ADR-0066 (JCOP physical spike)
- **Resolves:** OQ-30 (consumer attribution gap), OQ-31 (consumer casualty log append policy), OQ-32 (NDEF fallback vs app-only)

## Context

The architecture supports two deployment modes (ADR-0061):
- **Consumer mode (Tier 1 unauthenticated):** any NFC phone reads the emergency profile; NDEF fallback for iOS; unsigned casualty log appends permitted.
- **Sovereign mode:** terminal PKI authentication required; medic reader holds a valid terminal certificate; casualty log appends are signed.

Both modes are architecturally defined. Implementing both in Phase A adds complexity without a corresponding customer:

- Consumer mode requires NDEF infrastructure, a web reader to host, unauthenticated access policy, GDPR surface area, and app-store distribution — before a single paying customer exists.
- The sovereign track has a named procurement path (Försvarsmakten, NATO DIANA non-dilutive programme), a clear certification requirement (CC/FIDO L2+ against a military specification), and procurement budgets sized for this hardware.
- OQ-30, OQ-31, and OQ-32 are all consumer-mode questions. Deferring consumer closes all three.

This is a focus decision, not an architectural rejection. ADR-0061 defines consumer mode and remains Accepted. Consumer mode can be re-enabled for Phase B without architectural changes.

## Decision

1. **Phase A implements sovereign mode only.** The medic reader holds a valid terminal certificate (ADR-0057); Tier 1 access is terminal-authenticated; Tier 2 is ECC challenge-response authenticated.

2. **Consumer mode (unauthenticated Tier 1) is deferred to Phase B.** No NDEF fallback record is implemented in Phase A. No unauthenticated read path is exposed by the Phase A applet.

3. **OQ-30 (consumer attribution gap), OQ-31 (consumer casualty log append), and OQ-32 (NDEF fallback vs app-only) are deferred.** They are not Phase A decisions. Reopen when Phase B scope is defined.

4. **Target deployment for Phase A:** sovereign pilot with Försvarsmakten or equivalent NATO member. Terminal PKI enrollment and certificate management are in scope.

## Principle tests

**P1 (break-glass offline; attributable):** sovereign mode produces a chip-signed, terminal-signed treatment record — the strongest form of P1's attributable record requirement. The consumer fallback is not needed to satisfy P1 for the pilot. ✓

**P2 (tag is cache, not identity):** unchanged. Physical layer (tear-away, grommet engraving) and digital layer (JCOP applet, Enrollment ID) are independent of deployment mode. Consumer mode can be added later without changing the physical design. ✓

**P6 (we route and store, we don't vouch):** sovereign PKI is external to Hexatec — the deployment authority holds the terminal CA root. Hexatec issues the chip key pair at enrollment; it does not hold terminal credentials. ✓

## Consequences

**What becomes simpler:**
- ADR-0068 (applet specification) omits the unauthenticated Tier 1 path, NDEF record, and consumer casualty log append policy. The applet is simpler to specify, implement, and certify.
- OQ-30, OQ-31, OQ-32 are closed. Gate 3 Scenario B (NFC icon face identification) uses the medic reader app, not "any NFC phone."
- Phase A PoC scope is clean: enrol a tag, authenticate a medic reader, return a signed Tier 1 profile.

**What is deferred:**
- Unauthenticated Tier 1 read path.
- NDEF URL record (web reader, iOS bystander access).
- Consumer casualty log append policy.
- Phase B re-enabling is a configuration and applet update — not an architectural change.

**What is unchanged:**
- ADR-0061's consumer/sovereign mode architecture remains Accepted. The applet memory budget must still reserve space for a future consumer path if Phase B is planned.
