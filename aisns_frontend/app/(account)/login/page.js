"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"


export default function Login() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState("");

    const send = async () => {
        const body = {
            email: email,
            password: pass
        };
        const header = { "Content-Type": "application/json" };
        const res = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify(body),
            headers: header
        });
        if(res.ok) {
            router.push("/home");
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