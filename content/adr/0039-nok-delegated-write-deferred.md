# ADR-0039: NOK delegated write access is not supported in Phase A

- **Status:** Accepted
- **Date:** 2026-11-01
- **Principles:** P5, P6, P9
- **Supersedes:** —

## Context

UX mapping (Q20) surfaced a gap: a soldier's next-of-kin (NOK) or trusted contact may need to
update the emergency contact field on the profile — for example, when a phone number changes
while the soldier is deployed and unable to access their own tag or account.

Without a delegation mechanism, the emergency contact field can only be updated by the soldier
themselves. It will go stale during deployments. This is a known, concrete risk: the field most
likely to change during a deployment (contact number) is the one that is hardest to keep current.

The question is whether to build a delegated write path now, and if so, what it looks like.

**Delegation options identified:**

1. **Tag-level delegation** — the soldier pre-authorises a second key (the NOK's key) to sign
   writes to specific fields. The applet enforces the scope.
2. **Account-level delegation** — the NOK is given write access to a specific scope of the
   owner's account (not the tag directly). A tag write is just a re-export of the account
   record, so account-level delegation covers it.
3. **Mediated delegation** — a unit medical officer or Hexatech operator can update the
   contact field on the soldier's behalf, with a signed delegation from the soldier.
4. **No delegation in Phase A** — the contact field is populated at enrollment and updated
   only by the owner. Staleness is a known acceptable risk in Phase A.

**Why delegation is hard:**

- P9: signing always requires user verification. An NOK signing a profile update needs a
  verified identity and a key. That requires an enrollment process for the NOK — a non-trivial
  UX and infrastructure problem.
- P6: we route and store, we don't vouch. A delegation model requires us to assert that an
  NOK relationship is legitimate, which is a vouching act, or to require the owner to
  cryptographically pre-authorise it, which requires the owner to be online at the time of
  delegation setup (exactly the constraint we are trying to relax).
- P5: owner controls content. Delegation that allows another party to overwrite the owner's
  content without the owner being present is a weakening of P5. The owner's pre-authorisation
  of a delegated key preserves P5 in spirit, but adds complexity that is not yet designed.
- The emergency contact field is the only field where NOK write makes immediate sense. Other
  fields (medications, allergies, conditions) should not be writable by an NOK — those require
  clinical authority or owner verification.

Account-level delegation (Option 2) is architecturally cleaner than tag-level delegation
because it separates the account write path from the tag write path. It also depends on the
identity and account layer, which is not yet specified. Designing tag-level delegation before
the account layer is settled risks building the wrong abstraction.

## Decision

NOK delegated write access is **not supported in Phase A**.

The emergency contact field is populated at enrollment and can only be updated by the owner
(the soldier themselves, via the owner-authentication flow). Staleness during deployment is
acknowledged as a known gap.

The preferred long-term mechanism is **account-level delegation** (Option 2): the owner
pre-authorises a named NOK's verified identity to update a defined scope of the account record.
A tag write is then a re-export of the account, not a direct tag operation. Designing this
requires the account and identity layer to be specified first.

This ADR will be superseded when account-level delegation is designed and accepted.

## Consequences

- Emergency contacts will go stale during deployments. Medics and responders should treat
  the contact field as a best-effort pointer, not a guaranteed current number.
- The enrollment flow should prominently surface this limitation and encourage owners to
  update before and after deployments.
- Unit medical officers can update a soldier's profile on their behalf if the soldier is
  present and initiates the session (standard owner-auth flow, just performed at the MO's
  terminal). This is not delegation — it is a supervised owner action.
- No new infrastructure is required for Phase A. The owner-auth path covers all writes.
- A future ADR introducing account-level delegation must address: NOK identity verification
  standard, scope of delegated write (contact field only vs broader), revocation, and the
  interaction with P9 (can an NOK write while the owner is unconscious?).

## Alternatives considered

**Tag-level delegation (Option 1):** requires applet changes, a second key enrollment UX, and
scope-enforcement logic in the applet. More complex than account-level delegation and harder
to revoke.

**Mediated delegation via unit MO (Option 3):** puts the MO in a vouching role (P6 conflict)
and requires the soldier to pre-sign a standing authorisation — a form of tag-level delegation
with extra steps.

**Build account-level delegation now (Option 2 accelerated):** the account and identity layer
design is not yet settled. Building delegation on top of an unstable base wastes the effort.
Defer until the account layer ADR is accepted.
