# Decision log

| ADR | Title | Status | Principles |
|---|---|---|---|
| [0001](0001-tiered-data-model.md) | Tiered data model | Accepted (amended by ADR-0014) | P1, P3, P5 |
| [0002](0002-no-personal-data-on-blockchain-transparency-log-for-audit.md) | No personal data on blockchain; transparency log for audit | Accepted (amended by 0027, 0028, 0031) | P7, P1 |
| [0003](0003-secure-element-on-short-range-nfc.md) | Secure element on short-range NFC | Accepted | P1, P10 |
| [0004](0004-eac-style-pki-with-national-roots-and-short-lived-reader-cer.md) | EAC-style PKI with national roots and short-lived reader certificates | Accepted (amended by 0033) | P6, P1, P10 |
| [0005](0005-offline-risk-caps-and-attributable-reads.md) | Offline risk caps and attributable reads | Accepted (amended by 0031) | P1 |
| [0006](0006-tee-key-broker-for-tier-2-hsm-rooted.md) | TEE key broker for Tier 2, HSM-rooted | Accepted (amended by 0027) | P1, P6 |
| [0007](0007-smartphone-app-as-medic-reader.md) | Smartphone app as medic reader | Accepted | P1, P9 |
| [0008](0008-casualty-log-written-to-the-tag.md) | Casualty log written to the tag | Accepted (amended by 0037) | P1, P8 |
| [0009](0009-one-chip-configurable-trust-anchors-consumer-and-sovereign-m.md) | One chip, configurable trust anchors (consumer and sovereign modes) | Accepted | P6, P10 |
| [0010](0010-owner-authentication-mandatory-general-authenticator-optiona.md) | Owner authentication mandatory; general authenticator optional | Accepted | P2, P5, P9 |
| [0011](0011-carrier-not-issuer-for-national-e-id.md) | Carrier, not issuer, for national e-ID | Accepted | P6 |
| [0012](0012-identity-account-attestations-national-id-recovery.md) | Identity = account + attestations; national ID as recovery anchor | Accepted | P2, P6 |
| [0013](0013-attestation-formats-iso-mdoc-and-sd-jwt-vc.md) | Attestation formats: ISO mdoc and SD-JWT VC | Accepted | P10 |
| [0014](0014-remove-blood-type-from-all-tiers.md) | Remove blood type from all tiers | Accepted | P3 |
| [0015](0015-inclusion-rule-for-emergency-fields.md) | Inclusion rule for emergency fields | Accepted | P3 |
| [0016](0016-quiet-emergency-format-as-strict-ips-profile.md) | Quiet emergency format as strict IPS profile | Accepted (amended by 0032, 0035) | P4, P10 |
| [0017](0017-intended-purpose-store-communicate-display-only.md) | Intended purpose: store, communicate, display only | Accepted | P8 |
| [0018](0018-owner-controlled-content-withheld-state-optional-escrow.md) | Owner-controlled content, withheld state, optional escrow | Accepted | P5, P4 |
| [0019](0019-consumer-mode-tier-1-signed-not-encrypted.md) | Consumer-mode Tier 1 signed, not encrypted | Accepted | P1 |
| [0020](0020-identity-and-signing-require-user-verification-medical-read-.md) | Identity and signing require user verification; medical read does not | Accepted | P9 |
| [0021](0021-hexagonal-break-in-two-form-factor.md) | Hexagonal break-in-two form factor | Superseded by ADR-0022 | P1, P2, P10 |
| [0022](0022-ring-and-core-form-factor.md) | Ring-and-core form factor (partner design) | Accepted (supersedes ADR-0021; amended by 0038, 0040, 0041, 0042, 0045, 0048, 0052) | P1, P2, P10 |
| [0023](0023-two-key-death-confirmation.md) | Two-key death confirmation | Accepted (amended by 0063) | P1, P8, P9 |
| [0024](0024-silent-chip-pairwise-identifiers.md) | Silent chip and pairwise identifiers | Accepted (amended by 0036, 0057) | P9, P10; refines ADR-0003, 0012 |
| [0025](0025-donor-status-on-chip.md) | Donor status on chip only, signed and expiring | **Proposed** (reverted — no customer validation recorded per own criteria) | P3 |
| [0026](0026-tactile-critical-allergy-mark.md) | Tactile critical-allergy mark | Accepted | P3 |
| [0027](0027-identity-broker-pointers-not-copies.md) | Back end as identity broker: pointers, not copies | Accepted (amends ADR-0002, 0006) | P5, P6, P7 |
| [0028](0028-eu-data-intermediary-stance.md) | EU data-intermediary stance and minimisation against compulsion | Accepted | P5, P6, P7 |
| [0029](0029-mvp-scope.md) | MVP scope and deliberate deferrals | Accepted | P1, P4 |
| [0030](0030-sensor-pockets-optional.md) | Sensor pockets optional, not core | Accepted | P8 |

