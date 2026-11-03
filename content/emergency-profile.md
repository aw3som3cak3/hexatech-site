# Emergency profile (Tier 1) — draft

Strict profile of HL7 FHIR IPS. Governed by ADR-0015, 0016, 0018 and principles P3, P4, P5, P8.

## Display order (fixed)
1. **Red-flag line** — entries a clinician or owner has *marked* critical (never computed, P8).
2. **Allergies / intolerances** — SNOMED CT closed subset, severity.
3. **Medications** — ATC codes.
4. **Conditions** — SNOMED CT closed subset.
5. **Implants / devices** — closed list.
6. **Emergency contact.**

Allergies precede medications because a medic about to administer something asks "what must I not give?" before "what is already running?"

## Per-category state (mandatory)
| State | Meaning | Display |
|---|---|---|
| `KNOWN_NONE` | Verified none | "None known (verified, date)" |
| `NOT_RECORDED` | No information | "Not recorded" — never "none" |
| `PRESENT` | One or more entries | entries |
| `WITHHELD` | Owner chose not to store | "Withheld by owner" |

## Per-entry fields
`code`, `system`, `severity` (2–3 levels, where relevant), `source` (`CLINICIAN_SIGNED` / `SELF_ASSERTED` / `IMPORTED_CONFIRMED`), `date`, `signature`.

## Excluded (by ADR)
- Blood type (ADR-0014)
- DNR / advance directives (ADR-0015)
- Free text (ADR-0016)

## Encoding
CBOR, integer codes, target ≤ 4 KB. Aligns with mdoc (ADR-0013).

## Open
- Closed lists: governed by Hexatech open standard (ADR-0032).
- Severity scale definition.
- Translation tables per language.
- Red-flag line display spec: maximum entries, empty-state display (disappear or show "No flags"), whether category label is shown alongside each entry.
