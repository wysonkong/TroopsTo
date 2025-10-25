import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Users, MapPin, Clock, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import type {Task} from "@/type/Task.tsx";
import type {Soldier} from "@/type/Soldier.tsx";


const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/task/tasks");
            const data = await res.json();
            setTasks(data);
        } catch (e) {
            console.error("Error fetching tasks:", e);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const getTasksForDay = (day: number) => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const dayStart = new Date(year, month, day, 0, 0, 0);
        const dayEnd = new Date(year, month, day, 23, 59, 59);

        return tasks.filter(task => {
            const taskStart = new Date(task.start);
            const taskEnd = new Date(task.end);

            // Check if task overlaps with this day
            return taskStart <= dayEnd && taskEnd >= dayStart;
        });
    };

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setDialogOpen(true);
    };

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const today = new Date();
    const isToday = (day: number) => {
        return day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading calendar...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            {/* Calendar Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <Button onClick={previousMonth} variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className={"flex flex-col gap-2"}>
                    <h2 className="text-2xl font-semibold">
                        {monthNames[month]} {year}
                    </h2>
                    <Button onClick={goToToday} variant="outline">
                        Today
                    </Button>
                    </div>

                    <Button onClick={nextMonth} variant="outline" size="icon">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                {/* Day Names Header */}
                <div className="grid grid-cols-7 bg-muted">
                    {dayNames.map(day => (
                        <div key={day} className="p-3 text-center font-semibold border-r last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                        <div key={`empty-${index}`} className="min-h-32 border-r border-b bg-muted/30" />
                    ))}

                    {/* Actual days */}
                    {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1;
                        const dayTasks = getTasksForDay(day);
                        const isTodayDay = isToday(day);

                        return (
                            <div
                                key={day}
                                className={`min-h-32 border-r border-b p-2 ${
                                    isTodayDay ? 'bg-primary/5' : ''
                                }`}
                            >
                                <div className={`text-sm font-semibold mb-2 ${
                                    isTodayDay ? 'text-primary' : ''
                                }`}>
                                    {day}
                                    {isTodayDay && (
                                        <span className="ml-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                      Today
                    </span>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    {dayTasks.slice(0, 3).map(task => {
                                        const taskStart = new Date(task.start);
                                        const timeStr = taskStart.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        });

                                        return (
                                            <div
                                                key={task.id}
                                                onClick={() => handleTaskClick(task)}
                                                className="text-xs p-1.5 rounded bg-primary/10 hover:bg-primary/20 cursor-pointer border-l-2 border-primary transition-colors"
                                            >
                                                <div className="font-medium truncate">{task.name}</div>
                                                <div className="text-muted-foreground truncate">{timeStr}</div>
                                                {task.assigned && task.assigned.length > 0 && (
                                                    <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                                                        <Users className="h-3 w-3" />
                                                        <span>{task.assigned.length}</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {dayTasks.length > 3 && (
                                        <div className="text-xs text-muted-foreground pl-1.5">
                                            +{dayTasks.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Task Detail Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl">
                    {selectedTask && (
                        <>
                            <DialogTitle>{selectedTask.name}</DialogTitle>
                            <DialogDescription>Task Details</DialogDescription>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div className="flex-1">
                                            <div className="font-semibold text-sm text-muted-foreground">Description</div>
                                            <div>{selectedTask.description}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div className="flex-1">
                                            <div className="font-semibold text-sm text-muted-foreground">Location</div>
                                            <div>{selectedTask.location}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div className="flex-1">
                                            <div className="font-semibold text-sm text-muted-foreground">Time</div>
                                            <div>
                                                <div>Start: {new Date(selectedTask.start).toLocaleString()}</div>
                                                <div>End: {new Date(selectedTask.end).toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedTask.reason && (
                                        <div className="flex items-start gap-3">
                                            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                            <div className="flex-1">
                                                <div className="font-semibold text-sm text-muted-foreground">Reason</div>
                                                <div>{selectedTask.reason}</div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedTask.assigned && selectedTask.assigned.length > 0 && (
                                        <div className="flex items-start gap-3">
                                            <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                                            <div className="flex-1">
                                                <div className="font-semibold text-sm text-muted-foreground mb-2">
                                                    Assigned Soldiers ({selectedTask.assigned.length})
                                                </div>
                                                <div className="space-y-2">
                                                    {selectedTask.assigned.map((soldier: Soldier) => (
                                                        <div
                                                            key={soldier.id}
                                                            className="p-3 rounded-lg border bg-muted/50"
                                                        >
                                                            <div className="font-medium">
                                                                {soldier.rank && `${soldier.rank} `}
                                                                {soldier.firstName} {soldier.lastName}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground mt-1">
                                                                {soldier.squad && `Squad: ${soldier.squad}`}
                                                                {soldier.squad && soldier.team && ' | '}
                                                                {soldier.team && `Team: ${soldier.team}`}
                                                                {(soldier.squad || soldier.team) && soldier.role && ' | '}
                                                                {soldier.role && `Role: ${soldier.role}`}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {(!selectedTask.assigned || selectedTask.assigned.length === 0) && (
                                        <div className="flex items-start gap-3">
                                            <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                                            <div className="flex-1">
                                                <div className="font-semibold text-sm text-muted-foreground">Assigned Soldiers</div>
                                                <div className="text-muted-foreground">No soldiers assigned yet</div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="flex justify-end">
                                <Button onClick={() => setDialogOpen(false)}>
                                    Close
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CalendarPage;