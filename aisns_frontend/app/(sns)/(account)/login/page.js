"use client"

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"


export default function Login() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState("");

    const [id, setId] = useAuth();

    useEffect(() => {
        if(id != "") {
            router.push("/home")
        }
    }, [id, router])

    const send = async () => {
        const body = {
            email: email,
            password: pass
        };
        const header = { "Content-Type": "application/json" };
        const res = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            body: JSON.stringify(body),
            headers: header, 
            credentials: 'include'
        });
        if(res.ok) {
            const data = await res.text();
            setId(data);
            router.push("/accounts/" + data);
        } else {
            setError("メールアドレスまたはパスワードが違います");
        }
    }

    return (
        <div className="container mt-3">
            <h3>ログイン</h3>
            <div className="mt-3">
                <label className="form-label"><b>メールアドレス</b></label>
                <input type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="mt-3">
                <label className="form-label"><b>パスワード</b></label>
                <input type="password" className="form-control" value={pass} onChange={(e) => setPass(e.target.value)}/>
            </div>
            { error != "" && 
                <div className="mt-3" style={{color: "red"}}>
                    {error}
                </div>
            }
            <div className="mt-3">
                <button className="btn btn-primary" onClick={send}>ログイン</button>
            </div>
            <div className="mt-3">
                <p>または</p>
                <Link href={"/signup"}>
                    <button className="btn btn-success">新規登録</button>
                </Link>
            </div>
        </div>
    )
}