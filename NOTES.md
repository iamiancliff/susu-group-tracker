# Susu Group Tracker - Design Decisions & Assumptions

## 1. Overview
This document outlines the core domain assumptions, architectural decisions, and potential future improvements for the Susu Group Tracker application.

---

## 2. Assumptions & Business Decisions

### A. Currency & Money Handling (Rule #2: Exact Calculations)
- **Currency**: Ghana Cedis (**GHS**).
- **Precision**: GHS consists of Cedis and Pesewas (1 Cedi = 100 Pesewas, represented with up to 2 decimal places).
- **Rounding Strategy**: Standard IEEE-754 floating-point numbers in JavaScript (`number`) introduce precision inaccuracies (e.g., `0.1 + 0.2 !== 0.3`). To eliminate any risk of rounding errors:
  - All input amounts are validated to ensure they do not exceed 2 decimal places.
  - All mathematical operations (addition of contributions, deduction of balances, and multiplication for total pots) are computed in integer minor units (**pesewas**).
  - Amounts are converted back to formatted currency strings (`GHS XX.XX`) only at display time.

### B. Member Registration & Roster Locking
- **Join Order as Payout Priority**: The rotation order is strictly determined by the chronological order in which members are registered (`joinOrder: 0, 1, 2, ...`).
- **Roster Locking Once Cycle Starts**: In a rotating savings group (Susu/Chit fund/Esusu), the weekly pot is defined as `weeklyContribution * memberCount`. If a member were added mid-cycle, either previous payouts would be underfunded or earlier recipients would receive less than later ones. Therefore, new member additions are locked once contributions for Week 1 have commenced.
- **Uniqueness**: Both Member IDs and Member Names must be unique (compared case-insensitively, e.g., "Ama" and "ama" are treated as duplicates).
- **Minimum Roster**: A minimum of 2 members is required before a week can be closed and payouts distributed.

### C. Contributions & Balances
- **Active Week Only**: Contributions can only be made for the active week (`group.currentWeek`). Past closed weeks cannot receive new payments, and future unreached weeks cannot be pre-paid.
- **Partial Payments**: Members are allowed to pay in installments within the active week. Payments are aggregated into the member's weekly total.
- **Overpayment Prevention**: An error is thrown if a member attempts to pay more than their remaining outstanding balance for the current week.

### D. Payout Rotation & Cycles
- **Week Closure Criteria**: A week will strictly refuse to close if even a single member has an unpaid balance. The system reports exactly who owes and how much.
- **Full Rotation Cycling**: When every member in the group has received a payout (one full cycle of $N$ weeks for $N$ members), the rotation index cleanly loops back to the first member (`index 0`), allowing subsequent savings cycles to continue seamlessly.

---

## 3. Architecture & File Breakdown

The project follows a modular, single-responsibility architecture in TypeScript:

| File | Purpose |
| :--- | :--- |
| `src/types.ts` | TypeScript domain interfaces (`Member`, `SavingsGroup`, `Contribution`, `Payout`). |
| `src/currency.ts` | Currency conversion and math helpers using integer pesewas to prevent floating-point errors. |
| `src/group.ts` | Group creation, validation, and member registration. |
| `src/contributions.ts` | Recording partial/full payments, calculating amounts paid, and amounts owed. |
| `src/payouts.ts` | Week closure logic, payout eligibility check, pot distribution, and rotation. |
| `src/reports.ts` | Formatting status reports (balances, week status, and payout history). |
| `src/index.ts` | Interactive command-line interface (CLI) with user menu. |

---

## 4. What I Would Improve With More Time

1. **Persistent Storage (Database / File Persistence)**:
   - Currently, state lives in memory for the duration of the CLI session.
   - I would introduce a repository layer (e.g., SQLite via Prisma or simple JSON file persistence) so state is preserved across application restarts.

2. **Multi-Cycle History & Advanced Susu Rules**:
   - Explicit cycle tracking (e.g., Cycle 1, Cycle 2) with cycle completion summaries.
   - Configurable rotation strategies (e.g., auction-based or need-based rather than strictly chronological).

3. **Penalty & Default Management**:
   - Configurable late-payment fees or automated reminders for members with outstanding balances.

4. **REST API / Webhook Notifications**:
   - Wrap the core domain logic with a lightweight Express/Fastify API.
   - Send SMS/WhatsApp alerts (common in West African Susu groups) when a week closes or when a member's payout is disbursed.
