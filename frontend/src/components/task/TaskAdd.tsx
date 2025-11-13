import React, {useState} from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle, DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Label} from "@/components/ui/label.tsx";
import {InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput} from "@/components/ui/input-group.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Info, Plus} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import type {Task} from "@/type/Task.tsx";
import TimeDate from "@/components/task/TimeDate.tsx";
import {useUser} from "@/provider/UserProvider.tsx";

const initialTaskSet: Task = {
    name: "",
    description: "",
    location: "",
    reason: "",
    created: "",
    start: "",
    end: "",
}

type TaskAddProp = {
    onSubmit:(task: Task) => void;
    currentTask?: Task;
}

// @ts-ignore
const TaskAdd = ({onSubmit, currentTask}: TaskAddProp) => {
    const [taskData, setTaskData] = useState<Task>(currentTask || initialTaskSet);
    const [open, setOpen] = useState(false)
    const {user} = useUser()

    const [startDate, setStartDate] = useState<Date | undefined>(
        currentTask?.start ? new Date(currentTask.start) : undefined
    );
    const [startTime, setStartTime] = useState(
        currentTask?.start ? new Date(currentTask.start).toISOString().slice(11, 16) : "12:00"
    );

    const [endDate, setEndDate] = useState<Date | undefined>(
        currentTask?.end ? new Date(currentTask.end) : undefined
    );
    const [endTime, setEndTime] = useState(
        currentTask?.end ? new Date(currentTask.end).toISOString().slice(11, 16) : "13:00"
    );



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setTaskData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleReset = () => {
        setTaskData(initialTaskSet);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (!user) return;
        e.preventDefault();
        if (!taskData.name || !taskData.description || !taskData.location) {
            alert("Please fill in your task information");
            return;
        }

        if (!startDate || !endDate) {
            alert("Please select start and end times")
            return
        }

        const startDateTime = new Date(startDate)
        const [sh, sm] = startTime.split(":").map(Number)
        startDateTime.setHours(sh, sm, 0)

        const endDateTime = new Date(endDate)
        const [eh, em] = endTime.split(":").map(Number)
        endDateTime.setHours(eh, em, 0)

        const finalTaskData: Task = {
            id: taskData ? taskData.id : undefined,
            name: taskData.name,
            description: taskData.description,
            location: taskData.location,
            reason: taskData.reason,
            start: startDateTime.toISOString(),
            end: endDateTime.toISOString(),
            created: new Date().toISOString(),
        }


        onSubmit(finalTaskData)
        console.log(finalTaskData);

        setOpen(false);
        setTaskData(initialTaskSet);

    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant={"outline"} size={currentTask ? "sm" : "lg"} className={"bg-accent"}>
                        {currentTask ? "Edit" : <Plus/>}
                    </Button>
                </DialogTrigger>
                <div className={"max-w-md w-full"}>
                <DialogContent className="bg-card rounded-lg shadow-lg p-6 w-full">

                    <form id="addTask" onSubmit={handleSubmit} onReset={handleReset}>
                        <DialogHeader>
                            <DialogTitle>{currentTask ? "Edit Task" : "New Task"}</DialogTitle>
                            <DialogDescription>
                                {currentTask? "Edit your task" : "Add a New Task to Calendar."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className={"grid gap-4 m-4"}>
                            <div className={"flex justify-between"}>
                                <div className={"grid gap-4"}>
                                    <Label htmlFor={"taskStart"}>Starts:</Label>
                                    <div id={"taskStart"} className={"grid gap-3"}>
                                        <TimeDate
                                            date={startDate}
                                            setDate={setStartDate}
                                            time={startTime}
                                            setTime={setStartTime}
                                        />
                                    </div>
                                </div>

                                <div className={"grid gap-4"}>
                                    <Label htmlFor={"taskEnd"}>Ends:</Label>
                                    <div id={"taskEnd"} className={"grid gap-3"}>
                                        <TimeDate
                                            date={endDate}
                                            setDate={setEndDate}
                                            time={endTime}
                                            setTime={setEndTime}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/*Task*/}
                            <div className={"grid gap-4"}>
                                <div className={"grid gap-3"}>
                                    <Label htmlFor={"taskName"}>Task</Label>
                                    <InputGroup>
                                        <InputGroupInput
                                            id={"taskName"}
                                            name={"name"}
                                            value={taskData.name}
                                            onChange={handleChange}
                                            placeholder={"Task"}
                                            type={"text"}
                                            className={"!pl-1"}/>
                                        <InputGroupAddon align="inline-end">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <InputGroupButton className="rounded-full" size="icon-xs">
                                                        <Info/>
                                                    </InputGroupButton>
                                                </TooltipTrigger>
                                                <TooltipContent>Name Your Task</TooltipContent>
                                            </Tooltip>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </div>
                            </div>

                            {/*Description*/}
                            <div className={"grid gap-4"}>
                                <div className={"grid gap-3"}>
                                    <Label htmlFor={"taskDesc"}>Description</Label>
                                    <InputGroup>
                                        <InputGroupInput
                                            id={"taskDesc"}
                                            name={"description"}
                                            value={taskData.description}
                                            onChange={handleChange}
                                            type={"text"}
                                            className={"!pl-1"}/>
                                        <InputGroupAddon align="inline-end">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <InputGroupButton className="rounded-full" size="icon-xs">
                                                        <Info/>
                                                    </InputGroupButton>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    What?
                                                </TooltipContent>
                                            </Tooltip>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </div>
                            </div>

                            {/*Location*/}
                            <div className={"grid gap-4"}>
                                <div className={"grid gap-3"}>
                                    <Label htmlFor={"taskLocation"}>Location</Label>
                                    <InputGroup>
                                        <InputGroupInput
                                            id={"taskLocation"}
                                            name={"location"}
                                            value={taskData.location}
                                            onChange={handleChange}
                                            placeholder={"Location"}
                                            type={"text"}
                                            className={"!pl-1"}/>
                                        <InputGroupAddon align="inline-end">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <InputGroupButton className="rounded-full" size="icon-xs">
                                                        <Info/>
                                                    </InputGroupButton>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Where?
                                                </TooltipContent>
                                            </Tooltip>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </div>
                            </div>

                            {/*Why*/}
                            <div className={"grid gap-4"}>
                                <div className={"grid gap-3"}>
                                    <Label htmlFor={"taskReason"}>Reason</Label>
                                    <InputGroup>
                                        <InputGroupInput id={"taskReason"}
                                                         name={"reason"}
                                                         value={taskData.reason}
                                                         onChange={handleChange}
                                                         type={"text"}
                                                         className={"!pl-1"}/>
                                        <InputGroupAddon align="inline-end">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <InputGroupButton className="rounded-full" size="icon-xs">
                                                        <Info/>
                                                    </InputGroupButton>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Why?
                                                </TooltipContent>
                                            </Tooltip>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" onClick={handleReset}
                                        className={"bg-destructive"}>Cancel</Button>
                            </DialogClose>
                            <Button type={"reset"} onClick={handleReset} className={"bg-secondary"}>Reset</Button>
                            <Button type={"submit"} className={"bg-primary"}>Submit</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
                </div>
            </Dialog>
        </>

    );
};

export default TaskAdd;