import type { Member, Contribution, SavingsGroup } from "./types";
import { isValidAmount, toPesewas, fromPesewas, formatGHS } from "./currency";

// Record full or partial payment for the current week
export function recordContribution(
    group: SavingsGroup,
    memberId: string,
    amount: number,
    week: number = group.currentWeek,
): void {
    const member = group.members.find(
        (m: Member) => m.id.toLowerCase() === memberId.trim().toLowerCase(),
    );

    if (!member) {
        throw new Error("Member not found.");
    }

    if (!isValidAmount(amount)) {
        throw new Error("Contribution must be a positive amount in GHS with at most 2 decimal places.");
    }

    if (week !== group.currentWeek) {
        throw new Error(`Contributions can only be recorded for the active week (Week ${group.currentWeek}).`);
    }

    const existing = group.contributions.find(
        (contribution: Contribution) =>
            contribution.memberId === member.id &&
            contribution.week === week,
    );

    // Calculate balance in pesewas to avoid float rounding issues
    const targetPesewas = toPesewas(group.weeklyContribution);
    const paidPesewas = existing ? toPesewas(existing.amountPaid) : 0;
    const owedPesewas = targetPesewas - paidPesewas;
    const paymentPesewas = toPesewas(amount);

    if (paymentPesewas > owedPesewas) {
        const amountOwedFormatted = formatGHS(fromPesewas(owedPesewas));
        throw new Error(`Payment exceeds the amount owed: ${amountOwedFormatted}.`);
    }

    if (existing) {
        existing.amountPaid = fromPesewas(paidPesewas + paymentPesewas);
    } else {
        group.contributions.push({
            memberId: member.id,
            week,
            amountPaid: amount,
        });
    }
}

// Get total amount paid by a member for the given week
export function getAmountPaid(
    group: SavingsGroup,
    memberId: string,
    week: number = group.currentWeek,
): number {
    const contribution = group.contributions.find(
        (item: Contribution) =>
            item.memberId === memberId &&
            item.week === week,
    );

    return contribution ? contribution.amountPaid : 0;
}

// Get remaining amount owed by a member for the given week
export function getAmountOwed(
    group: SavingsGroup,
    memberId: string,
    week: number = group.currentWeek,
): number {
    const targetPesewas = toPesewas(group.weeklyContribution);
    const paidPesewas = toPesewas(getAmountPaid(group, memberId, week));
    return fromPesewas(targetPesewas - paidPesewas);
}