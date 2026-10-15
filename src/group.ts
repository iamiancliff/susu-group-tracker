import type { Member, SavingsGroup } from "./types";


export function createGroup(weeklyContribution: number): SavingsGroup {
    if (!Number.isSafeInteger(weeklyContribution) || weeklyContribution <= 0) {
        throw new Error("Weekly contribution must be a positive whole number");
    }

    return {
        weeklyContribution,
        currentWeek: 1,
        members: [],
        contributions: [],
        payoutHistory: [],
        nextPayoutIndex: 0
    }
}


export function addMember(
    group: SavingsGroup,
    id: string,
    name: string
): void {
    const memberId = id.trim();
    const memberName = name.trim()


    if (!memberId || !memberName) {
        throw new Error("Member ID and name are required.");
    }

    const duplicateId = group.members.some(
        (member) => member.id.toLowerCase() === memberId.toLowerCase(),
    );

    if (duplicateId) {
        throw new Error("A member with this ID already exists.");
    }

    const duplicateName = group.members.some(
        (member) => member.name.toLowerCase() === memberName.toLowerCase(),
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