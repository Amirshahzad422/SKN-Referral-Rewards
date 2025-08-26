# SKN Appwrite Spec (Free Plan Compatible)

This is the authoritative backend spec for SKN on Appwrite Cloud Free. It lists exact lengths/ranges for every field and how to operate within Free-plan constraints.

---

## 0) Free Plan Operating Rules
- Functions: use HTTP-triggered functions only; treat cron/queues as unavailable. Chain actions in a single request (create → propagate → check rewards). Keep runtime light (128–256 MB) and under ~10s.
- Database: create only necessary indexes; keep documents lean; avoid large JSON.
- Storage: limit files to ≤2 MB (client-compress screenshots). Allowed: jpg, jpeg, png.
- Realtime: optional; prefer polling if you hit limits.
- Projects: one dev (localhost:3000) + one prod domain. Export data manually for backups.

---

## 1) Database (Database ID: `skn_main`)
Below, every attribute includes Required, Indexed, and a precise Size/Range.

### 1.1 Collection: `users`
| Field | Type | Required | Indexed | Size/Range | Enum | Notes |
|------|------|----------|---------|------------|------|-------|
| authId | string | yes | unique | max 36 | - | Appwrite account ID |
| username | string | yes | unique | min 3, max 32 | - | lowercased unique handle |
| email | string | yes | unique | max 254 | - | RFC length |
| phone | string | yes | yes | max 15 | - | E.164 |
| fullName | string | yes | no | max 100 | - | - |
| sponsorId | string | no | yes | max 36 | - | nullable |
| underUserId | string | yes | yes | max 36 | - | parent user id |
| leg | enum | yes | yes | - | left, right | placement leg |
| status | enum | yes | yes | - | active, suspended, pending | account state |
| createdAt | datetime | yes | yes | - | - | ISO8601 |
| lastLoginAt | datetime | no | yes | - | - | nullable |
| profileImage | string | no | no | max 36 | - | storage fileId, nullable |

### 1.2 Collection: `tree_nodes`
| Field | Type | Required | Indexed | Size/Range | Enum | Notes |
|------|------|----------|---------|------------|------|-------|
| userId | string | yes | unique | max 36 | - | owner (users.$id) |
| parentUserId | string | no | yes | max 36 | - | nullable (root) |
| leg | enum | yes | yes | - | left, right | position under parent |
| ancestors | array<string> | yes | array | each item max 36; max items 50 | - | top→bottom path |
| depth | integer | yes | yes | 0..50 | - | depth of node |
| leftChildId | string | no | no | max 36 | - | nullable |
| rightChildId | string | no | no | max 36 | - | nullable |
| createdAt | datetime | yes | yes | - | - | - |

### 1.3 Collection: `user_stats`
| Field | Type | Required | Indexed | Size/Range | Enum | Notes |
|------|------|----------|---------|------------|------|-------|
| userId | string | yes | unique | max 36 | - | user ref |
| leftCount | integer | yes | no | 0..10,000,000 | - | - |
| rightCount | integer | yes | no | 0..10,000,000 | - | - |
| totalCount | integer | yes | yes | 0..20,000,000 | - | left+right |
| directCount | integer | yes | no | 0..1,000,000 | - | directs only |
| currentRank | string | yes | yes | max 20 | - | e.g., "7 Star" |
| highestRank | string | yes | no | max 20 | - | - |
| totalEarnings | integer | yes | no | 0..10,000,000,000 | - | Rs |
| lastUpdated | datetime | yes | yes | - | - | - |

### 1.4 Collection: `pins`
| Field | Type | Required | Indexed | Size/Range | Enum | Notes |
|------|------|----------|---------|------------|------|-------|
| code | string | yes | unique | min 8, max 16 | - | recommend 12 |
| status | enum | yes | yes | - | unused, used, disabled | - |
| type | enum | yes | no | - | free, paid, bonus | - |
| createdBy | string | yes | no | max 36 | - | admin id |
| usedByUserId | string | no | yes | max 36 | - | nullable |
| usedAt | datetime | no | yes | - | - | nullable |
| expiresAt | datetime | no | yes | - | - | nullable |
| createdAt | datetime | yes | yes | - | - | - |

### 1.5 Collection: `reward_tiers`
| Field | Type | Required | Indexed | Size/Range | Enum | Notes |
|------|------|----------|---------|------------|------|-------|
| rank | string | yes | no | max 20 | - | e.g., "10 Star" |
| order | integer | yes | unique | 1..100 | - | tier sort |
| threshold | integer | yes | no | 0..1,000,000 | - | team size |
| bonusRs | integer | yes | no | 0..10,000,000,000 | - | Rs |
| description | string | no | no | max 500 | - | nullable |
| isActive | boolean | yes | yes | - | true/false | - |

