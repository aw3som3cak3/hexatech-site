# ADR-0032: Hexatech governs the emergency profile code lists as an open standard

- **Status:** Accepted
- **Date:** 2026-10-31
- **Principles:** P4, P6, P10
- **Supersedes:** —
- **Amends:** ADR-0016
- **Resolves:** Open Question 3

## Context

ADR-0016 mandates closed lists (SNOMED CT subset, ATC subset, closed implant list) for the
emergency profile but assigns no owner. Open Question 3 asked whether a clinical body
(emergency physician network, Försvarsmakten) should own and maintain them.

The case against delegating to the medical community: medical data sharing has failed to
self-organise consistently for decades. National clinical bodies produce nationally-scoped
subsets; WHO and SNOMED International publish base systems but not emergency-profile subsets;
military medical standards (NATO STANAG) are not publicly maintained at the code-list level.
The result is fragmentation. An interoperable worn tag requires a single, consistently versioned
list that all implementations decode identically. No existing body maintains exactly that.

P10 asks whether an established standard exists before we invent. The base coding systems
(SNOMED CT, ATC, ISO device nomenclature) are adopted — we do not replace them. What does not
exist is a maintained, versioned, openly published *profile and augmentation* of those systems
scoped to first-hour emergency care on a chip. The open standard's job is first to adopt from
existing systems, then to augment only where no suitable code exists. That gap is what this ADR
fills.

P6 asks whether this feature requires us to assert a fact about a person. Governing a vocabulary
does not. The list defines valid values; clinicians and owners supply the values. This is the
same position SNOMED International holds to its full system: it publishes codes, it does not
assert that any person has any condition.

## Decision

Hexatech governs the emergency profile code lists as an open standard under a FIDO-style model:

- **Published and versioned.** Lists are published openly with semantic versioning. Any
  implementation can consume them. Breaking changes increment the major version; the chip
  encodes the list version so a reader knows which subset to decode against.
- **Open to contribution.** Proposed additions, removals and corrections are submitted via a
  public process (issue tracker, working group). Hexatech holds merge authority.
- **Clinical advisory input, not clinical governance.** An advisory panel of emergency
  physicians and military medics reviews proposals. They advise; Hexatech decides. This keeps
  the governance structure lean and avoids the coordination failures that come with ceding
  control to a committee.
- **Scope is narrow and explicit.** Inclusion rule per ADR-0015: a code enters the list only if
  (a) it changes what a medic does in the first hour and (b) acting on it when wrong is low-harm.
  The advisory panel applies this test; it does not set policy.
- **Translation tables are part of the standard.** The open standard maintains mappings between
  the codes it carries and adjacent systems: SNOMED CT ↔ ICD-10/11, ATC ↔ national drug
  registries, display labels per language. These mappings are versioned alongside the code lists.
  A reader app can ship the relevant translation tables and display codes in the medic's language
  without any network call. Mappings are best-effort where no official crosswalk exists; the
  source coding system and mapping confidence are recorded so consumers can apply their own
  threshold.

- **Adopt first, augment second.** Existing standards are the basis wherever they cover the
  need: SNOMED CT for conditions and allergens, ATC for medications, ISO/GMDN for devices.
  The open standard selects subsets from these systems as its primary activity. Augmentation —
  adding codes not covered by any existing system (e.g. field-specific military conditions,
  device types absent from standard nomenclatures) — is permitted but requires explicit
  justification that no existing code fits. Augmented codes are published under a Hexatech
  namespace so readers can distinguish standard codes from extensions.

## Consequences

- Interoperability across all Hexa implementations is guaranteed by a single maintained list
  rather than bilateral agreements between nations or clinical networks.
- Hexatech takes on a standards-maintenance obligation. This is a long-term commitment that
  requires resourcing.
- Versioning on the chip means older tags remain readable as long as the reader carries the
  corresponding list version. Sunset policy for old versions is a future decision.
- Nations operating in sovereign mode may extend the list under a namespace prefix; extensions
  are not interoperable outside that nation's reader infrastructure.
- The open contribution model enables clinicians and armed forces to shape the list without
  needing to govern it.

## Alternatives considered

**Delegate to a national clinical body** (e.g. Region Jämtland Härjedalen, Försvarsmakten):
produces a nationally-scoped list, not an internationally interoperable one. Coordination across
buyers from different nations requires a further layer of harmonisation that has no clear owner.

**Delegate to an international body** (e.g. SNOMED International, ICRC): no such body has
expressed interest in this specific scope; timeline to committee consensus is incompatible with
an MVP.

**No fixed list; each deployment chooses its own subset**: breaks interoperability. A medic
reading a foreign tag cannot assume the codes mean the same thing.
