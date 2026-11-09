# ADR-0063: Death confirmation — card form factor (amends ADR-0056, ADR-0023)

- **Status:** Accepted
- **Date:** 2026-11-09
- **Principles:** P1, P8, P9
- **Amends:** ADR-0056 (adds death confirmation section)
- **Consistent with:** ADR-0023 (two-key death confirmation — principle preserved)
- **Depends on:** ADR-0062 (tag and tear-away data model)

## Context

ADR-0023 establishes a two-key death confirmation protocol designed around the ring form
factor's physical separation:

1. A medic writes a signed death declaration to the chip on the ring.
2. The ring and core physically separate; a second person scans the core; the core
   verifies the declaration and countersigns.
3. Only the countersigned state triggers casualty reporting.

The card form factor (ADR-0056) has one JCOP tag and a passive steel tear-away with
no chip. The tear-away cannot verify or countersign anything. ADR-0056 does not list
ADR-0023 among the ADRs it conflicts with or supersedes, which means it silently drops
the two-key confirmation mechanism without resolving it.

This ADR explicitly addresses ADR-0023 for the card form factor.

## Decisions

### Decision 1 — The two-key principle is preserved; the enforcement mechanism changes

The two-key principle from ADR-0023 — *"irreversible, attributable, two-person"* — is
preserved for the card form factor. No single person can unilaterally confirm a death.

In the card form factor, the two-key requirement is enforced by the **JCOP applet**, not
by physical separation of two chips:

1. **Person A** (medic or authority) authenticates to the JCOP applet via their device
   credential and writes a signed death declaration:
   `declare_death(signed_payload, person_a_credential)`
   The applet stores the declaration with status `PENDING_COUNTERSIGN`.

2. **Person B** (officer, chaplain, or mortuary specialist) connects to the same tag in
   a separate session and countersigns the declaration:
   `countersign_death(signed_payload, person_b_credential)`
   The applet verifies (a) that Person B's credential encodes a **distinct authority-verified
   human principal identifier** from Person A's — this requires the PKI issuance policy to
   bind one unique subject identity per person, not per device or per role; (b) that Person B
   holds a certificate scoped to an authorised countersign role (e.g., a DV-level terminal
   certificate with a role attribute of MORTUARY, CHAPLAIN, or COMMANDING_OFFICER); and (c)
   that the subject identifier is an identity-verified binding to a natural person, not a
   device or service. Credential number inequality alone is not sufficient — a single
   individual may legitimately hold credentials on multiple devices. The PKI issuance policy
   must enforce one-subject-per-person; this requirement must be carried into the deployment
   authority's CA policy for the DV-level certificates. Status moves to `CONFIRMED`.

3. Only `CONFIRMED` status triggers casualty reporting on sync (unchanged from ADR-0023).

The applet enforces that the same certificate subject cannot perform both steps, and that
each step requires a role-scoped credential. The two-person rule is enforced over verified
human principals, not over device or credential counts.

### Decision 1a — Death confirmation requires sovereign mode

The death confirmation mechanism defined in Decision 1 requires role-scoped terminal
certificates (DV-level, with role attributes). This PKI structure exists only in sovereign
deployments. Consumer mode has no terminal PKI and cannot support role-scoped credentials.

**Death confirmation is a sovereign-mode-only function.** Consumer deployments do not
support two-key death confirmation. If a person enrolled in consumer mode is a casualty,
the reporting chain relies on physical identification (tear-away engraving) and manual
administrative processes. The JCOP applet in consumer mode need not implement the death
confirmation state machine.

### Decision 1b — Tear-away doctrine for the card form factor

ADR-0023 for the ring form factor states that "the core is not released for the wounded —
only for confirmed KIA." This doctrine is restated for the card form factor:

**The tear-away is not pulled from a living person who is wounded.** The tear-away is
pulled only from a person confirmed as KIA. It serves as a physical reporting token for
the confirming authority; the JCOP tag remains on the person's body in all cases.

