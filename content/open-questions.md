# Open questions

Resolve by writing an ADR and linking it here.

1. **First customer/pilot:** nation (Försvarsmakten/MSB), humanitarian (UNHCR/ICRC), or consumer? Drives chip, certification and price.
2. **Chip platform:** existing certified platform (NXP JCOP, Infineon SECORA) vs own applet stack.
3. ~~**Clinical owner for closed lists**~~ — resolved by [ADR-0032](adr/0032-hexatech-governs-emergency-profile-code-lists-as-open-standard.md): Hexatech governs the lists as an open standard; clinical advisors review but do not govern.
4. **Certification budget & timeline:** CC + FIDO L2+; quote from chip vendor and lab.
5. **Read-cap values** (ADR-0005): how many offline reads per terminal cert are defensible to IMY?
6. **eCurrency learnings:** reconciliation conflicts, fielded key rotation, approval of offline caps.
7. **BankID relying-party terms** for attestation re-use (ADR-0012).
8. **IMY innovation sandbox application** — health data in TEE as new use case.
9. **EHDS applicability and timeline** for EHR-system conformity.
10. **Recovery without national ID:** trusted contacts vs organisation vouching — assurance levels.
11. **Business model:** hardware/applet supplier vs consumer-mode operator.
12. **Trademark and domain check** for "Hexa" and "Hexatech" (EUIPO, PRV, domains) before investing in branding.
13. **Hardware validation** (ADR-0022): slotted-ring read range, two chips in one field, shear-pin torque, environmental testing.
14. **Donor mark** (ADR-0025): do military medical services need a physical mark?
15. **Position in death declarations** (ADR-0023): default on or off?
16. **Legal entity for the broker** (ADR-0028): decide after the Digital Omnibus settles.
17. **Identity broker pointer staleness** (ADR-0027): when a source register updates or deletes a record the broker holds a pointer to, the tag returns stale data silently. No TTL or invalidation signal is defined. Needs a contract with source registers before sovereign deployments.
18. **Frame material selection** (ADR-0022): metal grade (Ti Gr 5, steel 316L, other) vs composite vs polymer, driven by cost target, durability requirement and deployment context. A low-cost disposable variant (e.g. plastic tag for unidentified soldiers) is not ruled out. Material affects antenna coupling, engraving durability and survivability — resolve before committing to a manufacturing partner.
19. ~~**Chip A standalone data scope**~~ — resolved by [ADR-0038](adr/0038-chip-a-ring-only-profile-red-flag-and-locator.md): chip A holds a ring-only profile — red-flag line and tag locator only. No full Tier 1 duplicate.
20. ~~**NOK delegated write access**~~ — resolved by [ADR-0039](adr/0039-nok-delegated-write-deferred.md): not supported in Phase A; preferred long-term path is account-level delegation once the account/identity layer is specified.
