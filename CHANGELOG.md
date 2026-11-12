# Changelog

All notable changes to this project are documented here.

## [Unreleased] — Manage / Edit / Delete actions for registration entities

### Added

- **Businesses (Super Admin)** — Edit and Delete actions per row.
  - Edit opens a popup (pre-filled) that updates the business `name` and `location`.
  - Delete removes only the Business row. Linked rows (branches, subscriber accounts, products,
    suppliers, business subscriptions) are **orphaned** via the DB's `SET NULL` constraints —
    they are never cascade-deleted.
- **Subscriber Accounts (Super Admin)** — Status column, plus Edit and Manage actions per row.
  - Edit updates FN / LN / email and business assignment.
  - Manage opens a radio popup: **Deactivate / Delete** (or **Reactivate / Delete** when the
    account is already deactivated).
  - Delete confirmation shows how many other subscribers remain linked to the same business,
    with a clear warning when this is the last one.
- **Manage User (HQ Admin)**:
  - Branches table: Edit + Delete wired to real data. Deletion uses the **branch cascade** (below).
  - Branch Managers table: actions limited to Edit + Manage; a Status column was added.
    Manage supports deactivate/reactivate/delete, and the delete confirmation shows how many
    managers remain linked to the same branch.
- **Manage Users (Branch Manager)** — Cashier table actions limited to **Edit + Manage**
  (View / direct Delete removed; delete is reached through the Manage radio popup).
  - Editing a cashier updates FN / LN / email and branch assignment.

### Changed (deletion semantics — please read)

- **Branch cascade delete**: A raw branch delete was impossible while the branch was referenced
  by the `BranchWideOfferBranches` junction (`RESTRICT`) and would have been surprising elsewhere.
  The new cascade **deletes** the branch's `BranchInventoryItem` rows and `BranchWideOfferBranches`
  junction rows, then **orphans** (SET NULL) `User.branchId` and `Transaction.branchId`. The
  `BranchWideOffer` records themselves are preserved.
- **Cashier / manager / subscriber account delete**: Deleting an account only deletes the `User`
  row. Their historic transactions are preserved — the DB `SET NULL`s `Transaction.userId`, so
  transactions are not cascade-deleted.
- **Deactivated accounts** are now rejected at login (previously only `UNVERIFIED` accounts were
  blocked, which made deactivation meaningless).

### Backend endpoints added (`/api/v1/registration`)

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| GET | `/businesses/:businessId` | SUPER ADMIN | Single business (edit/delete prefill) |
| PATCH | `/businesses/:businessId` | SUPER ADMIN | Update name/location |
| DELETE | `/businesses/:businessId` | SUPER ADMIN | Delete business (no cascade) |
| GET | `/branches/:branchId` | HQ ADMIN | Single branch (edit/delete prefill) |
| PATCH | `/branches/:branchId` | HQ ADMIN | Update location/account limit |
| DELETE | `/branches/:branchId` | HQ ADMIN | Cascade delete (see above) |
| GET | `/subscribers/:userId` | SUPER ADMIN | Single subscriber |
| GET | `/subscribers/:userId/delete-context` | SUPER ADMIN | Account + remaining-subscriber count |
| PATCH | `/subscribers/:userId` | SUPER ADMIN | Update subscriber |
| DELETE | `/subscribers/:userId` | SUPER ADMIN | Delete subscriber |
| GET | `/managers/:userId` (+ `/delete-context`) | HQ ADMIN | Single manager |
| PATCH | `/managers/:userId` | HQ ADMIN | Update manager (business-scoped) |
| DELETE | `/managers/:userId` | HQ ADMIN | Delete manager |
| GET | `/cashiers/:userId` | BRANCH MANAGER | Single cashier |
| PATCH | `/cashiers/:userId` | BRANCH MANAGER | Update cashier (business-scoped) |
| DELETE | `/cashiers/:userId` | BRANCH MANAGER | Delete cashier |
| PATCH | `/account/:userId/status` | all admins | Deactivate / reactivate below-tier account |
