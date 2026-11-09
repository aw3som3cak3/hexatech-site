# ADR-0057: V2 chip access model — unauthenticated reader policy, UUID persistence, and authentication verification

- **Status:** Proposed
- **Date:** 2026-11-05
- **Principles:** P1, P2, P5, P9, P10
- **Amends:** ADR-0024 (silent chip — deployment-mode exception), ADR-0056 (public partition spec)
- **Dependency for:** ADR-0056 acceptance — ADR-0056 cannot move to Accepted until this ADR resolves

## Context

External design review (November 2026) of ADR-0056 identified three unresolved invariants
that must be formally specified before the card form factor can proceed to production-oriented
design:

1. **Unauthenticated NFC reader policy**: ADR-0056's proposed public partition returns surname
   and a stable UUID to any reader. This conflicts directly with ADR-0024 (silent chip and
   pairwise identifiers), which prevents stable identifier disclosure before authentication.
   A stable UUID at the application layer is a tracking vector even when the ISO 14443 UID
   is randomised.

2. **UUID persistence across card replacement**: the UUID engraved on the tear-away and grommet
   must survive NFC card replacement. If the UUID is derived from the chip's hardware identity,
   re-issuing a card invalidates the physical identification elements — exactly the fallback the
   design relies on. The relationship between chip identity and person identity is unspecified.

3. **User verification for authentication operations**: ADR-0044 enables the tag as a session
   token and cross-app credential provider. P9 requires that identity and signing operations
   always require user verification. A bare NFC tap cannot satisfy this invariant. The
   authentication applet design has not specified how P9 is enforced.

## Decisions

### Decision 1 — Unauthenticated NFC response policy

An unauthenticated scan of the NFC card returns **only a random session identifier** — unique
per connection, not stable across reads. No surname. No stable UUID. This applies in all
operating modes unless Decision 1a applies.

**Rationale:** a stable application-layer UUID is a tracking vector regardless of how the
ISO 14443 UID is managed. ADR-0024 principle applies to the application layer, not only to
the transport-layer UID. Surname is a direct personal identifier and must not be disclosed
without authentication.

**Decision 1a — Sovereign deployment exception:**
A deployment authority (a nation state or military operator) may configure the JCOP applet
to respond with a minimal authenticated set — surname and UUID — to unauthenticated readers.
This is a deployment configuration, not the default. It must be documented as a privacy
exception in the deployment authority's data protection decision. The applet must implement
this as a configurable permission, not a hardwired behaviour.

**Decision 1b — Emergency indicator flag (optional, owner-controlled, sovereign mode only):**
In **sovereign mode**, the owner may configure a single coded flag (`EMERGENCY_INFO_AVAILABLE`,
boolean) readable unauthenticated. This flag does not contain personal data; it signals that
authenticated readers may request emergency information. This is consistent with ADR-0005
(attributable reads) because the read is unauthenticated and produces no audit event — only
authenticated reads do.
Note: in consumer mode this flag is redundant — Tier 1 is returned unauthenticated anyway
per ADR-0061 Decision 1. The flag is only meaningful in sovereign mode, where unauthenticated
readers would otherwise receive only the session token.

**Conflict with ADR-0056 public partition:**
The public partition as specified in ADR-0056 (surname + UUID + red-flag line to any reader)
is not adopted. The public partition is redefined per Decision 1. ADR-0056 Section "Element 1
— NFC hex card — Electronics — Public partition" is amended by this ADR.

**Conflict with ADR-0046:**
The red-flag line free-text conflict identified in ADR-0046 does not arise in the amended
model: no free text is returned unauthenticated. ADR-0046 remains open for the authenticated
tier only.

### Decision 2 — UUID identifies enrollment, not chip hardware

The UUID engraved on the tear-away, grommet, and card face **identifies the enrollment
relationship** (person ↔ Hexa account), not the JCOP chip's hardware identity.

The JCOP chip holds its own hardware certificate and key pair (issued at card manufacture or
personalisation). That hardware identity is used for chip authentication, attestation, and
the PKI chain. It is never exposed externally as the person's UUID, and it changes when a
card is replaced.

The person's UUID is generated once at first enrollment, written into the account record,
and provisioned onto the chip at enrollment. When a replacement card is issued:

1. The enrollment system verifies the person's identity (live biometric, national ID, or
   equivalent — per the deployment authority's re-enrollment policy).
