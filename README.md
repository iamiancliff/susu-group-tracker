# Susu Group Tracker

A command-line application for managing a rotating savings group (susu). The application tracks members, weekly contributions, outstanding balances, and payout rotation.

## Overview

The Susu Group Tracker is designed to help a savings group manage its weekly contributions and distribute the collected pot fairly according to a defined rotation order.

## Features

- Register members with unique names or IDs.
- Record full and partial weekly contributions.
- Track outstanding balances for each member.
- Prevent a week from closing while any member has an unpaid balance.
- Distribute the weekly pot to the next eligible recipient in join order.
- Display contribution reports and payout history.
- Validate inputs and use precise monetary calculations.

## Technology Stack

- TypeScript
- Node.js
- Vitest for automated testing

## Prerequisites

Install Node.js and npm before setting up the project.

## Getting Started

Clone the repository:

```bash
git clone https://github.com/iamiancliff/susu-group-tracker.git
cd susu-group-tracker
```

Install dependencies:

```bash
npm install
```

## Development and Testing

The application and its automated tests are being developed incrementally. Run the following commands as the corresponding functionality is implemented:

```bash
npm run dev
npm test
npm run build
```
## Project Status

Initial project configuration is complete. Core functionality, automated tests, and the command-line interface are under development.

## License

No license has been selected yet.
