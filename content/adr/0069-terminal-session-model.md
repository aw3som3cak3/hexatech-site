# ADR-0069: Terminal session model — deployment-duration certs, medic 2FA, offline-first

- **Status:** Accepted
- **Date:** 2026-11-10
- **Principles:** P1, P2, P6, P9
- **Amends:** ADR-0068 Sections 4–5 (terminal auth protocol; terminal cert validity)
- **Amends:** ADR-0005 (read caps — adds per-cert-serial scoping)
- **Depends on:** ADR-0057, ADR-0059, ADR-0060, ADR-0067, ADR-0068
- **Resolves:** OQ-34 (emergency grace mode), OQ-35 (per-cert-serial read cap), OQ-37 (decommission semantics), OQ-39 (reference CA), OQ-40 (tactical cert server)

## Context

Three findings from the operational persona simulations (see docs/journeys.md) require amending the terminal authentication model in ADR-0068:

1. **24-hour cert renewal fails in field conditions.** A medic 30+ hours into a patrol with no connectivity cannot renew a 24-hour cert. The current ADR-0068 model denies NFC access on expiry — a patient safety risk.

2. **A terminal cert alone is insufficient protection.** A captured phone with a valid cert gives an adversary full authenticated NFC read access for the cert's remaining validity. A second factor tied to something physical and personal is needed.

3. **The reader must be fully offline-capable for the deployment duration.** The medic app must work for days or weeks without network connectivity. Connectivity is for cert renewal and receipt sync only — never a gate to field functionality.

## Decisions

### Decision 1 — Offline-first principle

The medic reader app must function for the full deployment duration with zero network connectivity. Network access is used opportunistically for:
- Cert issuance at deployment start (once, with connectivity)
- CRL updates (pushed to local cert server when brigade has backhaul)
- Receipt queue sync (queued locally; synced when connectivity allows)

No operation available to a connected medic may be unavailable to an offline medic, except receipt sync and cert renewal beyond the cert's configured validity.

### Decision 2 — Deployment-duration terminal certificates

Terminal certs are issued once at deployment start, with validity equal to the deployment duration plus a 10% buffer (e.g., a 90-day deployment → 99-day cert). The 7-day maximum in ADR-0068 is superseded by this decision.

**Tradeoff accepted:** a captured device with a valid cert is a risk for the cert's full remaining validity. This risk is mitigated by Decision 3 (medic 2FA) and Decision 4 (per-cert-serial revocation), not by short cert windows.

The deployment authority CA issues certs at the pre-deployment enrollment session (same session as tag enrollment). No cert renewal infrastructure is required in the field.

### Decision 3 — Medic 2FA: cert + PIN + tap-of-own-Hexa-tag

The terminal cert alone does not authorise NFC reads. A medic must establish an authenticated session using all three factors:

1. **Terminal cert** (device identity — long-lived, issued at deployment)
2. **PIN** (something the medic knows — 6-digit minimum; set at enrollment)
3. **Tap of the medic's own Hexa tag** (something the medic physically has)

**How the tag factor works:** the medic's own Hexa tag generates a fresh Session Token (128-bit random, per NFC power cycle — ADR-0060 Decision 3) and returns a chip-signed proof: `chip_sig = ECDSA(chip_priv, hash(session_token || timestamp || terminal_cert_serial))`. The app verifies the signature against the medic's enrolled public key (stored in the app at enrollment time). Because the Session Token changes each power cycle, this proof cannot be replayed.

**Consequence:** every medic must be an enrolled Hexa tag wearer, not just the people they treat. This is correct operationally — medics are also casualties in the worst case.

**Session lifecycle:**
- Full 3-factor auth required at session start (shift start, or after session expiry)
- Authenticated session valid for a configurable window (default: 8 hours; configurable by deployment authority, range 1–24 hours)
- Session expires on: timeout reached, app backgrounded for >15 minutes idle (configurable), or explicit lock
- Within an active session: individual NFC reads and casualty log appends require no re-authentication
- Re-authentication required: session expiry, or any Tier 2 operation on a new casualty where the medic hasn't recently authenticated (configurable per deployment)

**Adversary model after this decision:** a captured phone requires the adversary to also have (a) the medic's PIN and (b) the medic's physical Hexa tag. If the medic is KIA with the phone and tag both captured, the deployment authority revokes the terminal cert (see Decision 4); offline tags do not check CRL in real-time, but per-cert-serial read caps (Decision 4) bound exposure.

### Decision 4 — Per-cert-serial read cap and revocation

**Amends ADR-0005.** Read caps are scoped per cert serial number, not only per tag total:

- Each tag maintains a per-cert-serial counter alongside the total counter.
- When a cert is revoked (CRL updated), reads from that cert serial are rejected by any tag that has received the updated CRL.
- For tags that have not yet received the CRL update (fully offline), the per-cert-serial cap limits exposure: once N reads from a given cert serial are recorded, that serial is refused regardless of CRL state.
- **Default per-cert-serial cap:** 50 reads. A medic legitimately treating casualties in a worst-case mass-casualty event would not need more than 50 reads from a single session on a single tag. An adversary making 50 reads of a single captured identity has limited operational value compared to the full per-tag total (500 reads default, ADR-0005).
- The total tag read cap (ADR-0005, 500 reads default) remains in force and is consumed by all reads regardless of cert serial.

### Decision 5 — Decommission: registry-only for Phase A

