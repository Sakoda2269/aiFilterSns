"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

import { FaCircleUser } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";

export default function Layout({ children }) {

    const router = useRouter();
    const path = usePathname().split("/");
    let first = "";
    if(path.length > 1) {
        first = path[1];
    }

    const accountPage = () => {
        const id = sessionStorage.getItem("id")
        if (id != null) {
            router.push("/accounts/" + id + "?myaccount=true")
        } else {
            router.push("/login")
        }
    }

    return (
        <div>
            {/* <header style={{ background: "gray", height: "5vh" }}>
                hello
            </header> */}
            <div className="row">
                <div className="col-1 container mt-3">
                    <div style={{ position: "fixed", display: "flex", flexDirection: "column", borderRight: "1px solid black", height: "95vh", alignItems: "center" }}>
                        <div style={{ padding: "10px" }}>
                            <Link href="/home"><button className="btn"><FaHome size={30} color={first == "home" ? "blue":"black"}/></button></Link>
                        </div>
                        <div style={{ padding: "10px" }}>
                            <button className="btn" onClick={accountPage}><FaCircleUser size={30} color={first == "accounts" ? "blue":"black"}/></button>
                        </div>
                    </div>
                </div>
                <div className="col-9">
                    {children}
                </div>
                <div className="col-2">

                </div>
            </div>
        </div>
    )
}