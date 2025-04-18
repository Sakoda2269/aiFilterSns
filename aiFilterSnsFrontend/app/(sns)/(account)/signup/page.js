"use client"

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [pass, setPass] = useState("");
    const [repass, setRepass] = useState("");
    const [error, setError] = useState("");
    const [id, setId] = useAuth();

    const login = async (email, pass) => {
        const body = {
            email: email,
            password: pass
        };
        const header = { "Content-Type": "application/json" };
        const res = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify(body),
            headers: header, 
            credentials: 'same-origin'
        });
        if(res.ok) {
            const data = await res.text();
            setId(data);
            router.push("/accounts/" + data);
        }
    }

    const signup = async () => {
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
            let text = await res.text();
            text = text.substring(1, text.length - 1);
            await login(email, pass);
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
                <button className="btn btn-primary" onClick={signup}>登録</button>
            </div>
        </div>
    )
}