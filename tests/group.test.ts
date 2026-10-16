import { describe, expect, it } from "vitest";
import { addMember, createGroup } from "../src/group";
import { recordContribution } from "../src/contributions";

describe("createGroup", () => {
    // Verify initial state has week 1, empty lists, and 0 index
    it("creates a group with the correct initial state", () => {
        const group = createGroup("Unity Susu", 50);

        expect(group.name).toBe("Unity Susu");
        expect(group.weeklyContribution).toBe(50);
        expect(group.currentWeek).toBe(1);
        expect(group.members).toHaveLength(0);
        expect(group.contributions).toHaveLength(0);
        expect(group.payoutHistory).toHaveLength(0);
        expect(group.nextPayoutIndex).toBe(0);
    });

    // Ensure valid currency with pesewas (up to 2 decimals) is accepted
    it("accepts valid decimal amounts up to 2 decimal places (pesewas)", () => {
        const group = createGroup("Unity Susu", 50.5);
        expect(group.weeklyContribution).toBe(50.5);

        const group2 = createGroup("Unity Susu", 50.25);
        expect(group2.weeklyContribution).toBe(50.25);
    });

    // Ensure empty or whitespace-only group names throw an error
    it("rejects a blank group name", () => {
        expect(() => createGroup("", 50)).toThrow("Group name is required.");
        expect(() => createGroup("   ", 50)).toThrow("Group name is required.");
    });

    // Reject non-positive amounts
    it("rejects zero or negative weekly contributions", () => {
        expect(() => createGroup("Unity Susu", 0)).toThrow();
        expect(() => createGroup("Unity Susu", -50)).toThrow();
    });

    // Disallow fractions of pesewas beyond 2 decimal places
    it("rejects contributions with more than 2 decimal places", () => {
        expect(() => createGroup("Unity Susu", 50.555)).toThrow();
    });
});

describe("addMember", () => {
    // Verify members are stored in order with incrementing joinOrder index
    it("adds members in join order", () => {
        const group = createGroup("Unity Susu", 50);

        addMember(group, "M001", "Ama");
        addMember(group, "M002", "Kofi");

        expect(group.members).toHaveLength(2);
        expect(group.members[0].name).toBe("Ama");
        expect(group.members[0].joinOrder).toBe(0);
        expect(group.members[1].name).toBe("Kofi");
        expect(group.members[1].joinOrder).toBe(1);
    });

    // Prevent duplicate member IDs regardless of casing
    it("rejects duplicate member IDs (case-insensitive)", () => {
        const group = createGroup("Unity Susu", 50);

        addMember(group, "M001", "Ama");

        expect(() => addMember(group, "M001", "Kofi")).toThrow(
            "A member with this ID already exists.",
        );
        expect(() => addMember(group, "m001", "Kofi")).toThrow(
            "A member with this ID already exists.",
        );
    });

    // Prevent duplicate member names regardless of casing
    it("rejects duplicate member names (case-insensitive)", () => {
        const group = createGroup("Unity Susu", 50);

        addMember(group, "M001", "Ama");

        expect(() => addMember(group, "M002", "ama")).toThrow(
            "A member with this name already exists.",
        );
    });

    // Reject empty strings or spaces for ID and name
    it("rejects blank member IDs and names", () => {
        const group = createGroup("Unity Susu", 50);

        expect(() => addMember(group, "", "Ama")).toThrow();
        expect(() => addMember(group, "M001", "")).toThrow();
        expect(() => addMember(group, "M002", "   ")).toThrow();
    });

    // Clean whitespace from around inputs
    it("trims whitespace from member IDs and names", () => {
        const group = createGroup("Unity Susu", 50);

        addMember(group, " M001 ", " Ama ");

        expect(group.members[0].id).toBe("M001");
        expect(group.members[0].name).toBe("Ama");
    });

    // Ensure member roster is locked once contributions start
    it("rejects adding members after savings cycle has started", () => {
        const group = createGroup("Unity Susu", 50);
        addMember(group, "M001", "Ama");
        addMember(group, "M002", "Kofi");

        recordContribution(group, "M001", 50);

        expect(() => addMember(group, "M003", "Esi")).toThrow(
            "Cannot add new members after the savings cycle has started.",
        );
    });
});
