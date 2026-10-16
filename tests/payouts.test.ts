
import { describe, expect, it } from "vitest";
import { addMember, createGroup } from "../src/group";
import { recordContribution } from "../src/contributions";
import { closeWeek } from "../src/payouts";

function createTestGroup() {
    const group = createGroup(50);
    addMember(group, "M001", "Ama");
    addMember(group, "M002", "Kofi");
    addMember(group, "M003", "Esi");
    return group;
}

describe("closeWeek", () => {
    it("does not close a week when a member still owes money", () => {
        const group = createTestGroup();

        recordContribution(group, "M001", 50);
        recordContribution(group, "M002", 50);
        recordContribution(group, "M003", 30);

        const result = closeWeek(group);

        expect(result).toContain("Esi owes KSh 20");
        expect(group.currentWeek).toBe(1);
        expect(group.payoutHistory).toHaveLength(0);
    });

    it("pays the first member when everyone has paid", () => {
        const group = createTestGroup();

        for (const member of group.members) {
            recordContribution(group, member.id, 50);
        }

        const result = closeWeek(group);

        expect(result).toContain("KSh 150 paid to Ama");
        expect(group.currentWeek).toBe(2);
        expect(group.payoutHistory).toHaveLength(1);
        expect(group.payoutHistory[0].amount).toBe(150);
    });

    it("pays the next member in join order the following week", () => {
        const group = createTestGroup();

        for (const member of group.members) {
            recordContribution(group, member.id, 50);
        }
        closeWeek(group);

        for (const member of group.members) {
            recordContribution(group, member.id, 50);
        }
        closeWeek(group);

        expect(group.payoutHistory[1].memberId).toBe("M002");
        expect(group.payoutHistory[1].week).toBe(2);
        expect(group.currentWeek).toBe(3);
    });

    it("rejects closing a week with fewer than two members", () => {
        const group = createGroup(50);
        addMember(group, "M001", "Ama");

        expect(() => closeWeek(group)).toThrow();
    });
});
