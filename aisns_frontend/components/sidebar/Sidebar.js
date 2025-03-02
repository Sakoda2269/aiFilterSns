import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";

export default function Sidebar({first}) {

    const router = useRouter();
    const [id] = useAuth();

    const accountPage = () => {
        if (id != "") {
            router.push("/accounts/" + id + "?myaccount=true")
        } else {
            router.push("/login")
        }
    }

    return (
        <div style={{ position: "fixed", display: "flex", flexDirection: "column", borderRight: "1px solid black", height: "95vh", alignItems: "center" }}>
            <div style={{ padding: "10px" }}>
                <Link href="/home"><button className="btn"><FaHome size={30} color={first == "home" ? "blue":"black"}/></button></Link>
            </div>
            <div style={{ padding: "10px" }}>
                <button className="btn" onClick={accountPage}><FaCircleUser size={30} color={first == "accounts" ? "blue":"black"}/></button>
            </div>
        </div>
    )
}