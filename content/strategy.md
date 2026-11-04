# Commercial strategy

*Written alongside ADR-0056 (card form factor design), November 2026.*
*Applies to Hexa regardless of which physical form factor is adopted.*

---

## The core strategic insight

Modern military doctrine is pushing hard toward COTS — commercial phones, commercial
tablets, standard laptops for operational use. Every NATO nation is moving this direction
to reduce procurement costs and improve interoperability. The hardware is becoming
commodity. The unsolved problem is: **how do you maintain strong authentication on a
device that was not designed for it?**

CAC and PIV — the current answer — require a physical card reader. That works at a fixed
installation. It fails completely in forward operations, in coalition environments, in any
scenario where the terminal is a commercial Android phone.

**Hexa solves this.** Any NFC-capable phone is a reader. The cryptographic guarantee is
in the tag's JCOP secure element — not in the device. A soldier can use a $300 commercial
handset and still authenticate to PKI-protected systems at military grade, because the
security travels with them on their neck chain.

The procurement framing is not "medical ID." It is:

> *Your soldiers are already using commercial phones in the field. The Hexa tag lets you
> maintain PKI-based authentication, session tokens, and identity verification across any
> NFC device — including allied nation hardware — without issuing specialized readers or
> locking your doctrine to a single device vendor.*

That conversation goes to IT security directorates, CIOs, and NATO interoperability
working groups — not just medical procurement. Those buyers have significantly larger
budgets.

The existing digital architecture already supports this model:
- **ADR-0004** — EAC-style PKI with national roots and short-lived reader certificates
- **ADR-0033** — Post-quantum crypto agility for long-lived keys
- **ADR-0044** — Tag as short-lived session token and cross-app credential provider

The medical ID gets the tag procured and onto the person. The authentication layer is
why it stays funded.

---

## Beachhead and expansion

Each deployment context provides the credibility and certification that opens the next.

```
Military (medical ID + field auth)
    ↓  "certified, proven in field conditions"
Healthcare workers (clinical access + patient record auth + medical ID)
    ↓  "used in hospitals, clinically validated"
Enterprise (corporate identity, door access, session token)
    ↓  "enterprise-grade, interoperable"
Consumer (wearable 2FA, passkey backup, digital ID, payment)
```

**Military is the beachhead**, not the end market. It provides:
- Real operational validation under extreme conditions
- Security certification (CC EAL4+, FIDO2/CTAP2) that opens regulated markets
- Reference customers with international credibility
- Non-dilutive funding (NATO DIANA) that reduces burn while proving the technology

**Consumer is the long-term prize.** The MFA market is $17B today, growing to $40B+.
A YubiKey is a USB dongle you carry separately. Hexa is jewellery-adjacent — something
a person chooses to wear, that also replaces their password manager, emergency medical
card, and authentication token. At $40–60 retail and a $10 manufacturing floor, the
margins support a consumer product.

---

## Manufacturing cost (card form factor, ADR-0056)

Asia-Pacific precision manufacturer. Card lamination from NFC card specialist;
steel tear-away from precision machining shop.

### NFC hex card system (card + 316L grommet + silicone surround)

| Component | 1,000 pcs | 5,000 pcs | 50,000 pcs |
|---|---|---|---|
| Hex laminate body (PC/PETG, die-cut) | $4–8 | $2–5 | $1–2.50 |
| JCOP secure element (NXP SE050 or equiv.) | $5–10 | $3–7 | $2–4 |
| Hex antenna coil (wound, bonded in laminate) | $3–5 | $2–4 | $1–2 |
| Card face engraving / hot-emboss | $1–2 | $0.80–1.50 | $0.50–1 |
| Silicone hex surround | $1–2 | $0.50–1 | $0.20–0.50 |
| 316L grommet (turned, UUID engraved) | $3–5 | $2–4 | $1–2 |
| Press-fit + QC | $0.50–1 | $0.30–0.60 | $0.20–0.40 |
| **Card subtotal** | **$17.50–33** | **$10.60–23.10** | **$5.90–12.40** |

### 316L steel tear-away (full identity fields, no chip)

| Component | 1,000 pcs | 5,000 pcs | 50,000 pcs |
|---|---|---|---|
| 316L hex disc (CNC / stamped at scale) | $7–14 | $4–8 | $1.50–4 |
| Laser engraving (6 fields, both faces) | $1.50–2.50 | $1–2 | $0.60–1.20 |
| Short chain + connector | $0.50–1 | $0.40–0.80 | $0.25–0.50 |
| **Tear-away subtotal** | **$9–17.50** | **$5.40–10.80** | **$2.35–5.70** |

### Chain, packaging, final assembly

