import {useEffect, useState} from 'react';
import {useAuth} from "@/provider/AuthProvider.tsx";
import SoldierCard from "@/components/soldier/SoldierCard.tsx";
import type {Soldier} from "@/type/Soldier.tsx";
import SoldierAdd from "@/components/soldier/SoldierAdd.tsx";
import {useUser} from "@/provider/UserProvider.tsx";
import {UserRoundMinus} from "lucide-react";
import {apiUrl} from "@/config/api.tsx";

const PlatoonPage = () => {
    const {isLoggedIn} = useAuth();
    const {user} =  useUser();
    const [soldiers, setSoldiers] = useState<Soldier[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchSoldiers = async () => {
            try {
                const res = await fetch(apiUrl("/api/soldier/soldiers"))
                const data = await res.json();
                setSoldiers(data)
            } catch (e) {
                console.log("Error fetching widgets:", e)
            } finally {
                setLoading(false);
            }
        }

        fetchSoldiers();
    }, []);

    async function handleAddSoldier(newSoldier: Soldier) {
        if (!user) {
            console.error("No user logged in");
            alert("You must be logged in to create a widget");
            return;
        }

        try{
            const res = await fetch(apiUrl("/api/soldier/new_soldier"), {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newSoldier),
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.log("Failed to add soldier. Status:", res.status);
                console.log("Error response:", errorText);
                alert("Failed to create soldier. Check console for details.");
                return;
            }

            const text = await res.text();
            if (text) {
                const createdSoldier = JSON.parse(text);
                setSoldiers(prev => [...prev, createdSoldier]);
                alert("Soldier added successfully!");
            } else {
                console.warn("Empty response from server; refreshing list...");
                const refreshRes = await fetch("http://localhost:8080/api/soldier/soldiers");
                const allSoldiers = await refreshRes.json();
                setSoldiers(allSoldiers);
            }

        } catch (err) {
            console.log("Error adding soldier: ", err);
            alert("Error creating soldier: " + err);
        }
    }

    async function handleEdit(newSoldier: Soldier) {
        if (!user) {
            console.error("No user logged in");
            alert("You must be logged in to create a widget");
            return;
        }
        const soldierToUpdate = {
            id: newSoldier.id,
            firstName: newSoldier.firstName,
            lastName: newSoldier.lastName,
            rank: newSoldier.rank,
            squad: newSoldier.squad,
            team: newSoldier.team,
            role: newSoldier.role,
        }

        try{
            const res = await fetch(apiUrl("/api/soldier/new_soldier"), {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(soldierToUpdate),
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.log("Failed to edit soldier. Status:", res.status);
                console.log("Error response:", errorText);
                alert("Failed to edit soldier. Check console for details.");
                return;
            }

            const text = await res.text();
            if (text) {
                setSoldiers(prev => prev.map(soldier => soldier.id === newSoldier.id ? newSoldier : soldier));
                alert("Soldier edited successfully!");
            }

        } catch (err) {
            console.log("Error editing soldier: ", err);
        }
    }


    return (
        <>
            <div className={"px-32"}>
                {isLoggedIn && <div className={"pt-16 px-8 mb-5"}>
                    <SoldierAdd onSubmit={handleAddSoldier}/>
                </div>}

                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-muted-foreground">Loading soldiers...</div>
                    </div>
                ) : soldiers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
                            <div className="rounded-full bg-muted p-6 mb-4">
                                <UserRoundMinus className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <h3 className="text-2xl font-semibold tracking-tight mb-2">
                                No soldiers yet
                            </h3>
                            <p className="text-muted-foreground max-w-sm mb-6">
                                {isLoggedIn
                                    ? "Get started by adding your first soldier using the button above."
                                    : "Log in to create and manage your platoon."
                                }
                            </p>
                        </div>
                    ) :
                    (
                        <div className={"grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6"}>
                    <div
                        className={"rounded-lg text-center text-white opacity-75 p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"}>
                        {soldiers.map((soldier) => (
                            <SoldierCard
                                key={soldier.id}
                                soldier={soldier}
                                onDelete={(id: number | undefined) => setSoldiers(prev => prev.filter(s => s.id !== id))}
                                onSubmit={handleEdit}
                            />
                        ))}
                    </div>
                </div>
                    )
                }
            </div>
        </>
    );
};

export default PlatoonPage;