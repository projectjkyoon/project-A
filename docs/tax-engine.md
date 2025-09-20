# Tax Engine

The tax engine is a pure TypeScript package consumed by the API. Each module is deterministic and side-effect free.

## Modules

- `residency.ts`: Evaluates substantial presence, green card, and dual-status rules. Returns a `ResidencyDetermination` struct used to route users to Form 1040 vs 1040-NR and flag FEIE eligibility.
- `income.ts`: Normalizes heterogeneous income entries (W-2, foreign wages, business, passive) into USD using annual average exchange rates.
- `adjustments.ts`: Aggregates above-the-line adjustments such as self-employment tax deduction, IRA, and student loan interest.
- `deductions.ts`: Chooses between standard and itemized deductions based on filing status and amounts.
- `tax-liability.ts`: Applies progressive US tax brackets (2023 baseline) to compute tax and bracket-level breakdowns.
- `feie.ts`: Implements Foreign Earned Income Exclusion (Form 2555) logic with configurable limits and housing caps. Tests cover qualification and capping.
- `ftc.ts`: Skeleton for Foreign Tax Credit (Form 1116) with limitation calculation and carryover stub.
- `credits.ts`: Combines refundable/non-refundable credits from multiple sources.
- `computation.ts`: Orchestrates the full return calculation, returning AGI, taxable income, tax, credits, and summary notes.

## Configuration

- `config/thresholds.ts`: Year-specific FEIE limits, standard deductions, housing caps, and FTC assumptions. Extend this JSON-like structure for new years.
- `config/rates.ts`: Currency conversion using `rates/<year>.json`. Each entry holds `{ currency, usdRate }` describing how many local units equal 1 USD on an average annual basis.

## Testing

Vitest suites cover:

- Residency determinations for green card, nonresident, and FEIE eligibility scenarios.
- FEIE computations (qualification and housing cap behavior).
- Foreign tax credit limitation and carryover.
- Acceptance cases representing the MVP personas (1040-NR treaty, 1040+2555, 1040+1116).

## Extensibility

- Add treaties under `src/data/treaties` and expose helper functions to generate explanatory statements.
- Provide additional rate datasets (spot rates) and update `convertCurrency` to accept date-based lookups.
- Introduce configuration-driven tax brackets for multiple filing statuses and years.
- Integrate NIIT, self-employment tax, and Schedule C/SE worksheets for more precise liabilities.
