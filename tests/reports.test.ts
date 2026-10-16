import { describe, expect, it } from "vitest";
import { addMember, createGroup } from "../src/group";
import { recordContribution } from "../src/contributions";
import { closeWeek } from "../src/payouts";
import { getGroupReport, getPayoutReport } from "../src/reports";

describe("reports", () => {
    // Verify group report displays week, contributions, owed balances, and payout history
    it("shows members' payment status, outstanding balances, and payout history", () => {
        const group = createGroup("Accra Savings Club", 50);

        addMember(group, "M001", "Ama");
        addMember(group, "M002", "Esi");

        recordContribution(group, "M001", 50);
        recordContribution(group, "M002", 30);

        const report = getGroupReport(group);

        expect(report).toContain("Group name: Accra Savings Club");
        expect(report).toContain("Current week: 1");
        expect(report).toContain("Weekly contribution: GHS 50.00");
        expect(report).toContain("Ama: Paid in full (GHS 50.00)");
        expect(report).toContain("Esi: Paid GHS 30.00, owes GHS 20.00");
        expect(report).toContain("Payout history:");
        expect(report).toContain("No payouts have been made yet.");
    });

    // Check placeholder message when no weeks have been closed
    it("shows a placeholder when there is no payout history", () => {
        const group = createGroup("Accra Savings Club", 50);

        expect(getPayoutReport(group)).toContain(
            "No payouts have been made yet.",
        );
    });

    // Verify payout history correctly logs week, disbursed amount, and recipient
    it("shows completed payouts with recipient name and GHS amount", () => {
        const group = createGroup("Accra Savings Club", 50);

        addMember(group, "M001", "Ama");
        addMember(group, "M002", "Kofi");

        recordContribution(group, "M001", 50);
        recordContribution(group, "M002", 50);
        closeWeek(group);

        const report = getPayoutReport(group);

        expect(report).toContain("Week 1: GHS 100.00 paid to Ama");
    });

    // Verify report renders properly in week 2 when members have 0 GHS paid
    it("shows correct report in week 2 before any new payments are made", () => {
        const group = createGroup("Accra Savings Club", 50);

        addMember(group, "M001", "Ama");
        addMember(group, "M002", "Kofi");

        recordContribution(group, "M001", 50);
        recordContribution(group, "M002", 50);
        closeWeek(group);

        const report = getGroupReport(group);

        expect(report).toContain("Current week: 2");
        expect(report).toContain("Ama: Paid GHS 0.00, owes GHS 50.00");
        expect(report).toContain("Kofi: Paid GHS 0.00, owes GHS 50.00");
        expect(report).toContain("Week 1: GHS 100.00 paid to Ama");
    });
});
