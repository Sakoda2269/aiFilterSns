"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [pass, setPass] = useState("");
    const [repass, setRepass] = useState("");
    const [error, setError] = useState("");

    const send = async () => {
        if(pass != repass) {
            setError("パスワードが一致しません");
            return
        }
        const body = {
            email: email,
            name: name,
            password: pass
        };
        const header = { "Content-Type": "application/json" };
        const res = await fetch("/api/signup", {
            method: "POST",
            body: JSON.stringify(body),
            headers: header,
        });
        if(res.ok) {
            router.push("/login");
        } else {
            const data = await res.text();
            setError(data);
        }
    }

    return (
        <div className="container mt-3">
            <h3>アカウント登録</h3>
            <div className="mt-3">
                <label className="form-label"><b>メールアドレス</b></label>
                <input type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="mt-3">
                <label className="form-label"><b>アカウント名</b></label>
                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className="mt-3">
                <label className="form-label"><b>パスワード</b></label>
                <input type="password" className="form-control" value={pass} onChange={(e) => setPass(e.target.value)}/>
            </div>
            <div className="mt-3">
                <label className="form-label"><b>パスワード確認</b></label>
                <input type="password" className="form-control" value={repass} onChange={(e) => setRepass(e.target.value)}/>
            </div>
            {error != "" && <div className="mt-3" style={{color: "red"}}>
                {error}
            </div>}
            <div className="mt-3">
                <button className="btn btn-primary" onClick={send}>登録</button>
            </div>
        </div>
    )
}