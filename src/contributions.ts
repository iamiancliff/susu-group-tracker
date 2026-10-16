import type { SavingsGroup } from "./types";

export function recordContribution(
    group: SavingsGroup,
    memberId: string,
    amount: number
): void {
    const member = group.members.find(
        (member) => member.id.toLowerCase() === memberId.trim().toLowerCase(),
    );

    if (!member) {
        throw new Error("Member not found.");
    }

    if (!Number.isSafeInteger(amount) || amount <= 0) {
        throw new Error("Contribution must be a positive whole amount in KSh.");
    }

    const existing = group.contributions.find(
        (contribution) =>
            contribution.memberId === member.id &&
            contribution.week === group.currentWeek,
    );

    const amountPaid = existing ? existing.amountPaid : 0;
    const amountOwed = group.weeklyContribution - amountPaid;

    if (amount > amountOwed) {
        throw new Error(`Payment exceeds the amount owed: KSh ${amountOwed}.`);
    }

    if (existing) {
        existing.amountPaid += amount;
    } else {
        group.contributions.push({
            memberId: member.id,
            week: group.currentWeek,
            amountPaid: amount,
        });
    }
}

export function getAmountPaid(
    group: SavingsGroup,
    memberId: string,
): number {
    const contribution = group.contributions.find(
        (item) =>
            item.memberId === memberId &&
            item.week === group.currentWeek,
    );

    return contribution ? contribution.amountPaid : 0;
}

export function getAmountOwed(
    group: SavingsGroup,
    memberId: string,
): number {
    return group.weeklyContribution - getAmountPaid(group, memberId);
}