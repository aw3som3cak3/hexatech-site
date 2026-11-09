# ADR-0061: Consumer Tier 1 access and sovereign mode split — amending ADR-0057 Decision 1

- **Status:** Proposed
- **Date:** 2026-11-09
- **Principles:** P1, P5, P9
- **Amends:** ADR-0057 Decision 1 (unauthenticated reader policy)
- **Consistent with:** ADR-0019 (consumer Tier 1 signed, not encrypted)

## Context

ADR-0057 Decision 1 specifies that an unauthenticated NFC scan returns **only a random
session identifier**. The rationale is correct for preventing tracking: a stable
application-layer UUID is a tracking vector even when the ISO 14443 UID is randomised.

However, ADR-0057 Decision 1 creates a break-glass failure for consumer mode.
ADR-0019 established that consumer Tier 1 is readable by any NFC phone with no medic PKI,
because in a mass-casualty or civilian emergency scenario the first responder is a
bystander with an iPhone, not a credentialed military medic. If the chip returns only a
session token to any unauthenticated reader, no consumer Tier 1 data is accessible to
that bystander — which fails P1.

ADR-0057's own P9 test acknowledges the contradiction: *"Medical read (Tier 1) is
unauthenticated per break-glass design."* Decision 1, as written, contradicts this
statement.

The root cause is conflating two distinct access control concepts:

| Concept | Meaning | Sovereign requirement | Consumer requirement |
|---|---|---|---|
| **Terminal authentication** | Does the reader hold a valid terminal certificate? | Required for Tier 2 | Not required for Tier 1 |
| **User verification** | Has the owner verified their identity (PIN/biometric)? | Required for signing/identity | Required for Tier 2+; never for Tier 1 |

ADR-0057 Decision 1 applies terminal authentication as a gate on all data, including Tier 1.
This is correct for sovereign mode (where terminal certs exist) but wrong for consumer mode
(where no such PKI is assumed).

## Decisions

### Decision 1 — Amend ADR-0057 Decision 1: consumer Tier 1 is returned unauthenticated

In **consumer deployment mode**, the JCOP applet responds to a Tier 1 read command without
requiring terminal authentication.

The access sequence for consumer mode:
1. Any NFC reader sends `SELECT applet` → receives session token (unchanged from ADR-0057).
2. Any NFC reader sends `READ_TIER1` → receives the signed Tier 1 emergency profile.

The Tier 1 response is **chip-signed**: the JCOP applet signs the response with the
chip's enrollment key pair. This means every Tier 1 read produces an attributable,
verifiable record — satisfying P1's "mutually signed, attributable record" requirement —
without requiring the reader to hold any credential.

This is consistent with ADR-0019 (consumer Tier 1 signed, not encrypted). ADR-0019 established
the signed-not-encrypted invariant; this ADR specifies the JCOP applet behaviour that
implements it.

### Decision 2 — Sovereign mode: terminal authentication gates Tier 1 and above

In **sovereign deployment mode**, the applet behaviour is unchanged from ADR-0057 Decision 1:
an unauthenticated scan returns only the session token. Terminal authentication (a valid
terminal certificate, per ADR-0004 EAC-style PKI) is required before any data tier is
returned.

The access sequence for sovereign mode:
1. Any reader sends `SELECT applet` → receives session token.
2. Reader presents terminal certificate → `GENERAL AUTHENTICATE` succeeds.
3. Tier 1 emergency profile returned (no owner verification required — P9).
4. Owner verification required for Tier 2 and above.

Sovereign mode is for deployments where every legitimate reader holds a terminal cert —
Försvarsmakten, NATO partners, hospital systems. Consumer-mode bypass is not configured.

### Decision 3 — Deployment mode is an enrollment-time configuration

Consumer vs. sovereign mode is configured by the enrollment authority at personalisation.
It is not owner-selectable post-enrollment without re-enrollment. A single JCOP applet
supports both modes; the mode flag is written into the applet's personalisation data
at enrollment and governs behaviour thereafter.

This preserves P5 at the deployment level (the deployment authority makes a documented
choice about access policy) while preventing individual owners from downgrading sovereign
deployments to consumer access.

### Decision 4 — Tier 2 and above always require owner verification regardless of mode

In both consumer and sovereign mode, any function above Tier 1 requires the owner to
perform user verification (PIN, biometric, or device-attestation per ADR-0057 Decision 3).
This is unchanged. P9's invariant — identity and signing require user verification — holds
across all modes and all tiers above Tier 1.

### Decision 5 — Fix: ADR-0057 "ADR-0046 remains open" is incorrect

ADR-0057 Section Decision 1 states *"ADR-0046 remains open for the authenticated tier
only."* ADR-0046 is Accepted. The red-flag bounded free-text question is resolved.
The reference to ADR-0046 as open in ADR-0057 is an editorial error; this ADR corrects
the record. ADR-0046 is Accepted and applies to the authenticated Tier 1 response.

---

## Principle tests

**P1 (break-glass offline; attributable):**
Consumer Tier 1 is returned to any NFC reader with no network and no terminal cert.
The chip signs the response; every read produces an attributable record. Break-glass access
for the bystander-with-a-phone scenario is preserved. Sovereign mode preserves the
terminal-cert gate for controlled deployments. ✓

**P5 (owner controls content, down to zero):**
Deployment mode is chosen by the enrollment authority, not Hexatec. Within consumer mode,
owner controls what is in Tier 1. ✓

**P9 (identity/signing require user verification; medical read never does):**
Tier 1 medical read in consumer mode: no owner verification required — correct.
Tier 1 medical read in sovereign mode: no owner verification required (terminal cert
only) — correct.
Tier 2 and above: owner verification always required — correct. ✓

---

## Consequences

**What becomes possible:**
- Consumer break-glass works: a bystander with any NFC-capable phone can read Tier 1.
- ADR-0019 is fully implementable in the JCOP applet.
- The P9 contradiction inside ADR-0057 is resolved.

**What becomes harder:**
- The JCOP applet must implement two distinct access paths controlled by a mode flag.
  This adds applet complexity.
- Consumer-mode Tier 1 reads are unauthenticated but signed. The transparency log entry
  is created when either the chip or a syncing reader submits it. Offline consumer reads
  may never reach the log if the reader never syncs — this residual is accepted and noted.

**What we give up:**
- The simplicity of a single access model for all modes. The applet now has a branch.
