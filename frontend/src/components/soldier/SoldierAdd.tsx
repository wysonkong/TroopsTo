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
import {InputGroup, InputGroupInput} from "@/components/ui/input-group.tsx";
import {UserRoundPlus} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import type {Soldier} from "@/type/Soldier.tsx";

const initialSoldierSet: Soldier = {
    firstName: "",
    lastName: "",
    rank: "",
    squad: "",
    team: "",
    role: "",
}

type SoldierAddProp = {
    onSubmit:(soldier: Soldier) => void;
    currentSoldier?: Soldier;
}

// @ts-ignore
const SoldierAdd = ({onSubmit, currentSoldier} :SoldierAddProp) => {
    const [soldierData, setSoldierData] = useState<Soldier>(currentSoldier || initialSoldierSet);
    const [open, setOpen] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setSoldierData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleReset = () => {
        setSoldierData(initialSoldierSet);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!soldierData.firstName || !soldierData.lastName || !soldierData.rank || !soldierData.squad) {
            alert("Please fill in your soldier information");
            return;
        }

        await onSubmit(soldierData)

        setOpen(false);
        setSoldierData(initialSoldierSet);
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant={"outline"} size={currentSoldier ? "sm" : "lg"} className={"bg-accent"}>
                        {currentSoldier ? "Edit" : <UserRoundPlus />}
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-card rounded-lg shadow-lg p-6">
                    <div className={""}>
                    <form id="addSoldier" onSubmit={handleSubmit} onReset={handleReset}>
                        <DialogHeader>
                            <DialogTitle>{currentSoldier ? "Edit Soldier" : "Add Soldier"}</DialogTitle>
                            <DialogDescription>
                                {currentSoldier ? "Edit this Soldier" : "Add a New Soldier to the Platoon."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className={"grid gap-4 m-4"}>
                            <div className={"flex justify-between"}>
                            {/*First Name*/}
                            <div className={"grid gap-4"}>
                                <div className={"grid gap-3"}>
                                    <Label htmlFor={"soldierFirstName"}>First Name</Label>
                                    <InputGroup>
                                        <InputGroupInput
                                            id={"soldierFirstName"}
                                            name={"firstName"}
                                            value={soldierData.firstName}
                                            onChange={handleChange}
                                            placeholder={"John"}
                                            type={"text"}
                                            className={"!pl-1"}/>
                                    </InputGroup>
                                </div>
                            </div>

                            {/*Last Name*/}
                            <div className={"grid gap-4"}>
                                <div className={"grid gap-3"}>
                                    <Label htmlFor={"soldierLastName"}>Last Name</Label>
                                    <InputGroup>
                                        <InputGroupInput
                                            id={"soldierLastName"}
                                            name={"lastName"}
                                            value={soldierData.lastName}
                                            onChange={handleChange}
                                            placeholder={"Doe"}
                                            type={"text"}
                                            className={"!pl-1"}/>
                                    </InputGroup>
                                </div>
                            </div>
                            </div>

                            {/*Rank*/}
                            <div className={"grid gap-4"}>
                                <div className={"grid gap-3"}>
                                    <Label htmlFor={"soldierRank"}>Rank</Label>
                                    <InputGroup>
                                        <InputGroupInput
                                            id={"soldierRank"}
                                            name={"rank"}
                                            value={soldierData.rank}
                                            onChange={handleChange}
                                            placeholder={"PV1"}
                                            type={"text"}
                                            className={"!pl-1"}/>
                                    </InputGroup>
                                </div>
                            </div>
                            <div className={"flex justify-between"}>
                                {/*Squad*/}
                                <div className={"grid gap-4"}>
                                    <div className={"grid gap-3"}>
                                        <Label htmlFor={"soldierSquad"}>Squad</Label>
                                        <InputGroup>
                                            <InputGroupInput
                                                id={"soldierSquad"}
                                                name={"squad"}
                                                value={soldierData.squad}
                                                onChange={handleChange}
                                                placeholder={"1 2 3 WPNs"}
                                                type={"text"}
                                                className={"!pl-1"}/>
                                        </InputGroup>
                                    </div>
                                </div>

                                {/*Team*/}
                                <div className={"grid gap-4"}>
                                    <div className={"grid gap-3"}>
                                        <Label htmlFor={"soldierTeam"}>Team</Label>
                                        <InputGroup>
                                            <InputGroupInput
                                                id={"soldierTeam"}
                                                name={"team"}
                                                value={soldierData.team}
                                                onChange={handleChange}
                                                placeholder={"A / B"}
                                                type={"text"}
                                                className={"!pl-1"}/>
                                        </InputGroup>
                                    </div>
                                </div>
                            </div>
                            {/*Role*/}
                            <div className={"grid gap-4"}>
                                <div className={"grid gap-3"}>
                                    <Label htmlFor={"soldierRole"}>Role</Label>
                                    <InputGroup>
                                        <InputGroupInput
                                            id={"soldierRole"}
                                            name={"role"}
                                            value={soldierData.role}
                                            onChange={handleChange}
                                            placeholder={"Grenadier"}
                                            type={"text"}
                                            className={"!pl-1"}/>
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
                    </div>
                </DialogContent>

            </Dialog>
        </>

    );
};

export default SoldierAdd;