"use client"

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEnvelope, FaLock, FaUser, FaUserPlus, FaSignInAlt } from "react-icons/fa";

export default function Signup() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [pass, setPass] = useState("");
    const [repass, setRepass] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
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
        if (!email || !name || !pass || !repass) {
            setError("すべての項目を入力してください");
            return;
        }

        if(pass != repass) {
            setError("パスワードが一致しません");
            return;
        }

        if(pass.length < 6) {
            setError("パスワードは6文字以上で入力してください");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
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
        } catch (err) {
            setError("登録に失敗しました");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        アカウント登録
                    </h2>
                    <p className="text-gray-600">
                        新しいアカウントを作成してください
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
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                アカウント名
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="text-gray-400" />
                                </div>
                                <input 
                                    type="text" 
                                    className="input-field pl-10"
                                    placeholder="表示名を入力"
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)}
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
                                    placeholder="6文字以上で入力"
                                    value={pass} 
                                    onChange={(e) => setPass(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                パスワード確認
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input 
                                    type="password" 
                                    className="input-field pl-10"
                                    placeholder="パスワードを再入力"
                                    value={repass} 
                                    onChange={(e) => setRepass(e.target.value)}
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
                            onClick={signup}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <FaUserPlus />
                            )}
                            <span>{isLoading ? '登録中...' : 'アカウント登録'}</span>
                        </button>
                    </div>
                </div>
                
                <div className="text-center">
                    <p className="text-gray-600 mb-4">すでにアカウントをお持ちの方</p>
                    <Link href="/login">
                        <button className="btn-secondary flex items-center space-x-2 mx-auto">
                            <FaSignInAlt />
                            <span>ログイン</span>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}