This preserves the same doctrine intent as ADR-0023 for the two-piece ring form factor.

### Decision 2 — The JCOP applet is the trust anchor for both signatures

In the ring form factor, Chip B was a physically separate secure element that independently
verified Chip A's declaration — the two-chip separation provided hardware-level separation
of the two signing events.

In the card form factor, the single JCOP applet holds both declarations. The separation is
enforced at the applet level: the death declaration state machine is implemented in the
applet and cannot be bypassed without knowledge of both Person A's and Person B's
credentials. The applet must be designed such that the `PENDING_COUNTERSIGN` state cannot
transition to `CONFIRMED` by any single session, even one with a valid deployment credential.

This is a software enforcement, not hardware separation. The implication is that the JCOP
applet security review must specifically audit the death confirmation state machine for
single-actor bypass paths. This requirement must be carried into the applet specification ADR.

### Decision 3 — OQ-21 (death verification relay) is resolved for the card form factor

OQ-21 asked how the death declaration is transferred from Chip A to Chip B in the ring
form factor when the chips do not communicate directly. For the card form factor, this
relay concern does not arise: both signatures are written directly to the same JCOP
applet. OQ-21 remains open for the ring form factor if that design is ever revisited.

### Decision 4 — ADR-0056 is amended to list ADR-0023 as addressed

ADR-0056 silently omitted ADR-0023 from its list of conflicts and dependencies.
This omission is corrected: ADR-0056 Section "Open questions and conflicts" is amended
to reference ADR-0063 as the resolution of the death confirmation mechanism for the card
form factor.

### Decision 5 — OQ-15 (default on or off) remains open

ADR-0023 Decision 1 notes that the position in the death declaration is a deployment
setting with default to be decided (OQ-15). This ADR does not resolve OQ-15. The two-key
mechanism is defined here; whether it is on by default is a deployment authority decision.

---

## Principle tests

**P1 (break-glass offline; attributable):**
Both signers write to the JCOP tag over NFC — no network required. Both declarations are
chip-stored and chip-signed. The final `CONFIRMED` state is an on-chip record verifiable
by any subsequent authenticated reader. When either signer's device syncs, the confirmation
reaches the transparency log. ✓

**P8 (store, communicate, display only; no clinical decision support):**
The JCOP applet records a human-written declaration and enforces a two-signature policy.
It does not detect death, infer it, or compute it. Both declarations are written by humans
who have assessed the situation. P8 is not violated. ✓

**P9 (identity/signing require user verification; medical read never does):**
Both Person A and Person B must authenticate with their deployment credential before
the applet accepts their signature. Death confirmation is a signing operation —
user verification is required from both signers. The function cannot be invoked by an
unauthenticated read. ✓

---

## Consequences

**What becomes possible:**
- The two-key principle from ADR-0023 is preserved in the card form factor without
  requiring a second chip.
- OQ-21 (death verification relay) is resolved for the card form factor.
- ADR-0056 no longer silently ignores ADR-0023.

**What becomes harder:**
- The JCOP applet must implement a state machine for death confirmation that is robust
  against single-actor bypass. This is a non-trivial security requirement for the applet
  specification ADR.
- The separation affordance of the ring form factor (physical act of separating ring and
  core as a deliberate confirmation gesture) is not replicated. The card form factor
  confirmation is a purely digital act — two app sessions. Some operators may consider
  the physical separation gesture to have operational value (irreversibility, ceremony).
  If this matters, a physical one-time element on the tear-away (scored tab, breakable
  seal) could provide the affordance without requiring a second chip. This is deferred
  to the product design process.

**What we give up:**
- Hardware-enforced two-chip separation as the trust boundary. In the card form factor,
  the trust boundary is the applet's state machine, which is software. This is auditable
  but not independently hardware-attested the way two-chip separation was.
