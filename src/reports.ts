import type { Member, SavingsGroup } from "./types";
import { getAmountPaid, getAmountOwed } from "./contributions";
import { formatGHS } from "./currency";

// Generate group summary showing active week, member balances, and payouts
export function getGroupReport(group: SavingsGroup): string {
    const lines: string[] = [];

    lines.push(`Group name: ${group.name}`);
    lines.push(`Current week: ${group.currentWeek}`);
    lines.push(`Weekly contribution: ${formatGHS(group.weeklyContribution)}`);
    lines.push(`Members: ${group.members.length}`);
    lines.push("");
    lines.push("Contribution status:");

    if (group.members.length === 0) {
        lines.push("No members registered.");
    } else {
        for (const member of group.members) {
            const paid = getAmountPaid(group, member.id);
            const owed = getAmountOwed(group, member.id);

            if (owed === 0) {
                lines.push(`${member.name}: Paid in full (${formatGHS(paid)})`);
            } else {
                lines.push(
                    `${member.name}: Paid ${formatGHS(paid)}, owes ${formatGHS(owed)}`,
                );
            }
        }
    }

    lines.push("");
    lines.push(getPayoutReport(group));

    return lines.join("\n");
}

// Generate payout history log
export function getPayoutReport(group: SavingsGroup): string {
    if (group.payoutHistory.length === 0) {
        return "Payout history:\nNo payouts have been made yet.";
    }

    const lines = ["Payout history:"];

    for (const payout of group.payoutHistory) {
        const member = group.members.find(
            (item: Member) => item.id === payout.memberId,
        );

        const recipientName = member ? member.name : payout.memberId;

        lines.push(
            `Week ${payout.week}: ${formatGHS(payout.amount)} paid to ${recipientName}`,
        );
    }

    return lines.join("\n");
}