### 1.6 Collection: `user_rewards`
| Field | Type | Required | Indexed | Size/Range | Enum | Notes |
|------|------|----------|---------|------------|------|-------|
| userId | string | yes | yes | max 36 | - | - |
| tierOrder | integer | yes | yes | 1..100 | - | FK: reward_tiers.order |
| rank | string | yes | no | max 20 | - | - |
| bonusRs | integer | yes | no | 0..10,000,000,000 | - | - |
| status | enum | yes | yes | - | pending, paid, reversed | - |
| awardedAt | datetime | yes | yes | - | - | - |
| paidAt | datetime | no | yes | - | - | nullable |
| eventId | string | yes | unique | max 64 | - | idempotency |
| notes | string | no | no | max 500 | - | nullable |

### 1.7 Collection: `payments`
| Field | Type | Required | Indexed | Size/Range | Enum | Notes |
|------|------|----------|---------|------------|------|-------|
| userId | string | yes | yes | max 36 | - | - |
| method | enum | yes | no | - | easypaisa, jazzcash, bank | - |
| amount | integer | yes | no | 1..10,000,000 | - | Rs |
| trxId | string | yes | unique | max 100 | - | - |
| accountNumber | string | yes | no | max 30 | - | - |
| screenshotFileId | string | yes | no | max 36 | - | storage file id |
| status | enum | yes | yes | - | submitted, approved, rejected | - |
| reviewedBy | string | no | no | max 36 | - | nullable |
| reviewedAt | datetime | no | yes | - | - | nullable |
| notes | string | no | no | max 500 | - | nullable |
| createdAt | datetime | yes | yes | - | - | - |

### 1.8 Collection: `withdrawals`
| Field | Type | Required | Indexed | Size/Range | Enum | Notes |
|------|------|----------|---------|------------|------|-------|
| userId | string | yes | yes | max 36 | - | - |
| amount | integer | yes | no | 1..10,000,000 | - | Rs |
| method | enum | yes | no | - | easypaisa, jazzcash, bank | - |
| accountDetails | string | yes | no | max 300 | - | - |
| status | enum | yes | yes | - | pending, approved, rejected | - |
| processedBy | string | no | no | max 36 | - | nullable |
| processedAt | datetime | no | yes | - | - | nullable |
| notes | string | no | no | max 500 | - | nullable |
| createdAt | datetime | yes | yes | - | - | - |

### 1.9 Collection: `events`
| Field | Type | Required | Indexed | Size/Range | Enum | Notes |
|------|------|----------|---------|------------|------|-------|
| type | string | yes | yes | max 32 | - | placement, reward_award, pin_use |
| refId | string | yes | no | max 64 | - | related id |
| payload | string(JSON) | yes | no | max 20,000 | - | keep small on Free |
| idempotencyKey | string | yes | unique | max 64 | - | dedupe |
| userId | string | no | yes | max 36 | - | nullable |
| createdAt | datetime | yes | yes | - | - | - |

---

## 2) Indexes (minimum viable for Free)
- users: authId(unique), username(unique), email(unique)
- tree_nodes: userId(unique), parentUserId, depth
- user_stats: userId(unique)
- reward_tiers: order
- user_rewards: userId + tierOrder (compound), eventId(unique)
- pins: code(unique), status
- payments: trxId(unique), userId, status
- withdrawals: userId, status
- events: idempotencyKey(unique), type

Only add more if queries require them.

---

## 3) Functions (HTTP only)
1) createAccountWithPin
- Validates pin → creates user + tree node → updates counts for all ancestors → checks & awards rewards → returns summary.

2) approvePayment (admin)
- Approves/Rejects payment; on approve, issues pin(s).

Optional later: recomputeStats (admin-only HTTP) to heal stats.

---

## 4) Storage
- Bucket `payments`: jpg/jpeg/png; max 2 MB per file; private to owner + admins.
- Bucket `profiles`: jpg/jpeg/png; max 2 MB per file; public read optional.

---

## 5) Notes for Implementation
- Use idempotency on all writes (`events.idempotencyKey`).
- Cap `ancestors` at 50 to bound update cost on Free tier.
- Keep status transitions single-write per operation to minimize function time.
- Prefer numeric integers for balances/bonuses (Rs) to avoid float issues.

This spec supersedes any previous guideline versions. Copy these values exactly into Appwrite Console when creating attributes. 