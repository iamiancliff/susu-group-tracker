import type { Member, SavingsGroup } from "./types";
import { isValidAmount } from "./currency";

// Initialize a new group with a fixed contribution starting at week 1
export function createGroup(name: string, weeklyContribution: number): SavingsGroup {
    const groupName = name.trim();

    if (!groupName) {
        throw new Error("Group name is required.");
    }

    if (!isValidAmount(weeklyContribution)) {
        throw new Error(
            "Weekly contribution must be a positive amount in GHS with at most 2 decimal places.",
        );
    }

    return {
        name: groupName,
        weeklyContribution,
        currentWeek: 1,
        members: [],
        contributions: [],
        payoutHistory: [],
        nextPayoutIndex: 0,
    };
}

// Register a member and assign join order for payout rotation
export function addMember(
    group: SavingsGroup,
    id: string,
    name: string,
): void {
    const memberId = id.trim();
    const memberName = name.trim();

    if (!memberId || !memberName) {
        throw new Error("Member ID and name are required.");
    }

    // Lock roster once contributions or weeks have started to protect pot size
    if (group.contributions.length > 0 || group.currentWeek > 1) {
        throw new Error("Cannot add new members after the savings cycle has started.");
    }

    // Prevent duplicate IDs regardless of letter casing
    const duplicateId = group.members.some(
        (member: Member) => member.id.toLowerCase() === memberId.toLowerCase(),
    );
    if (duplicateId) {
        throw new Error("A member with this ID already exists.");
    }

    // Prevent duplicate names regardless of letter casing
    const duplicateName = group.members.some(
        (member: Member) => member.name.toLowerCase() === memberName.toLowerCase(),
    );
    if (duplicateName) {
        throw new Error("A member with this name already exists.");
    }

    group.members.push({
        id: memberId,
        name: memberName,
        joinOrder: group.members.length,
    });
}