"use client";
import { createContext, useContext, useEffect, useState } from "react";

const authContext = createContext();
const filtersContext = createContext();

export function AuthProvider ({children}) {
    const [isAuth, setIsAuth] = useState("");
    const [filters, setFilters] = useState([]);

    useEffect(() => {
        const getAuth = async () => {
            const res = await fetch("/api/auth", { method: "POST", credentials: "same-origin" });
            if(res.ok) {
                const text = await res.text();
                setIsAuth(text);
            }
        }
        const getFilters = async() => {
            const res = await fetch("/api/ai/filter", {
                method: "GET",
                credentials: "same-origin"
            });
            if(res.ok) {
                const data = await res.json();
                setFilters(data);
            } else {
                setFilters(["エラー"]);
            }
        }
        getAuth();
        getFilters();
    }, [])

    return (
        <authContext.Provider value={{ isAuth, setIsAuth }}>
        <filtersContext.Provider value={{filters}}>
            {children}
        </filtersContext.Provider>
        </authContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(authContext);
    if(!context) {
        throw new Error("useAuth must be used with AuthProvider");
    }
    return [context.isAuth, context.setIsAuth];
}

export function useFilters() {
    const context = useContext(filtersContext);
    if(!context) {
        throw new Error("useFilters must be used with FilterProvider");
    }
    return context.filters;
}