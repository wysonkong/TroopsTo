export type SoldierCardProps = {
    soldier: {
        id?: number,
        firstName: string,
        lastName: string,
        rank: string,
        squad?: string,
        team?: string,
        role?: string,
    }
    onDelete: (id: number | undefined) => void;
    onSubmit: (soldier: Soldier) => Promise<void>;
}

export type Soldier = {
    id?: number;
    firstName: string;
    lastName: string;
    rank: string;
    squad?: string;
    team?: string;
    role?: string;
};