import { describe, expect, it } from "vitest";
import {
    getAmountOwed,
    getAmountPaid,
    recordContribution,
} from "../src/contributions";
import { addMember, createGroup } from "../src/group";

// Helper to set up a standard 2-member group with 50 GHS contribution
function createTestGroup() {
    const group = createGroup("Test Susu Group", 50);
    addMember(group, "M001", "Ama");
    addMember(group, "M002", "Kofi");
    return group;
}

describe("recordContribution", () => {
    // Verify a full payment clears the owed balance to 0
    it("records a full contribution", () => {
        const group = createTestGroup();

        recordContribution(group, "M001", 50);

        expect(getAmountPaid(group, "M001")).toBe(50);
        expect(getAmountOwed(group, "M001")).toBe(0);
    });

    // Verify partial payments correctly reduce the amount owed
    it("allows partial payments", () => {
        const group = createTestGroup();

        recordContribution(group, "M001", 30);

        expect(getAmountPaid(group, "M001")).toBe(30);
        expect(getAmountOwed(group, "M001")).toBe(20);
    });

    // Ensure multiple partial payments in the same week aggregate into one record
    it("adds multiple partial payments together exactly", () => {
        const group = createTestGroup();

        recordContribution(group, "M001", 30);
        recordContribution(group, "M001", 20);

        expect(getAmountPaid(group, "M001")).toBe(50);
        expect(getAmountOwed(group, "M001")).toBe(0);
        expect(group.contributions).toHaveLength(1);
    });

    // Check decimal calculations (e.g. 50.75 - 20.25 = 30.50) without floating point errors
    it("handles decimal contributions without rounding errors", () => {
        const group = createGroup("Decimal Test", 50.75);
        addMember(group, "M001", "Ama");
        addMember(group, "M002", "Kofi");

        recordContribution(group, "M001", 20.25);
        expect(getAmountOwed(group, "M001")).toBe(30.5);

        recordContribution(group, "M001", 30.5);
        expect(getAmountOwed(group, "M001")).toBe(0);
    });

    // Reject payment if member ID does not exist in group
    it("rejects payments from unknown members", () => {
        const group = createTestGroup();

        expect(() => recordContribution(group, "M999", 50)).toThrow(
            "Member not found.",
        );
    });

    // Reject non-positive contribution amounts
    it("rejects zero and negative amounts", () => {
        const group = createTestGroup();

        expect(() => recordContribution(group, "M001", 0)).toThrow();
        expect(() => recordContribution(group, "M001", -10)).toThrow();
    });

    // Reject amounts with more than 2 decimal places
    it("rejects contributions with more than 2 decimal places", () => {
        const group = createTestGroup();

        expect(() => recordContribution(group, "M001", 10.555)).toThrow();
    });

    // Throw error if payment exceeds remaining balance for the week
    it("rejects payments above the outstanding balance", () => {
        const group = createTestGroup();

        recordContribution(group, "M001", 30);

        expect(() => recordContribution(group, "M001", 21)).toThrow(
            "Payment exceeds the amount owed: GHS 20.00.",
        );
        expect(getAmountOwed(group, "M001")).toBe(20);
    });

    // Restrict contributions strictly to the current active week
    it("rejects contributions for weeks other than the active week", () => {
        const group = createTestGroup();

        expect(() => recordContribution(group, "M001", 50, 2)).toThrow(
            "Contributions can only be recorded for the active week (Week 1).",
        );
    });
});
