"use client"

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from "react-icons/fa";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [id, setId] = useAuth();

    useEffect(() => {
        if(id != "") {
            router.push("/home")
        }
    }, [id, router])

    const send = async () => {
        if (!email || !pass) {
            setError("メールアドレスとパスワードを入力してください");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
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
            } else {
                setError("メールアドレスまたはパスワードが違います");
            }
        } catch (err) {
            setError("ログインに失敗しました");
        } finally {
            setIsLoading(false);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            send();
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        ログイン
                    </h2>
                    <p className="text-gray-600">
                        アカウントにサインインしてください
                    </p>
                </div>
                
                <div className="card">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                メールアドレス
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="text-gray-400" />
                                </div>
                                <input 
                                    type="email" 
                                    className="input-field pl-10"
                                    placeholder="your@email.com"
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                パスワード
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input 
                                    type="password" 
                                    className="input-field pl-10"
                                    placeholder="パスワードを入力"
                                    value={pass} 
                                    onChange={(e) => setPass(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                            </div>
                        </div>
                        
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        
                        <button 
                            className={`btn-primary w-full flex items-center justify-center space-x-2 ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={send}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <FaSignInAlt />
                            )}
                            <span>{isLoading ? 'ログイン中...' : 'ログイン'}</span>
                        </button>
                    </div>
                </div>
                
                <div className="text-center">
                    <p className="text-gray-600 mb-4">アカウントをお持ちでない方</p>
                    <Link href="/signup">
                        <button className="btn-secondary flex items-center space-x-2 mx-auto">
                            <FaUserPlus />
                            <span>新規登録</span>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}