| [0031](0031-receipt-hashes-in-transparency-log-content-in-mutable-store.md) | Receipt hashes in the transparency log; content in a mutable store | Accepted (amends ADR-0002, 0005) | P7, P1, P5 |
| [0032](0032-hexatech-governs-emergency-profile-code-lists-as-open-standard.md) | Hexatech governs the emergency profile code lists as an open standard | Accepted (amends ADR-0016) | P4, P6, P10 |
| [0033](0033-post-quantum-crypto-agility-and-pqc-for-long-lived-keys.md) | Post-quantum crypto agility and PQC for long-lived keys | Accepted (amends ADR-0004; amended by 0064) | P1, P10 |
| [0034](0034-phase-a-technical-poc-hce-software-simulation.md) | Phase A technical PoC — HCE software simulation | Accepted (amends ADR-0029; amended by 0066) | P1, P4, P8, P10 |
| [0035](0035-per-envelope-signing-for-tier-1.md) | Per-envelope signing for Tier 1 | Accepted (amends ADR-0016) | P3, P4 |
| [0036](0036-consumer-mode-chip-identifier.md) | Consumer-mode chip identifier | Accepted (amends ADR-0024) | P5, P9 |
| [0037](0037-casualty-log-read-access.md) | Casualty log read access | Accepted (amends ADR-0008) | P1, P5, P9 |
| [0038](0038-chip-a-ring-only-profile-red-flag-and-locator.md) | Chip A ring-only profile — red-flag line and tag locator only | Accepted | P1, P2, P3, P5 |
| [0039](0039-nok-delegated-write-deferred.md) | NOK delegated write access deferred to account-level delegation | Accepted | P5, P6, P9 |
| [0040](0040-physical-identification-layer-engraving-chain-mount.md) | Physical identification layer — engraving content, chain mount, and separation doctrine | Accepted (amends ADR-0022) | P1, P2, P3, P5 |
| [0041](0041-frame-material-titanium-gr5-and-anodize-finish.md) | Frame material — Grade 5 Titanium, bead-blast ring, anodize-blue core | Accepted (amends ADR-0022, closes OQ-18; amended by 0048, 0051, 0055) | P1, P2, P3 |
| [0042](0042-open-ring-front-face-and-parting-groove.md) | Open ring front face and circumferential parting-line groove | Accepted (amends ADR-0022) | P2, P4, P5 |
| [0043](0043-back-face-operation-instruction-engraving.md) | Back-face operation instruction engraving — TURN ↺ PULL | Superseded by ADR-0050 | P2, P5 |
| [0044](0044-tag-as-session-token-and-cross-app-credential-provider.md) | Tag as short-lived session token and cross-app credential provider | Accepted (amended by 0064) | P1, P6, P9, P10 |
| [0045](0045-correct-chip-a-b-assignment-in-adr-0040.md) | Correct chip A / chip B data assignment stated in ADR-0040 | Accepted (amends ADR-0040) | P1, P2 |
| [0046](0046-proposed-red-flag-free-text-conflicts-with-p4.md) | RED_FLAG as bounded free-text advisory — P4 amended | Accepted (amends P4) | P3, P4, P8, P10 |
| [0047](0047-physical-finish-and-interaction-affordance-refinements.md) | Physical finish and interaction-affordance refinements | Accepted (amended by 0053) | P1, P10 |
| [0048](0048-ring-construction-metal-shell-polymer-electronics-carrier.md) | Ring construction — Ti outer shell with polymer electronics carrier | Accepted (amends ADR-0041, 0022, 0040) | P1, P2, P10 |
| [0049](0049-fire-survivable-uuid-cylinder-and-break-off-element.md) | Fire-survivable UUID cylinder and break-off identity element | Accepted (amends ADR-0040; amended by 0054, 0064) | P1, P2, P3 |
| [0050](0050-separation-instruction-push-turn-pull.md) | Separation instruction corrected to PUSH · TURN ↺ · PULL | Accepted (supersedes ADR-0043) | P2, P5 |
| [0051](0051-adr-0041-corrections-anodize-sequence-mri-safety.md) | Correct ADR-0041 — anodize sequence, colour specification, MRI safety framing | Accepted (amends ADR-0041) | P1, P2, P3 |
| [0052](0052-physical-design-validation-plan.md) | Physical design validation plan — three prototype gates (ring/core form factor) | Accepted (amends ADR-0022, 0041, 0042; card-form-factor counterpart: ADR-0065) | P1, P2, P3 |
| [0053](0053-restore-surname-engraving-on-face-0.md) | Restore SURNAME engraving on ring face 0 — antenna slot removed by ADR-0048 | Accepted (amends ADR-0047 Decision 1) | P2, P3 |
| [0054](0054-uuid-cylinder-and-break-off-material-316l-default.md) | UUID cylinder and break-off plate — 316L stainless as default material | Accepted (amends ADR-0049) | P1, P2, P3 |
| [0055](0055-material-alternatives-evaluated-ti-gr5-confirmed.md) | Field-grade ring material alternatives evaluated — Ti Gr5 outer shell confirmed | Accepted (amends ADR-0041) | P1, P2, P3 |

