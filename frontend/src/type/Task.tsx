import type {Soldier} from "@/type/Soldier.tsx";

export type TaskCardProps = {
    task: {
        id?: number;
        name: string;
        description?: string;
        location?: string;
        reason?: string;
        created?: string;
        start?: string;
        end?: string;
        assigned?: Soldier[];
    }
    onDelete: (id: number | undefined) => void;
    onSubmit: (task: Task) => Promise<void>;

}

export type Task = {
    id?: number;
    name: string;
    description?: string;
    location?: string;
    reason?: string;
    start?: string;
    end?: string;
    created?: string;
    assigned?: Soldier[];
};
