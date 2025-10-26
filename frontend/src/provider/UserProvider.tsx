import type {User} from "@/interface/User.tsx";
import React, {createContext, useContext, useEffect, useState} from "react";
import {useAuth} from "@/provider/AuthProvider.tsx";
import { apiUrl } from "@/config/api";  // ← ADD THIS

interface UserContextType {
    user: User | null;
    setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
});

export const UserProvider = ({children}:{children: React.ReactNode}) => {
    const {userId} = useAuth()
    const [user, setUser] = useState<User | null>(null);


    useEffect(() => {

        if (!userId) {
            console.log("User ID not ready yet:", userId);
            return;
        }

        async function fetchUser(userId: number): Promise<User | null> {
            try {
                const res = await fetch(apiUrl("/api/user/getProfile/" + userId), {  // ← CHANGED THIS LINE
                    method: "GET",
                });
                const data: User = await res.json();
                return data;
            } catch (err) {
                console.error("Error fetching items:", err);
                return null;
            }
        }
        fetchUser(Number(userId)).then((data) => setUser(data))
    }, [userId]);

    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};