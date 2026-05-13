## Architecture Overview

Three coordinated workstreams: RBAC foundation first (so Tasks 1 & 2 can respect role boundaries), then server-side data layer (Task 1), GDPR edge functions (Task 2), and the Settings module (Task 3).

---

## Task 0 — RBAC Foundation (DB + Context)

**Migration:**
- Extend `app_role` enum: add `'superadmin'`, `'moderator'`.
- Seed `solentebaptiste@gmail.com` as `superadmin` (idempotent).
- New table `admin_invites` (email, role, token, invited_by, expires_at, accepted_at). RLS: superadmin-only.
- New table `admin_audit_log` (actor_id, action, target_user_id, payload, created_at). Append-only, superadmin-read.
- Helper SQL function `public.is_admin_or_higher(uuid)` returning true for `admin|superadmin|moderator`.

**Frontend:**
- `useAdminRole()` hook in `src/admin_portal/core/useAdminRole.ts` exposing `{ role, isSuperAdmin, isModerator, can(action) }`.
- Wired through `AdminContext`.

---

## Task 1 — Server-Side Pagination (Members)

**Edge function `admin-list-users` refactor:**
- Accepts `{ page, page_size, search, stuck_only, step }`.
- Queries `profiles` with `.range()` + `count: 'exact'`, joins auth metadata server-side.
- Filters applied SQL-side (ilike search, 48h stuck, step).
- Returns `{ users, total_count }`.

**MembersView refactor:**
- Drop virtualizer; use 50/page paginated table.
- React Query with `keepPreviousData`, debounced search (300ms).
- Pagination footer: Prev / windowed page numbers / Next + total.
- Keeps Private Wealth light-mode tokens.

---

## Task 2 — GDPR Drawer Actions

**New edge functions:**
- `admin-gdpr-export` (admin+) — aggregates profile + quiz + media + auth metadata → JSON. Audited.
- `admin-gdpr-anonymize` (superadmin only) — scrambles PII (email, names, phone), deletes media rows + storage, sets `account_status='anonymized'`, revokes auth sessions. Preserves IDs and timestamps for accounting. Audited.

**DetailsSlideOver UI:**
- New "Zone de Danger (RGPD)" red-bordered section.
- "Exporter les données (JSON)" → triggers download.
- "Anonymiser & Supprimer" → double-confirm (type email). Hidden for non-superadmin and master admin.

---

## Task 3 — Settings Module

**New files:**
- `src/pages/settings/SettingsPage.tsx` — tabbed container.
- `src/pages/settings/TeamAccessTab.tsx` — admin list table (Email, Role, Last Login) + invite button.
- `src/pages/settings/InviteCollaboratorModal.tsx` — email + role select.

**New edge functions:**
- `admin-list-team` — returns admins/moderators with last_sign_in_at.
- `admin-invite-collaborator` — superadmin only. Inserts `admin_invites` row, returns shareable accept link (no email infra configured — link is toasted/copied).

**Routing & enforcement:**
- New section in admin portal nav `?section=settings`, visible to superadmin only.
- Hide FinOps + Export CSV + Refund button for moderators.
- RGPD anonymize visible only to superadmin.

---

## Technical Notes

- All edge functions: `verify_jwt = false` in config + manual JWT validation + role check inside (matches existing admin-* pattern).
- Audit logging on every privileged action.
- Pagination uses `count: 'exact'` per query — fine at admin scale.

---

## Out of Scope

- Real email delivery for invites (no email domain configured) — token link surfaced via toast/clipboard.
- `/accept-invite` page stubbed minimal.
- Storage bucket cleanup attempted best-effort.