| Component | 1,000 pcs | 5,000 pcs | 50,000 pcs |
|---|---|---|---|
| Neck chain (60 cm ball chain + clasp) | $2–4 | $1.50–3 | $0.80–1.80 |
| Assembly + QC | $3–6 | $2–5 | $1–3 |
| **Subtotal** | **$5–10** | **$3.50–8** | **$1.80–4.80** |

### Total system cost per tag

| Volume | Manufacturing cost | Notes |
|---|---|---|
| 1,000 pcs | **$31.50–60.50** | Pilot / PoC range |
| 5,000 pcs | **$19.50–41.90** | First contract range |
| 50,000 pcs | **$10.05–22.90** | National contract range |
| 500,000 pcs | **~$4–8** | Moore's law floor (chip cost dominant driver downward) |

The JCOP chip is the most silicon-intensive component ($3–7 at 5,000 pcs, $2–4 at
50,000 pcs). It benefits from Moore's law and from the global contactless payment card
industry manufacturing billions of NFC secure elements per year. As that market drives
chip prices down, Hexa's BOM gets cheaper without increasing order volume. The steel
and laminate components have a stable cost floor. Long-term, the floor is approximately
$4–8/tag at scale — essentially the cost of steel and labour.

---

## Contract and revenue scenarios

### Scenario A — National pilot: Försvarsmakten (~25,000 personnel)

| Item | Value |
|---|---|
| Tags | 25,000 |
| Procurement price | $180/tag |
| **Contract value** | **$4.5M** |
| Manufacturing (25k pcs ~$18/tag) | $450K |
| **Gross profit** | **~$4M (89%)** |
| Software + support year 1 | ~$500K |
| **Net year 1** | **~$3.5M** |

Replacement cards every 4 years (~6,000 cards/year at $20 service + $8 card wholesale)
add ~$170K annual recurring. The chain and tear-away hardware is retained — only the
NFC card re-enrolls.

### Scenario B — Mid-tier NATO member (UK, France, or Germany — ~150,000 personnel)

| Item | Value |
|---|---|
| Tags | 150,000 |
| Procurement price | $200/tag |
| **Contract value** | **$30M** |
| Manufacturing (150k pcs ~$13/tag) | $1.95M |
| **Gross profit** | **~$28M (93%)** |
| Sales, certification, support, overhead | ~$6M |
| **Net contract** | **~$22M** |

Software platform licensing: $10/tag/year → **$1.5M annual recurring**.

### Scenario C — NATO framework agreement (~350,000 tags, 10% of NATO active duty)

| Item | Value |
|---|---|
| Tags | 350,000 |
| Procurement price | $220/tag |
| **Contract value** | **$77M** |
| Manufacturing (~$11/tag) | $3.85M |
| **Gross profit** | **~$73M** |
| Full operating cost (team, support, infrastructure, legal, certification) | ~$12M |
| **Net** | **~$61M** |

---

## Why long procurement cycles are acceptable

Defense contracts are not annual renewals. A successful framework agreement is 7–10 years,
often with extension options. The sales cost is front-loaded but the revenue is annuity-
style — you spend 3 years winning and then collect for a decade.

This is structurally better than a consumer subscription that must be re-earned every
month. Once you are in the procurement system of a NATO member, you are difficult to
displace.

NATO DIANA non-dilutive funding (€100K–300K, equity-free) is specifically designed to
bridge the gap between prototype and first contract. See `docs/investment.md`.

---

## The consumer 2FA market

The military application proves the technology. The consumer market is where the volume
lives.

**The problem:** MFA adoption is still dominated by SMS OTP (SIM-swap vulnerable) and
app-based TOTP (phone-dependent, lost when phone is lost). Hardware keys (YubiKey,
Titan) are the gold standard but are carried separately, feel like IT department issue,
and have no other function.

**What Hexa does:** you wear your authentication factor. It never runs out of battery.
It works with any NFC phone. It is already on your person in the scenario where you
most need it — when your phone is dead, stolen, or destroyed.

At $40–60 retail (3–6× manufacturing margin at 50,000 pcs), Hexa is competitive with
a YubiKey but it is not a hardware key. It is wearable identity — something a person
chooses to wear that also replaces their password manager, emergency medical card, and
authentication token. That is a different product category with a much larger addressable
market.

**MFA market:** ~$17B in 2023, projected $40B+ by 2030. NFC-capable smartphones:
>4 billion globally. Every smartphone owner is a potential customer for a wearable
NFC authenticator that does not require them to carry a separate device.

---

## Subscription and managed-service model

### Benchmark: Yubico YubiEnterprise Subscription (January 2026)

Yubico moved from one-time hardware sales to a per-user annual subscription.
Current pricing (minimum 500 users):

