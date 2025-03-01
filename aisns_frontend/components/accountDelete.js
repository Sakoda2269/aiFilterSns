"use client"

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react"

export default function AccountDeletePage() {

    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const searchParams = useSearchParams();
    const router = useRouter();
    const success = searchParams.get("success");

    const deleteAccount = async (e) => {
        const res = await fetch("/api/accounts/delete", {
            method: "POST",
            body: JSON.stringify({ "password": password }),
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin"
        });
        if (res.ok) {
            router.push("/accounts/delete?success=true")
            setError("");
            sessionStorage.removeItem("id")
        } else {
            if (res.status == 403) {
                setError("パスワードが違います")
            }
        }
    }

    return (
        <div className="container mt-3">
            {success ? (
                <div>
                    <h2>アカウント削除に成功しました</h2>
                    <Link href="/login"><button className="btn btn-primary">ログインする</button></Link>
                </div>
            ) : (
                <>
                    <h2>アカウント削除</h2>
                    <div>
                        <p style={{ color: "red" }}>アカウントを削除するともとに戻せません！</p>
                        <div>
                            <label className="form-label">パスワードを入力</label>
                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <label style={{color: "red"}}>{error}</label>
                        </div>
                        <div className="mt-3" style={{ textAlign: "right" }}>
                            <button className="btn btn-danger" onClick={deleteAccount}>削除する</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}