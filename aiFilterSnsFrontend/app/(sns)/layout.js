"use client"
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import Sidebar from "@/components/sidebar/Sidebar";

export default function Layout({ children }) {
    const path = usePathname().split("/");
    let first = "";
    if(path.length > 1) {
        first = path[1];
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AuthProvider>
                <div className="flex">
                    <div className="w-16 lg:w-64 fixed h-full">
                        <Sidebar first={first}/>
                    </div>
                    <div className="flex-1 ml-16 lg:ml-64">
                        <main className="max-w-4xl mx-auto px-4 py-6">
                            {children}
                        </main>
                    </div>
                </div>
            </AuthProvider>
        </div>
    )
}