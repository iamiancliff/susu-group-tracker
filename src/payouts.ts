
import type { SavingsGroup } from "./types";
import { getAmountOwed } from "./contributions";

export function closeWeek(group: SavingsGroup): string {
    if (group.members.length < 2) {
        throw new Error("At least two members are required to close a week.");
    }

    const unpaidMembers = group.members.filter(
        (member) => getAmountOwed(group, member.id) > 0,
    );

    if (unpaidMembers.length > 0) {
        const details = unpaidMembers.map((member) => {
            return `${member.name} owes KSh ${getAmountOwed(group, member.id)}`;
        });

        return `Week ${group.currentWeek} cannot close. ${details.join(", ")}.`;
    }

    const recipient = group.members[group.nextPayoutIndex];
    const pot = group.weeklyContribution * group.members.length;

    group.payoutHistory.push({
        memberId: recipient.id,
        week: group.currentWeek,
        amount: pot,
    });

    group.nextPayoutIndex =
        (group.nextPayoutIndex + 1) % group.members.length;

    const closedWeek = group.currentWeek;
    group.currentWeek += 1;

    return `Week ${closedWeek} closed. KSh ${pot} paid to ${recipient.name}.`;
}
