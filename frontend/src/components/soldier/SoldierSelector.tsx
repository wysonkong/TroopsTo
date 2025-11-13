import {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {CheckCircle2, UserPlus} from "lucide-react";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {apiUrl} from "@/config/api.tsx";

type Soldier = {
    id: number;
    firstName: string;
    lastName: string;
    rank?: string;
    squad?: string;
    team?: string;
    role?: string;
};

type SoldierSelectorProps = {
    taskId: number;
    taskStart: string;
    taskEnd: string;
    onAssignComplete?: () => void;
};

const SoldierSelector = ({taskId, taskStart, taskEnd, onAssignComplete}: SoldierSelectorProps) => {
    const [soldiers, setSoldiers] = useState<Soldier[]>([]);
    const [selectedSoldiers, setSelectedSoldiers] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            fetchAvailableSoldiers();
        }
    }, [open, taskStart, taskEnd]);

    const fetchAvailableSoldiers = async () => {
        setLoading(true);
        try {
            const url = apiUrl(`/api/soldier/available?taskStart=${encodeURIComponent(taskStart)}&taskEnd=${encodeURIComponent(taskEnd)}`);
            const res = await fetch(url);

            if (!res.ok) {
                throw new Error(`Failed to fetch available soldiers: ${res.status}`);
            }

            const data = await res.json();
            setSoldiers(data);
        } catch (e) {
            console.error("Error fetching available soldiers:", e);
            alert("Failed to load available soldiers: " + e);
        } finally {
            setLoading(false);
        }
    };

    const toggleSoldier = (soldierId: number) => {
        const newSelected = new Set(selectedSoldiers);
        if (newSelected.has(soldierId)) {
            newSelected.delete(soldierId);
        } else {
            newSelected.add(soldierId);
        }
        setSelectedSoldiers(newSelected);
    };

    const handleAssign = async () => {
        const soldierIds = Array.from(selectedSoldiers);

        try {
            const res = await fetch(apiUrl(`/api/task/${taskId}/assign`), {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(soldierIds),
            });

            if (!res.ok) {
                const errorData = await res.json();
                alert("Failed to assign soldiers: " + (errorData.error || errorData));
                return;
            }

            alert(`Successfully assigned ${soldierIds.length} soldier(s)!`);
            setOpen(false);
            setSelectedSoldiers(new Set());

            // Call the completion callback if provided
            if (onAssignComplete) {
                onAssignComplete();
            }
        } catch (err) {
            console.error("Error assigning soldiers:", err);
            alert("Error assigning soldiers: " + err);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedSoldiers(new Set());
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2">
                    <UserPlus className="h-4 w-4"/>
                    Assign Soldiers
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogTitle>Assign Available Soldiers</DialogTitle>
                <DialogDescription>
                    Task Time: {new Date(taskStart).toLocaleString()} - {new Date(taskEnd).toLocaleString()}
                    <br/>
                    <span className="text-xs">Showing only soldiers without conflicting tasks</span>
                </DialogDescription>

                <div className="space-y-4">
                    {loading ? (
                        <div className="p-8 text-center text-muted-foreground">
                            Loading available soldiers...
                        </div>
                    ) : (
                        <>
                            <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                                {soldiers.map((soldier) => {
                                    const isSelected = selectedSoldiers.has(soldier.id);

                                    return (
                                        <div
                                            key={soldier.id}
                                            className={`p-3 border rounded-lg transition-colors ${
                                                isSelected
                                                    ? 'border-green-500 bg-green-50 dark:bg-green-950/20 text-background'
                                                    : 'border-border hover:border-primary/50'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <Checkbox
                                                    id={`soldier-${soldier.id}`}
                                                    checked={isSelected}
                                                    onCheckedChange={() => toggleSoldier(soldier.id)}
                                                    className="mt-1"
                                                />
                                                <div className="flex-1">
                                                    <Label
                                                        htmlFor={`soldier-${soldier.id}`}
                                                        className="cursor-pointer font-medium flex items-center gap-2"
                                                    >
                            <span>
                              {soldier.rank && `${soldier.rank} `}
                                {soldier.firstName} {soldier.lastName}
                            </span>
                                                        {isSelected && (
                                                            <CheckCircle2 className="h-4 w-4 text-green-500"/>
                                                        )}
                                                    </Label>
                                                    <div className="text-sm text-muted-foreground mt-1">
                                                        {soldier.squad && `Squad: ${soldier.squad}`}
                                                        {soldier.squad && soldier.team && ' | '}
                                                        {soldier.team && `Team: ${soldier.team}`}
                                                        {(soldier.squad || soldier.team) && soldier.role && ' | '}
                                                        {soldier.role && `Role: ${soldier.role}`}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {soldiers.length === 0 && !loading && (
                                <Alert>
                                    <AlertDescription>
                                        No soldiers are available for this time slot. All soldiers have conflicting
                                        tasks.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </>
                    )}

                    <div className="flex gap-2 justify-end pt-4 border-t">
                        <Button variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAssign}
                            disabled={selectedSoldiers.size === 0 || loading}
                        >
                            Assign {selectedSoldiers.size > 0 && `(${selectedSoldiers.size})`}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SoldierSelector;