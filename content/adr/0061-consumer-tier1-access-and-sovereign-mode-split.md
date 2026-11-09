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
chip's enrollment key pair. This establishes that the data came from a known enrolled chip
and was not modified in transit. It does not establish who read the chip.

This is consistent with ADR-0019 (consumer Tier 1 signed, not encrypted).

### Decision 1a — Explicit P1 exception for consumer mode

P1 requires that "every access must be signed, counted and later logged." Consumer mode
satisfies the break-glass and chip-signing aspects of P1 but **does not satisfy P1's
full attribution and log-delivery requirements**:

| P1 property | Consumer mode | Sovereign mode |
|---|---|---|
| Offline Tier 1 access | ✓ | ✓ |
| Chip-signed response | ✓ | ✓ |
| Reader identity in receipt | ✗ — reader is anonymous | ✓ — terminal cert required |
| Mutually signed receipt | Optional (if reader supports) | Mandatory |
| Log delivery | Best-effort | Required protocol objective |

The gap is accepted for consumer mode in the same spirit that ADR-0036 accepted a
consumer-mode identifier exception: the deployment context (civilian bystander with no
PKI) makes full P1 attribution structurally impossible. The alternative — requiring
reader authentication in consumer mode — defeats break-glass for the target scenario.

This exception must be:
1. Documented in the user-facing deployment guide for consumer deployments.
2. Acknowledged by the deployment authority at enrollment time.
3. Revisited if consumer deployments scale to contexts with accountability expectations
   (e.g., civilian emergency services with device management).

See OQ-30 for residual tracking of this attribution gap.

### Decision 1b — NFC interaction model: app required vs NDEF fallback (open)

iOS devices cannot read a custom ISO 7816 applet response without an installed app that
declares the applet's AID via Core NFC. "Any NFC phone" in consumer mode therefore means
"any phone with the Hexa app installed" if the emergency profile is served only via the
JCOP applet layer.

An NDEF record fallback (readable by any iOS device without an app) would extend reach
to genuine bystander scenarios but introduces different security properties.

This design decision is unresolved. See OQ-32.

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
Consumer Tier 1 is returned to any NFC reader with no network and no terminal cert —
break-glass is preserved. The chip signs the response; the signed payload proves the data
came from a known chip and was not modified. However, the reader remains anonymous; a
chip signature alone is not a "mutually signed, attributable record" in P1's full sense.
This ADR takes an explicit P1 exception for consumer mode (Decision 1a). Sovereign mode
satisfies P1 in full. ⚠ (consumer mode — P1 exception, Decision 1a); ✓ (sovereign mode)

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
- Consumer break-glass works: a bystander using the Hexa app can read Tier 1; bystanders
  without the app require the NDEF fallback path (see OQ-32).
- ADR-0019 is fully implementable in the JCOP applet.
- The P9 contradiction inside ADR-0057 is resolved.

**What becomes harder:**
- The JCOP applet must implement two distinct access paths controlled by a mode flag.
  This adds applet complexity.
- Consumer-mode Tier 1 reads are unauthenticated but signed. The transparency log entry
  is created when a syncing reader or the Hexa app submits it after a consumer-mode read.
  The chip has no network capability and cannot submit log entries directly. Offline
  consumer reads may never reach the log if the reading device does not have the Hexa app
  or never syncs — this residual is accepted and noted in OQ-30.

**What we give up:**
- The simplicity of a single access model for all modes. The applet now has a branch.
