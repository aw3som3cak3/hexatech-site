export type AdrStatus = 'Accepted' | 'Proposed' | 'Superseded'

export interface Adr {
  id: string
  title: string
  status: AdrStatus
  principles: string
  notes?: string
}

export const adrs: Adr[] = [
  { id: '0001', title: 'Tiered data model', status: 'Accepted', principles: 'P1, P3, P5', notes: 'Amended by ADR-0014' },
  { id: '0002', title: 'No personal data on blockchain; transparency log for audit', status: 'Accepted', principles: 'P7, P1', notes: 'Amended by 0027, 0028' },
  { id: '0003', title: 'Secure element on short-range NFC', status: 'Accepted', principles: 'P1, P10' },
  { id: '0004', title: 'EAC-style PKI with national roots and short-lived reader certificates', status: 'Accepted', principles: 'P6, P1, P10', notes: 'Amended by ADR-0033' },
  { id: '0005', title: 'Offline risk caps and attributable reads', status: 'Accepted', principles: 'P1', notes: 'Amended by ADR-0031' },
  { id: '0006', title: 'TEE key broker for Tier 2, HSM-rooted', status: 'Accepted', principles: 'P1, P6', notes: 'Amended by 0027' },
  { id: '0007', title: 'Smartphone app as medic reader', status: 'Accepted', principles: 'P1, P9' },
  { id: '0008', title: 'Casualty log written to the tag', status: 'Accepted', principles: 'P1, P8', notes: 'Amended by ADR-0037' },
  { id: '0009', title: 'One chip, configurable trust anchors', status: 'Accepted', principles: 'P6, P10' },
  { id: '0010', title: 'Owner authentication mandatory; general authenticator optional', status: 'Accepted', principles: 'P2, P5, P9' },
  { id: '0011', title: 'Carrier, not issuer, for national e-ID', status: 'Accepted', principles: 'P6' },
  { id: '0012', title: 'Identity = account + attestations; national ID as recovery anchor', status: 'Accepted', principles: 'P2, P6' },
  { id: '0013', title: 'Attestation formats: ISO mdoc and SD-JWT VC', status: 'Accepted', principles: 'P10' },
  { id: '0014', title: 'Remove blood type from all tiers', status: 'Accepted', principles: 'P3' },
  { id: '0015', title: 'Inclusion rule for emergency fields', status: 'Accepted', principles: 'P3' },
  { id: '0016', title: 'Quiet emergency format as strict IPS profile', status: 'Accepted', principles: 'P4, P10', notes: 'Amended by 0032, 0035' },
  { id: '0017', title: 'Intended purpose: store, communicate, display only', status: 'Accepted', principles: 'P8' },
  { id: '0018', title: 'Owner-controlled content, withheld state, optional escrow', status: 'Accepted', principles: 'P5, P4' },
  { id: '0019', title: 'Consumer-mode Tier 1 signed, not encrypted', status: 'Accepted', principles: 'P1' },
  { id: '0020', title: 'Identity and signing require user verification; medical read does not', status: 'Accepted', principles: 'P9' },
  { id: '0021', title: 'Hexagonal break-in-two form factor', status: 'Superseded', principles: 'P1, P2, P10', notes: 'Superseded by ADR-0022' },
  { id: '0022', title: 'Ring-and-core form factor (partner design)', status: 'Accepted', principles: 'P1, P2, P10', notes: 'Supersedes ADR-0021; amended by ADR-0040' },
  { id: '0023', title: 'Two-key death confirmation', status: 'Accepted', principles: 'P1, P8, P9' },
  { id: '0024', title: 'Silent chip and pairwise identifiers', status: 'Accepted', principles: 'P9, P10' },
  { id: '0025', title: 'Donor status on chip only, signed and expiring', status: 'Proposed', principles: 'P3' },
  { id: '0026', title: 'Tactile critical-allergy mark', status: 'Accepted', principles: 'P3' },
  { id: '0027', title: 'Back end as identity broker: pointers, not copies', status: 'Accepted', principles: 'P5, P6, P7', notes: 'Amends ADR-0002, 0006' },
  { id: '0028', title: 'EU data-intermediary stance and minimisation against compulsion', status: 'Accepted', principles: 'P5, P6, P7' },
  { id: '0029', title: 'MVP scope and deliberate deferrals', status: 'Accepted', principles: 'P1, P4', notes: 'Amended by ADR-0034' },
  { id: '0030', title: 'Sensor pockets optional, not core', status: 'Accepted', principles: 'P8' },
  { id: '0031', title: 'Receipt hashes in the transparency log; content in a mutable store', status: 'Accepted', principles: 'P7, P1, P5' },
  { id: '0032', title: 'Hexatech governs the emergency profile code lists as an open standard', status: 'Accepted', principles: 'P4, P6, P10' },
  { id: '0033', title: 'Post-quantum crypto agility and PQC for long-lived keys', status: 'Accepted', principles: 'P1, P10' },
  { id: '0034', title: 'Phase A technical PoC — HCE software simulation', status: 'Accepted', principles: 'P1, P4, P8, P10' },
  { id: '0035', title: 'Per-envelope signing for Tier 1', status: 'Accepted', principles: 'P3, P4' },
  { id: '0036', title: 'Consumer-mode chip identifier', status: 'Accepted', principles: 'P5, P9' },
  { id: '0037', title: 'Casualty log read access', status: 'Accepted', principles: 'P1, P5, P9' },
  { id: '0038', title: 'Chip A ring-only profile — red-flag line and tag locator only', status: 'Accepted', principles: 'P1, P2, P3, P5' },
  { id: '0039', title: 'NOK delegated write access deferred to account-level delegation', status: 'Accepted', principles: 'P5, P6, P9' },
  { id: '0040', title: 'Physical identification layer — engraving, chain mount, separation doctrine', status: 'Accepted', principles: 'P1, P2, P3, P5' },
]
