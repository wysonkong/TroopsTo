import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {useUser} from "@/provider/UserProvider.tsx";
import type {TaskCardProps} from "@/type/Task.tsx";
import SoldierSelector from "@/components/soldier/SoldierSelector.tsx";

const TaskCard = ({task, onDelete}: TaskCardProps) => {
    const {user} = useUser();
    const [open, setOpen] = useState(false);
    const admin = user?.role === "ADMIN";

    const handleDelete = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/task/delete/" + task.id, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.log("Failed to delete task. Status:", res.status);
                console.log("Error response:", errorText);
                alert("Failed to delete task. Check console for details.");
                return;
            }
            onDelete(task.id)
            setOpen(false);
        } catch (err) {
            console.log("Error deleting task: ", err);
            alert("Error deleting task: " + err);
        }
    }

    const handleAssignComplete = () => {
        // Optionally refresh task data here or show a success message
        console.log("Soldiers assigned successfully");
        // You could fetch updated task data here if needed
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div>
                    <Card className={"cursor-pointer hover:shadow-lg transition-shadow"}>
                        <CardHeader className={"flex flex-col items-center gap-2 p-4"}>
                            <CardTitle>{task.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={"grid gap-4"}>
                                <span>Start: {new Date(task.start).toLocaleString()}</span>
                                <span>End: {new Date(task.end).toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogTrigger>
            <DialogContent aria-describedby={"Task Details"}>
                <DialogTitle>{task.name}</DialogTitle>
                <DialogDescription>Task Details and Management</DialogDescription>
                <div>
                    <Card>
                        <CardHeader className={"flex flex-col gap-2 p-4"}>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className={"flex flex-col gap-3"}>
                            <div><strong>Description:</strong> {task.description}</div>
                            <div><strong>Location:</strong> {task.location}</div>
                            <div><strong>Reason:</strong> {task.reason}</div>
                            <div><strong>Start:</strong> {new Date(task.start).toLocaleString()}</div>
                            <div><strong>End:</strong> {new Date(task.end).toLocaleString()}</div>
                            <div><strong>Created:</strong> {new Date(task.created).toLocaleString()}</div>
                            {task.assigned && task.assigned.length > 0 && (
                                <div>
                                    <strong>Assigned Soldiers:</strong>
                                    <ul className="list-disc ml-5 mt-2">
                                        {task.assigned.map((soldier: any) => (
                                            <li key={soldier.id}>
                                                {soldier.rank && `${soldier.rank} `}
                                                {soldier.firstName} {soldier.lastName}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                        {admin && (
                            <CardFooter className={"px-4 py-2 flex gap-2"}>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                                <SoldierSelector
                                    taskId={task.id!}
                                    taskStart={task.start!}
                                    taskEnd={task.end!}
                                    onAssignComplete={handleAssignComplete}
                                />
                            </CardFooter>
                        )}
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TaskCard;