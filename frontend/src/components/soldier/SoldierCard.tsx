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
import type { SoldierCardProps} from "@/type/Soldier.tsx";
import {useUser} from "@/provider/UserProvider.tsx";
import {apiUrl} from "@/config/api.tsx";
import SoldierAdd from "@/components/soldier/SoldierAdd.tsx";

const SoldierCard = ({soldier, onDelete, onSubmit}: SoldierCardProps) => {
    const {user} = useUser();
    const [open, setOpen] = useState(false);
    const admin = user?.role === "ADMIN";

    const handleDelete = async () => {
        try {
            const res = await fetch(apiUrl("/api/soldier/delete/" + soldier.id), {
                method: "DELETE",
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.log("Failed to delete soldier. Status:", res.status);
                console.log("Error response:", errorText);
                alert("Failed to delete soldier. Check console for details.");
                return;
            }
            onDelete(soldier.id)
        } catch (err) {
            console.log("Error deleting soldier: ", err);
            alert("Error deleting soldier: " + err);
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <div>
                        <Card className={"cursor-pointer hover:shadow-lg transition-shadow"}>
                            <CardHeader className={"flex flex-col items-center gap-2 p-4"}>
                                <CardTitle>{soldier.rank} {soldier.lastName}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={"grid gap-4"}>
                                    {soldier.squad} {soldier.team}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </DialogTrigger>
                <DialogContent aria-describedby={"More Info"}>
                    <DialogTitle>
                    </DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                    <div>
                        <Card className={""}>
                            <CardHeader className={"flex flex-col items-center gap-2 p-4"}>
                                <CardTitle>{soldier.rank} {soldier.firstName} {soldier.lastName}</CardTitle>
                            </CardHeader>
                            <CardContent className={"flex flex-col items-center gap-2"}>
                                <div>{soldier.squad} {soldier.team}</div>
                                <div>{soldier.role}</div>

                            </CardContent>
                            <CardFooter className={"px-4 py-2 flex items-center"}>
                                {admin && <Button
                                    size="sm"
                                    variant="destructive"
                                    className="gap-2"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>}
                                <SoldierAdd onSubmit={onSubmit} currentSoldier={soldier}/>
                            </CardFooter>
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>

        </>
    );
};

export default SoldierCard;