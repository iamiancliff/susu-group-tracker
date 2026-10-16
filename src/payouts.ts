import type { Member, SavingsGroup } from "./types";
import { getAmountOwed } from "./contributions";
import { toPesewas, fromPesewas, formatGHS } from "./currency";

// Close week if everyone paid in full, disburse pot, and advance rotation
export function closeWeek(group: SavingsGroup): string {
    if (group.members.length < 2) {
        throw new Error("At least two members are required to close a week.");
    }

    // Check if any member still owes money for this week
    const unpaidMembers = group.members.filter(
        (member: Member) => getAmountOwed(group, member.id) > 0,
    );

    if (unpaidMembers.length > 0) {
        const details = unpaidMembers.map((member: Member) => {
            const owed = getAmountOwed(group, member.id);
            return `${member.name} owes ${formatGHS(owed)}`;
        });

        return `Week ${group.currentWeek} cannot close. ${details.join(", ")}.`;
    }

    // Calculate total pot and disburse to next member in join order
    const weeklyPesewas = toPesewas(group.weeklyContribution);
    const potPesewas = weeklyPesewas * group.members.length;
    const pot = fromPesewas(potPesewas);
    const recipient = group.members[group.nextPayoutIndex];

    group.payoutHistory.push({
        memberId: recipient.id,
        week: group.currentWeek,
        amount: pot,
    });

    // Advance rotation to next member and move to next week
    group.nextPayoutIndex = (group.nextPayoutIndex + 1) % group.members.length;
    const closedWeek = group.currentWeek;
    group.currentWeek += 1;

    return `Week ${closedWeek} closed. ${formatGHS(pot)} paid to ${recipient.name}.`;
}
