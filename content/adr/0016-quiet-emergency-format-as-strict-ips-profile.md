# ADR-0016: Quiet emergency format as strict IPS profile

- **Status:** Accepted (amended by ADR-0032, ADR-0035)
- **Date:** 2026-10-05
- **Principles:** P4, P10

## Context
Clinicians record inconsistently (cf. Kry); medics need glanceable data; cross-border reading needs translation.

## Decision
- Strict profile of HL7 FHIR International Patient Summary.
- Fixed order: red-flag line, medications, conditions, implants, contact.
- Closed lists: SNOMED CT subset (conditions/allergens), ATC (drugs); severity 2–3 levels.
- No free text in Tier 1.
- Explicit states per category: known-none / not recorded / present / withheld-by-owner.
- Source and date on every entry.
- CBOR with integer codes.

## Consequences
Readable in seconds, translatable, compact. Mapping from messy source records is the hard part; mapping proposals require human confirmation (also supports P8).

## Alternatives considered
Full IPS (too broad); free-text card (inconsistent, untranslatable).