When a tag is marked decommissioned (lost, KIA, reissued), the enrollment registry is flagged. The physical chip is not locked in Phase A — chip lock requires physical access to an enrollment terminal, which is not available for lost or battlefield-recovered tags.

**Residual risk:** a physically recovered chip from a lost or KIA service member's tag can respond to authenticated readers until (a) its read caps are exhausted, or (b) the deployment authority revokes the associated terminal certs. For KIA tags, the deployment authority should revoke or zero the read cap in the registry as soon as the tag is confirmed unrecoverable.

**Phase B:** chip lock via enrollment terminal (requires physical tag recovery) can be added when the operational workflow supports it.

### Decision 6 — Emergency grace mode

If a medic's session cannot be established because cert validity has expired (legitimate edge case after Decision 2 extends certs to deployment duration, this should be rare), the app falls back to emergency grace mode:

- Single Tier 1 read is permitted without cert authentication.
- The read is flagged in the receipt: `AUTH_MODE: GRACE; REASON: CERT_EXPIRED`.
- Receipt is queued for transmission when connectivity returns.
- Grace mode is per-read: each grace read requires deliberate action by the medic (not automatic).
- Tier 2 reads and casualty log appends are NOT available in grace mode.
- Grace mode is logged locally with timestamp and device ID.

### Decision 7 — Tactical cert server and reference CA

**Tactical cert server:** cert issuance happens at deployment start with connectivity. During the deployment, the cert server on the tactical local network serves only CRL updates and new certs for replacement devices. It does not need internet access — it syncs from brigade backhaul when available. Minimum viable hardware: a Raspberry Pi-class single-board computer running on the unit's local network.

**Reference CA:** Hexatec ships a reference CA implementation — open-source, containerised (Docker), HSM-pluggable via PKCS#11, with:
- Documented key ceremony (dual custodian, HSM-backed root key)
- Pre-configured cert profiles (enrollment terminal, medic reader, medical officer, revocation terminal)
- CRL generation and local distribution
- Configuration guide for military air-gapped environments

This removes the 4–6 week PKI build from every deployment authority's setup task.

### Decision 8 — Medic backup authentication when primary tag is unavailable

**Failure scenario:** the medic's own Hexa tag is destroyed (blast, fire) or lost before shift start, preventing 3-factor session authentication (Decision 3).

**Tier A — Reserve tag (preferred):** each medic is issued and enrolls a reserve Hexa tag at the pre-deployment enrollment session. The reserve is stored separately from the primary (e.g., medic bag rather than neck chain). The medic's enrollment record holds two enrolled chip public keys (primary + reserve). The app accepts a valid chip signature from either. No connectivity is required; the reserve tag is a full substitute for the primary in all respects.

**Tier B — PIN-only degraded session (last resort):** if neither the primary nor the reserve tag is available, the medic may invoke degraded authentication: cert + PIN only, without the tag factor. This requires a deliberate opt-in action (not automatic). Reads in a degraded session are flagged: `AUTH_MODE: DEGRADED; REASON: NO_TAG_FACTOR`. The same receipt-queue rules as grace mode (Decision 6) apply. Tier 2 reads and casualty log appends remain available in degraded mode (unlike grace mode), because the cert + PIN factors are intact; only the physical-token factor is missing.

Degraded mode is a last resort analogous to Decision 6: it preserves patient safety at the cost of weakened attribution. Deployment authority policy may impose additional controls for degraded sessions (e.g., mandatory CRL sync at next connectivity).

**Consequence for enrollment workflow:** pre-deployment enrollment must provision two tags per medic (primary + reserve). The enrollment terminal must support multi-key enrollment for a single identity record. This is a new requirement on ADR-0068's enrollment APDU sequence.

---

## Principle tests

**P1 (break-glass offline; attributable):** Decision 1 (offline-first) guarantees Tier 1 reads are always available without network. Decision 3 (medic 2FA with own tag) produces chip-signed session proofs attributing reads to a specific enrolled medic's physical token. Emergency grace mode (Decision 6) preserves access when even the session cannot be established. ✓

**P2 (tag is cache):** no change to the tag data model. Medic enrollment uses the same tag design as any service member — the tag is the credential, not the device. ✓

**P6 (we route and store, we don't vouch):** deployment authority holds the terminal CA root; Hexatec's reference CA implementation is a tool, not a trust anchor. Hexatec does not hold medic private keys. ✓

**P9 (identity/signing require UV; medical read never does):** Tier 1 emergency read requires 3-factor auth at session start, but not per-read UV — consistent with P9 (medical read never requires UV per-operation). Tier 2 (identity) and casualty log append continue to require per-operation authentication within the session. ✓

---

## Consequences

**What becomes simpler:**
- No cert renewal infrastructure needed in the field (certs last the deployment)
- PKI setup is one-time at deployment start, not an ongoing operational concern
- The compromised-device threat model is materially stronger without cert rotation complexity

**What becomes harder:**
- Every medic must be enrolled as a tag wearer — not just the service members they treat
- Each medic requires two enrolled tags (primary + reserve), increasing tag inventory for medic roles
- The enrollment terminal and registry must support multi-key enrollment (two chip public keys per identity record)
- The reference CA is a software deliverable Hexatec must ship
- The medic reader app must implement the tap-own-tag 2FA flow, which requires the app to store the medic's enrolled public key(s)

**What we give up:**
- Short-window cert expiry as a security control. Revocation + per-cert-serial caps replace it.