2. The system provisions the **same UUID** onto the new chip.
3. The physical elements (tear-away, grommet) remain valid — their UUID is unchanged.
4. The old chip's hardware identity is revoked in the PKI; the new chip is enrolled.

**Consequence for the enrollment system:** UUID generation and provisioning must be a
single atomic transaction controlled by the enrollment authority. The chip manufacturer
does not assign UUIDs; the enrollment authority does.

**Consequence for the physical design:** the UUID engraved on physical elements is the
enrollment UUID, never a derivation of the chip's hardware serial number or key.

### Decision 3 — User verification for authentication operations

ADR-0044 enables the tag as a session token and cross-app credential provider. This function
involves **identity and signing operations**, which P9 requires to always involve user
verification. A bare NFC tap cannot satisfy this invariant.

Resolution: the JCOP authentication applet (ADR-0044) must enforce the following protocol:

1. The reading device initiates a challenge-response sequence.
2. The applet issues a `USER_VERIFICATION_REQUIRED` response before accepting any signing
   or identity command.
3. The reading device performs local user verification — PIN, biometric, or device-unlock
   credential — and presents a signed attestation (e.g. FIDO2 `UV=1` assertion, or a
   device-signed assertion) to the applet.
4. The applet verifies the attestation against a trusted device key or platform authenticator
   before proceeding with the signing or identity operation.

The specific attestation mechanism (FIDO2 device attestation, Android StrongBox assertion,
iOS Secure Enclave assertion, or a Hexa-defined protocol) must be specified in a subsequent
ADR before the authentication applet is designed.

**Gap in ADR-0044:** ADR-0044 describes the session-token and credential-provider use case
but does not specify how P9 is enforced at the applet level. This ADR establishes the
requirement; the applet specification ADR fulfils it.

**Implication for the COTS authentication proposition:** the authentication flow requires
the reading device to support local user verification and to attest to it. This is available
on modern Android (StrongBox, BiometricPrompt) and iOS (Secure Enclave, LAContext), but
must be validated against target device populations before claiming broad COTS support.
A bare NFC tap to authenticate — without the device verification step — is not compliant
with this ADR.

## Principle tests

**P1 (break-glass offline):** Emergency information is accessible authenticated to any
authorised reader with no network. The unauthenticated session identifier does not expose
medical data but enables a reader to initiate an authenticated session. Offline break-glass
access path is preserved. ✓

**P2 (tag is cache, not identity):** UUID is an enrollment-authority identifier, not derived
from the chip. Destroying and replacing the card does not alter the person's UUID. The account
and physical elements remain valid. The tag can be reissued without data loss. ✓

**P5 (owner controls content, down to zero):** The emergency indicator flag (Decision 1b) is
opt-in. Consumer-mode owners default to randomised identifiers. Sovereign-mode exceptions
are deployment-authority decisions, documented as privacy exceptions, not Hexa defaults. ✓

**P9 (identity/signing require user verification; medical read never does):** Medical read
(Tier 1) is unauthenticated per break-glass design. Authentication and signing operations
require device-attested user verification before the applet responds. ✓

**P10 (adopt existing standards):** FIDO2 UV=1, ISO 7816 applet isolation, and device
attestation frameworks (Android StrongBox, iOS Secure Enclave) are established standards.
Any deviation must be in a subsequent applet-specification ADR. ✓

## Open questions this ADR addresses

- Specifies the unauthenticated reader access policy (Decision 1). Note: the consumer
  mode P1 exception and consumer mode casualty log access are further refined by
  ADR-0061; residual gap tracked as OQ-30 and OQ-31.
- Specifies UUID persistence requirements (Decision 2). Full identifier model defined
  by ADR-0060.
- Opens a new gap: the applet-specification ADR for the authentication function.

## What this ADR does not resolve

1. **Grommet post-fire legibility and retention** — physical testing required (see OQ-26).
2. **First product scope** — emergency medical only vs. field authentication vs. combination
   (see OQ-27).
3. **Two-buyer procurement path** — medical services vs. IT/security (see OQ-28).
4. **Antenna RF validation with metal grommet nearby** — the two-turn coil and 2 cm read
   distance are design targets, not validated properties (see OQ-29).
5. **Applet-level authentication protocol** — a subsequent ADR must specify the exact
   device-attestation mechanism before the authentication applet is designed.
