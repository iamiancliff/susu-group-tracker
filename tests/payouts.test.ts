import { describe, expect, it } from "vitest";
import { addMember, createGroup } from "../src/group";
import { recordContribution } from "../src/contributions";
import { closeWeek } from "../src/payouts";

// Helper to set up a 3-member group with Ama, Kofi, and Esi
function createTestGroup() {
    const group = createGroup("Test Group", 50);
    addMember(group, "M001", "Ama");
    addMember(group, "M002", "Kofi");
    addMember(group, "M003", "Esi");
    return group;
}

describe("closeWeek", () => {
    // Block week closure and report members who still owe balances
    it("does not close a week when a member still owes money and reports who owes what", () => {
        const group = createTestGroup();

        recordContribution(group, "M001", 50);
        recordContribution(group, "M002", 50);
        recordContribution(group, "M003", 30);

        const result = closeWeek(group);

        expect(result).toBe("Week 1 cannot close. Esi owes GHS 20.00.");
        expect(group.currentWeek).toBe(1);
        expect(group.payoutHistory).toHaveLength(0);
    });

    // Pay full pot to first registered member when all members pay in full
    it("pays the first member in join order when everyone has paid in full", () => {
        const group = createTestGroup();

        for (const member of group.members) {
            recordContribution(group, member.id, 50);
        }

        const result = closeWeek(group);

        expect(result).toBe("Week 1 closed. GHS 150.00 paid to Ama.");
        expect(group.currentWeek).toBe(2);
        expect(group.payoutHistory).toHaveLength(1);
        expect(group.payoutHistory[0].amount).toBe(150);
        expect(group.payoutHistory[0].memberId).toBe("M001");
    });

    // Rotate payout to the second member in join order for week 2
    it("pays the next member in join order the following week", () => {
        const group = createTestGroup();

        // Week 1 - Ama's payout
        for (const member of group.members) {
            recordContribution(group, member.id, 50);
        }
        closeWeek(group);

        // Week 2 - Kofi's payout
        for (const member of group.members) {
            recordContribution(group, member.id, 50);
        }
        const resultWeek2 = closeWeek(group);

        expect(resultWeek2).toBe("Week 2 closed. GHS 150.00 paid to Kofi.");
        expect(group.payoutHistory[1].memberId).toBe("M002");
        expect(group.payoutHistory[1].week).toBe(2);
        expect(group.currentWeek).toBe(3);
    });

    // Reset rotation index back to 0 once every member has received a payout
    it("cycles back to the first member after all members receive payouts", () => {
        const group = createTestGroup();

        // Run 3 complete weekly cycles for 3 members
        for (let w = 1; w <= 3; w++) {
            for (const member of group.members) {
                recordContribution(group, member.id, 50);
            }
            closeWeek(group);
        }

        expect(group.nextPayoutIndex).toBe(0);
        expect(group.currentWeek).toBe(4);
    });

    // Enforce minimum requirement of 2 members before week closure
    it("rejects closing a week with fewer than two members", () => {
        const group = createGroup("Solo Group", 50);
        addMember(group, "M001", "Ama");

        expect(() => closeWeek(group)).toThrow(
            "At least two members are required to close a week.",
        );
    });
});
