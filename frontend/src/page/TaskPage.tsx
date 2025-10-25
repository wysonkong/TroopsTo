import {useEffect, useState} from 'react';
import {useAuth} from "@/provider/AuthProvider.tsx";
import {useUser} from "@/provider/UserProvider.tsx";
import TaskAdd from "@/components/task/TaskAdd.tsx";
import TaskCard from "@/components/task/TaskCard.tsx";
import type {Task} from "@/type/Task.tsx";
import { CalendarX2 } from "lucide-react";

const TaskPage = () => {
    const {isLoggedIn} = useAuth();
    const {user} =  useUser();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/task/tasks")
                const data = await res.json();
                setTasks(data)
            } catch (e) {
                console.log("Error fetching widgets:", e)
            } finally {
                setLoading(false);
            }
        }

        fetchTasks();
    }, []);

    async function handleAddTask(newTask: Task) {
        if (!user) {
            console.error("No user logged in");
            alert("You must be logged in to create a widget");
            return;
        }

        try{
            const res = await fetch("http://localhost:8080/api/task/new_task", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newTask),
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.log("Failed to add task. Status:", res.status);
                console.log("Error response:", errorText);
                alert("Failed to create task. Check console for details.");
                return;
            }

            const text = await res.text();
            if (text) {
                const createdTask = JSON.parse(text);
                setTasks(prev => [...prev, createdTask]);
                alert("Task added successfully!");
            } else {
                console.warn("Empty response from server; refreshing list...");
                const refreshRes = await fetch("http://localhost:8080/api/task/tasks");
                const allTasks = await refreshRes.json();
                setTasks(allTasks);
            }

        } catch (err) {
            console.log("Error adding task: ", err);
            alert("Error creating task: " + err);
        }
    }

    return (
        <>
            <div className={"px-32"}>
                {isLoggedIn && <div className={"pt-16 px-8 mb-5"}>
                    <TaskAdd onSubmit={handleAddTask}/>
                </div>}

                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-muted-foreground">Loading tasks...</div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
                        <div className="rounded-full bg-muted p-6 mb-4">
                            <CalendarX2 className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-semibold tracking-tight mb-2">
                            No tasks yet
                        </h3>
                        <p className="text-muted-foreground max-w-sm mb-6">
                            {isLoggedIn
                                ? "Get started by creating your first task using the button above."
                                : "Log in to create and manage tasks."
                            }
                        </p>
                    </div>
                ) : (
                    <div className={"grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6"}>
                        <div
                            className={"rounded-lg text-center text-white opacity-75 p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"}>
                            {tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onDelete={(id: number | undefined) => setTasks(prev => prev.filter(t => t.id !== id))
                                    }
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default TaskPage;