export const CURRENCY = "GHS";

// Validate non-negative numbers with at most 2 decimal places (allows 0 for balances)
export function isValidCurrency(amount: number): boolean {
    if (typeof amount !== "number" || isNaN(amount) || !isFinite(amount) || amount < 0) {
        return false;
    }
    const inPesewas = Math.round(amount * 100);
    return Math.abs(amount * 100 - inPesewas) < 1e-4;
}

// Validate strictly positive numbers (used for contributions and weekly targets)
export function isPositiveAmount(amount: number): boolean {
    return isValidCurrency(amount) && amount > 0;
}

// Alias for strictly positive amount validation
export const isValidAmount = isPositiveAmount;

// Convert GHS to integer pesewas (allows 0 for balances)
export function toPesewas(amount: number): number {
    if (!isValidCurrency(amount)) {
        throw new Error("Amount must be a non-negative number with at most 2 decimal places.");
    }
    return Math.round(amount * 100);
}

// Convert pesewas back to GHS decimal value
export function fromPesewas(pesewas: number): number {
    return pesewas / 100;
}

// Format amount as GHS display string
export function formatGHS(amount: number): string {
    return `GHS ${amount.toFixed(2)}`;
}
