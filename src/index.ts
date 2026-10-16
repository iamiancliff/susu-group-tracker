import readline from "node:readline";
import { createGroup, addMember } from "./group";
import { recordContribution } from "./contributions";
import { closeWeek } from "./payouts";
import { getGroupReport, getPayoutReport } from "./reports";
import { formatGHS } from "./currency";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Helper to ask a question via terminal
function ask(question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer: string) => resolve(answer.trim()));
    });
}

console.log("=== SUSU GROUP TRACKER (GHS) ===");

const groupName = await ask("Enter group name: ");

let group;

// Keep asking until valid group details are provided
while (true) {
    const amountInput = await ask(
        "Enter weekly contribution per member in GHS (e.g. 50.00): ",
    );
    const amount = Number(amountInput);

    try {
        group = createGroup(groupName, amount);
        console.log(`Group '${group.name}' created with weekly contribution of ${formatGHS(amount)}.\n`);
        break;
    } catch (error) {
        console.log(
            error instanceof Error ? `Error: ${error.message}` : "Invalid input.",
        );
    }
}

let running = true;

// CLI interactive loop
while (running) {
    console.log("=== MAIN MENU ===");
    console.log("1. Add member");
    console.log("2. Record contribution");
    console.log("3. Close current week");
    console.log("4. View group report");
    console.log("5. View payout history");
    console.log("6. Exit");

    const choice = await ask("Choose an option (1-6): ");

    try {
        switch (choice) {
            case "1": {
                const id = await ask("Enter member ID: ");
                const name = await ask("Enter member name: ");

                addMember(group, id, name);
                console.log(`Success: ${name.trim()} added successfully.\n`);
                break;
            }

            case "2": {
                const id = await ask("Enter member ID: ");
                const amountInput = await ask("Enter amount paid in GHS: ");
                const amount = Number(amountInput);

                recordContribution(group, id, amount);
                console.log(`Success: Contribution of ${formatGHS(amount)} recorded.\n`);
                break;
            }

            case "3": {
                const result = closeWeek(group);
                console.log(`\n${result}\n`);
                break;
            }

            case "4": {
                console.log("\n" + getGroupReport(group) + "\n");
                break;
            }

            case "5": {
                console.log("\n" + getPayoutReport(group) + "\n");
                break;
            }

            case "6": {
                running = false;
                console.log("Exiting Susu Group Tracker.");
                break;
            }

            default:
                console.log("Invalid option. Please choose a number from 1 to 6.\n");
        }
    } catch (error) {
        console.log(
            error instanceof Error ? `Error: ${error.message}\n` : "Something went wrong.\n",
        );
    }
}

rl.close();