| [0056](0056-alternative-form-factor-ring-card-token.md) | Alternative physical form factor — NFC hex card + 316L steel tear-away | **Proposed** (pending Gates 1–2; selected for prototyping; amended by 0057, 0062, 0063) | P1, P2, P3 |
| [0057](0057-v2-chip-access-model-uuid-persistence-auth-verification.md) | V2 chip access model — unauthenticated reader policy, UUID persistence, auth verification | Accepted (amends ADR-0024, ADR-0056) | P1, P2, P5, P9, P10 |
| [0058](0058-chip-selection-desfire-ev3-and-jcop-javacard.md) | Chip evaluation and selection — MIFARE DUOX for Hexa, JCOP for Hexa Trinium | Superseded by ADR-0059 | P1, P2, P6, P10 |
| [0059](0059-chip-consolidation-jcop-only.md) | Chip consolidation — JCOP 4 for all Hexa variants; DUOX deferred | Accepted | P1, P2, P6, P10 |
| [0060](0060-identifier-model-enrollment-id-pairwise-rp-id-session-token.md) | Identifier model — enrollment ID, pairwise RP ID, and session token | Accepted | P2, P5, P7, P9 |
| [0061](0061-consumer-tier1-access-and-sovereign-mode-split.md) | Consumer Tier 1 access and sovereign mode split — amends ADR-0057 Decision 1 | Accepted (amends ADR-0057) | P1, P5, P9 |
| [0062](0062-tag-and-tear-away-data-model.md) | Tag and tear-away data model — card form factor | Accepted | P1, P2, P3, P5 |
| [0063](0063-death-confirmation-card-form-factor.md) | Death confirmation — card form factor (amends ADR-0056, ADR-0023) | Accepted (amends ADR-0023, ADR-0056) | P1, P8, P9 |
| [0064](0064-editorial-corrections-0033-0040-0044-0049.md) | Editorial corrections — ADR-0033, ADR-0040, ADR-0044, ADR-0049 | Accepted (amends ADR-0033, 0040, 0044, 0049) | P1, P2, P10 |
| [0065](0065-physical-validation-gates-card-tear-away.md) | Physical validation gates — card + tear-away form factor | Accepted (card-form-factor counterpart to ADR-0052) | P1, P2 |
| [0066](0066-adr-0034-amendment-allow-jcop-physical-spike.md) | Amend ADR-0034 — allow early JCOP physical spike; remove two-chip anti-collision gate | Accepted (amends ADR-0034) | P1, P10 |
| [0067](0067-phase-a-scope-sovereign-only-consumer-deferred.md) | Phase A scope — sovereign mode only; consumer track deferred to Phase B | Accepted (amends ADR-0061; defers OQ-30, OQ-31, OQ-32) | P1, P2, P6 |
| [0068](0068-jcop-applet-specification-phase-a.md) | JCOP applet specification — Phase A (sovereign mode) | **Proposed** | P1, P2, P5, P6, P9, P10 |
| [0069](0069-terminal-session-model.md) | Terminal session model — deployment-duration certs, medic 2FA, offline-first | Accepted (amends ADR-0068 §4–5, ADR-0005) | P1, P2, P6, P9 |
| [0070](0070-operational-states-card-form-factor.md) | Operational states — card form factor (Intact / Separated / Electronic-failure) | Accepted | P1, P2 |

New decision? Copy [template.md](template.md). Never delete an ADR; supersede it.
