"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

import { FaCircleUser } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/sidebar/Sidebar";

export default function Layout({ children }) {

    const path = usePathname().split("/");

    let first = "";
    if(path.length > 1) {
        first = path[1];
    }

    return (
        <div>
            {/* <header style={{ background: "gray", height: "5vh" }}>
                hello
            </header> */}
            <AuthProvider>
            <div className="row">
                <div className="col-1 container mt-3">
                    <Sidebar first={first}/>
                </div>
                <div className="col-9">
                    {children}
                </div>
                <div className="col-2">

                </div>
            </div>
            </AuthProvider>
        </div>
    )
}