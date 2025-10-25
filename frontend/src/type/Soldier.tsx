export type SoldierCardProps = {
    soldier: {
        id?: number,
        firstName: string,
        lastName: string,
        rank: string,
        squad: string,
        team?: string,
        role?: string,
    }
    onDelete: (id: number | undefined) => void;
}

export type Soldier = {
    id?: number;
    firstName: string;
    lastName: string;
    rank?: string;
    squad?: string;
    team?: string;
    role?: string;
};