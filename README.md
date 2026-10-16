# Susu Group Tracker

A TypeScript application for managing a rotating savings group (**Susu**) using Ghana Cedis (**GHS**). The system accurately manages members, partial and full weekly contributions, outstanding balances, pot payouts, and rotation order.

---

## Features

- **Group Setup**: Initialize a group with a fixed weekly contribution in GHS (e.g., `50.00`).
- **Member Management**: Register members with unique IDs and names. Membership roster is locked once the cycle starts to preserve equal pot distributions.
- **Flexible Contributions**: Record full or partial payments for members in the active week. Payments are aggregated, and overpayments are rejected.
- **Exact Monetary Precision**: All monetary calculations are performed in integer pesewas (cents) to completely eliminate floating-point rounding errors.
- **Strict Week Closure**: A week cannot close if any member owes money. When all members have paid in full, the full pot is paid to the next member in join order.
- **Reports & History**: Full status reporting on active week, who has paid in full, who owes what, and past payout records.
- **Interactive CLI**: Easy-to-use menu-driven terminal interface.

---

## Tech Stack

- **TypeScript** (ES2022 / ESNext)
- **Node.js** (v18+)
- **Vitest** (Automated unit testing)

---

## Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18 or newer) installed.

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/iamiancliff/susu-group-tracker.git
cd susu-group-tracker
npm install
```

### 3. Run the Interactive CLI Application

To start the interactive program in development mode:

```bash
npm run dev
```

To compile TypeScript and run the production build:

```bash
npm run build
npm start
```

---

## Running the Automated Tests

The project includes an extensive test suite with 28 automated unit tests covering all core business rules and edge cases:

```bash
npm test
```

To run tests in watch mode during development:

```bash
npm run test:watch
```

### Key Test Scenarios Covered
- Creating groups with valid GHS amounts and rejecting invalid/negative/high-precision values.
- Case-insensitive duplicate ID and name rejection.
- Prevention of adding members after the cycle has begun.
- Partial contribution accumulation and balance recalculation.
- Rejecting contributions from unknown members and overpayments.
- "Week cannot close" when any member owes an outstanding balance.
- Payout distribution to the correct member in join order and rotation cycling.
- Generation of group contribution status and payout history reports.

---

## Assumptions & Design Notes

For an in-depth breakdown of architectural decisions, domain assumptions, and future enhancements, see [NOTES.md](./NOTES.md).
