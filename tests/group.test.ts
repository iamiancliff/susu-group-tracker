
import { describe, expect, it } from "vitest";
import { addMember, createGroup } from "../src/group";

describe("createGroup", () => {
    it("creates a group with the correct initial state", () => {
        const group = createGroup(50);

        expect(group.weeklyContribution).toBe(50);
        expect(group.currentWeek).toBe(1);
        expect(group.members).toHaveLength(0);
        expect(group.nextPayoutIndex).toBe(0);
    });

    it("rejects a zero or negative weekly contribution", () => {
        expect(() => createGroup(0)).toThrow();
        expect(() => createGroup(-50)).toThrow();
    });
});

describe("addMember", () => {
    it("adds members in join order", () => {
        const group = createGroup(50);

        addMember(group, "M001", "Ama");
        addMember(group, "M002", "Kofi");

        expect(group.members).toHaveLength(2);
        expect(group.members[0].name).toBe("Ama");
        expect(group.members[1].joinOrder).toBe(1);
    });

    it("rejects duplicate member IDs", () => {
        const group = createGroup(50);

        addMember(group, "M001", "Ama");

        expect(() => addMember(group, "M001", "Kofi")).toThrow();
    });

    it("rejects duplicate names regardless of case", () => {
        const group = createGroup(50);

        addMember(group, "M001", "Ama");

        expect(() => addMember(group, "M002", "ama")).toThrow();
    });

    it("rejects blank member details", () => {
        const group = createGroup(50);

        expect(() => addMember(group, "", "Ama")).toThrow();
        expect(() => addMember(group, "M001", "   ")).toThrow();
    });
});