| Tier | Per user/year | Key inclusions |
|---|---|---|
| Base | $15 | Hardware amortized, 25% annual replacement allowance |
| Advanced | $35 | More form factors, enrollment suite, Customer Success Manager |
| Compliance | $55 | FIDO Pre-reg, air-gapped options, 24/7 support |

The **25% annual replacement allowance** is the critical design element. It covers lost
or stolen keys, employee churn, and form-factor upgrades — no individual purchase order
needed. Yubico sized it at 25% based on enterprise IT churn. Organizations submit
replacement requests against their annual allowance; Yubico ships directly to employees.

This model solved the real enterprise pain point: not the cost of a key, but the
administrative overhead of managing replacements at scale across a distributed population.

### Hexa's structural advantage in subscriptions

A Yubico replacement means shipping a whole new key: $25–50 of hardware cost per event.

A Hexa replacement means shipping only the **NFC card**: $8–15 of cost. The chain and
steel tear-away are durable hardware that stays with the person — potentially for decades.
Only the card refreshes (medical profile updates, chip lifespan, re-enrollment after
transfer).

This means Hexa can offer a **more generous replacement allowance at a lower subscription
price** than Yubico while maintaining better unit economics on each replacement event.

### Reserve forces — the ideal managed-service customer

Regular military units have centralized logistics: a quartermaster manages equipment,
tracks it, replaces it through established procurement channels. They can run their own
replacement program in-house.

**Reserve and volunteer forces cannot.** Hemvärnet (Swedish Home Guard, ~22,000 members),
national guard equivalents, and humanitarian field teams (ICRC, MSF) are geographically
distributed, part-time or volunteer-based, high-turnover relative to regular forces, and
lack the administrative infrastructure to manage hardware lifecycle.

Their annual replacement rate is likely 35–40% — higher than enterprise IT — because:
- Volunteers leave and re-join; tags need deactivation and re-activation
- Tags get damaged in field training
- Members transfer between units (re-enrollment required, hardware may be fine)
- Tags are lost during exercises or deployments

Yubico's 25% allowance is too tight for this population. Hexa's card-only replacement
makes a 40% allowance affordable, and the subscription model removes the administrative
overhead entirely — the organization submits a replacement request; a new card ships
to the soldier or unit armory.

### Proposed Hexa subscription tiers

| Tier | Per tag/year | Replacement allowance | Suited for |
|---|---|---|---|
| **Field** | $12–18 | 40% card replacement | Reserve forces, NGOs, pilot deployments |
| **Defence+** | $25–35 | 40% + re-enrollment service + management console | Regular military, healthcare systems |
| **Sovereign** | $45–55 | Air-gapped PKI option, dedicated CSM, compliance reporting | National procurement, classified environments |

### Swedish military ARR model

| Segment | Tags | Tier | Annual recurring |
|---|---|---|---|
| Hemvärnet (reserve, ~22,000) | 22,000 | Field ($15 midpoint) | **$330K/year** |
| Försvarsmakten active (~25,000) | 25,000 | Defence+ ($30 midpoint) | **$750K/year** |
| **Combined Swedish military** | **47,000** | blended | **~$1.1M/year** |

Initial hardware contract (47,000 tags at $100 blended procurement): **~$4.7M one-time**.

Combined year-1 revenue from Sweden alone: **~$5.8M** (hardware + first year ARR).
From year 2: **~$1.1M ARR** recurring, with card refresh revenue layered on top at the
3–5 year mark (~$30–50 × 10,000–15,000 cards/year at steady state).

### The re-enrollment revenue layer

The card refreshes every 3–5 years — medical profile updates, chip lifespan, unit changes.
At steady state (assume 20% annual card refresh at 50,000 enrolled tags):

- 10,000 cards/year × $35 (card + re-enrollment service) = **$350K/year**

This sits on top of the platform subscription and does not require new hardware sales.
It is the closest equivalent to Yubico's backup key discount program, but with a natural
schedule driven by the medical data lifecycle rather than by employee turnover alone.

---

## Open strategic questions

1. **First customer segment** (OQ-1): Försvarsmakten/MSB, humanitarian (UNHCR/ICRC),
   or consumer? This determines chip certification path, price point, and which DIANA
   challenge area to target.

2. **Authentication product scope**: The COTS military authentication angle (tag as PKI
   credential for commodity devices) is not yet formally scoped as a product. It may
   warrant its own product definition alongside the medical ID.

3. **Platform business model**: Hardware-only vs. hardware + annual platform fee vs.
   freemium consumer with premium tier. The re-enrollment model (replace card every
   3–5 years, retain hardware) creates a natural recurring revenue stream regardless
   of the platform model.

4. **DIANA 2028 application**: Next window ~June–July 2027. Contact LEAD (Linköping)
   now for preparation support. See `docs/investment.md`.
