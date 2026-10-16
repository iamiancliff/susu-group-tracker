// Represents a group member with registration order used for payout rotation
export interface Member {
    id: string;
    name: string;
    joinOrder: number;
}

// Stores the complete state and history of a Susu savings group
export interface SavingsGroup {
    name: string;
    weeklyContribution: number;
    currentWeek: number;
    members: Member[];
    contributions: Contribution[];
    payoutHistory: Payout[];
    nextPayoutIndex: number;
}

// Tracks the cumulative amount paid by a member for a given week
export interface Contribution {
    memberId: string;
    week: number;
    amountPaid: number;
}

// Records a completed pot disbursement to a member for a closed week
export interface Payout {
    memberId: string;
    week: number;
    amount: number;
}
