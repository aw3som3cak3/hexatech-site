# ADR-0044: Tag as short-lived session token and cross-app credential provider

- **Status:** Accepted
- **Date:** 2026-11-04
- **Principles:** P1, P6, P9, P10
- **Extends:** ADR-0010 (owner authentication)

## Context

The army reserve identified a second operational need: soldiers carry their Hexa tag at all times,
and their phones run multiple defence apps (the Hexa medic app, fire-control apps, logistics apps).
They need a single hardware credential that authenticates them into all of those apps without
passwords and without a network connection. When the tag is physically separated from the phone
the session should expire.

The FIDO2 applet specified in ADR-0010 supports challenge–response authentication. This ADR
extends that capability into a short-lived session-token model — analogous to an OAuth access
token, but with the chip as the signing authority and renewal requiring physical re-tap.

This is a clean separation from the medical data layer: the token mechanism uses the owner
signing key, not the Tier 1 or Tier 2 medical profile. No health data is involved in
authentication flows.

## Decision

**1. Session token model**

On tap, the phone presents a nonce challenge to the FIDO2 applet. The chip signs it with the
owner key and returns a compact signed assertion (CBOR or JWT claim set). The phone derives a
short-lived session token from this assertion.

Default session lifetime: **10–15 minutes**, configurable per deployment. When the token
approaches expiry, the app prompts a re-tap to renew. No re-tap within the window → session
expires → app locks.

The token is hardware-bound: it cannot be forged without physical access to the chip. Renewal
requires physical tag presence. This achieves the operational intent — "logged in while tag is
present, locked when tag is away" — without requiring NFC proximity detection (which NFC does
not support beyond ~4 cm).

**2. Offline operation**

Token issuance and renewal are fully offline. The chip signs locally; no server round-trip is
required. The session token carries a signed timestamp ceiling (the latest date the chip has
seen, per ADR-0004) and an expiry offset. Verifiers check the signature, not a network revocation
list.

**3. Cross-app credential provider**

The Hexa app registers as a platform credential provider:
- **Android:** via the [Credential Manager API](https://developer.android.com/training/sign-in/credential-manager) (Android 14+, API 34)
- **iOS:** via `ASAuthorizationController` with a custom credential type

Third-party defence apps (fire control, logistics, command-and-control) can request a Hexa
session assertion through the platform API. The Hexa app mediates the tap and returns a signed
token scoped to the requesting app's identity (relying-party ID). The user sees one prompt, one
tap, one credential.

**4. Scoping**

Each token is bound to a relying-party ID (the requesting app's identifier). A token issued for
the fire-control app is not valid for the medic app, and vice versa. The chip signs the
relying-party ID as part of the assertion payload (standard FIDO2 RP binding).

**5. Revocation**

Short token lifetime is the primary revocation mechanism. For stronger revocation (e.g. lost
phone), the chip's read counter (ADR-0005) provides a weak bound: a compromised session cannot
survive longer than one token lifetime. Full revocation requires the owner to present the tag and
trigger a key rotation, which invalidates all outstanding tokens.

**6. Future platform direction**

This positions Hexatech as an authentication platform for defence applications, independent of
the medical data layer. The same chip, same FIDO2 applet, same enrollment flow — apps that
adopt Hexa authentication gain hardware-bound credentials without custom hardware.

## Consequences

- Medic app can lock automatically after the token lifetime without network connectivity.
- Same authentication hardware works across all enrolled apps on the phone.
- Carrying the tag becomes the natural unlock gesture — reinforces daily carry.
- Third-party apps gain FIDO2-grade hardware authentication without issuing their own hardware.
- Token lifetime must be tuned per deployment: short (5 min) for high-security apps, longer (30 min)
  for lower-friction use cases.
- Cross-app credential provider requires platform-specific integration work (Android 14+ for
  Credential Manager; iOS requires a custom extension).
- A stolen phone with an active session remains authenticated until expiry — acceptable for
  10–15 minute windows; not acceptable without physical lock or biometric on the phone itself.

## Alternatives considered

**Bluetooth proximity lock:** Maintains a persistent connection and locks when RSSI drops.
Rejected: adds Bluetooth dependency, increases attack surface, and requires a separate BLE
antenna on the chip. NFC with session expiry achieves equivalent operational result.

**Password / PIN per app:** Standard alternative. Rejected for field use: gloves, stress and
multiple apps make password entry impractical. Single hardware tap is more reliable.

**Always-on NFC polling:** Phone continuously polls for tag presence, locks immediately on
separation. Rejected: NFC polling at ~4 cm is effectively a contact requirement, not proximity;
battery cost is prohibitive; OS APIs do not expose continuous NFC polling to third-party apps.
