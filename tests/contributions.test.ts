
import { describe, expect, it } from "vitest";
import {
    getAmountOwed,
    recordContribution,
} from "../src/contributions";
import { addMember, createGroup } from "../src/group";

function createTestGroup() {
    const group = createGroup(50);
    addMember(group, "M001", "Ama");
    addMember(group, "M002", "Kofi");
    return group;
}

describe("recordContribution", () => {
    it("records a full contribution", () => {
        const group = createTestGroup();

        recordContribution(group, "M001", 50);

        expect(getAmountOwed(group, "M001")).toBe(0);
    });

    it("allows partial payments", () => {
        const group = createTestGroup();

        recordContribution(group, "M001", 30);

        expect(getAmountOwed(group, "M001")).toBe(20);
    });

    it("adds partial payments together", () => {
        const group = createTestGroup();

        recordContribution(group, "M001", 30);
        recordContribution(group, "M001", 20);

        expect(getAmountOwed(group, "M001")).toBe(0);
        expect(group.contributions).toHaveLength(1);
    });

    it("rejects payments from unknown members", () => {
        const group = createTestGroup();

        expect(() => recordContribution(group, "M999", 50)).toThrow(
            "Member not found.",
        );
    });

    it("rejects zero, negative and decimal amounts", () => {
        const group = createTestGroup();

        expect(() => recordContribution(group, "M001", 0)).toThrow();
        expect(() => recordContribution(group, "M001", -10)).toThrow();
        expect(() => recordContribution(group, "M001", 10.5)).toThrow();
    });

    it("rejects payments above the outstanding balance", () => {
        const group = createTestGroup();

        recordContribution(group, "M001", 30);

        expect(() => recordContribution(group, "M001", 21)).toThrow();
        expect(getAmountOwed(group, "M001")).toBe(20);
    });
});
