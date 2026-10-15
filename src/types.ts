// Application state and data types

// Represents a group member
export interface Member {
    id: string;
    name: string;
    joinOrder: number;
}

// Contribution records 
export interface Contribution {
    memberId: string;
    week: number;
    amountPaid: number;
}

// Payout records
export interface Payout {
    memberId: string;
    week: number;
    amountPaid: number;
}

// Savings group state
export interface SavingsGroup {
    weeklyContribution: number;
    currentWeek: number;
    members: Member[];
    contributions: Contribution[];
    payoutHistory: Payout[];
    nextPayoutIndex: number;
}

