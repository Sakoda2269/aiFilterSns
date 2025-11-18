"use client"

import Posts from "@/components/posts/Posts";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEllipsisV, FaUser, FaHeart, FaEdit } from "react-icons/fa";

export default function AccountPage() {

    const [followerNum, setFollowerNum] = useState(0);
    const [followeeNum, setFolloweeNum] = useState(0);
    const [accountName, setAccountName] = useState("");
    const [following, setFollowing] = useState(false);
    const [accountId, setAccountId] = useState("");
    const [loading, setLoading] = useState(true);
    const [statusCode, setStatusCode] = useState(0)
    const params = useParams();
    const serachParams = useSearchParams();
    const myAccount = serachParams.get("myaccount");
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [posts, setPosts] = useState([])
    const [likePosts, setLikePosts] = useState([]);
    const [tabKey, setTabKey] = useState("all");
    const [isChanged, setIsChange] = useState(false)

    const [accountPostPageNum, setAccountPostPageNum] = useState(0)
    const [accountPostLastPage, setAccountPostLastPage] = useState(false);
    const [accountLikedPostPageNum, setAccountLikedPostPageNum] = useState(0);
    const [accountLikedPostLastPage, setAccountLikedPostLastpage] = useState(false);

    const [id, setId] = useAuth();

    const getAccountPosts = async () => {
        const res = await fetch("/api/accounts/" + params.account_id + "/posts?page=0", { method: "GET", credentials: "same-origin" })
        if (res.ok) {
            const data = await res.json();
            setPosts(data.posts);
            setAccountPostLastPage(data.last)
        } else {
            setPosts([])
            setAccountPostLastPage(false)
        }
    }

    const getLikePosts = async () => {
        const res = await fetch("/api/accounts/" + params.account_id + "/posts/likes?page=0", { method: "GET", credentials: "same-origin" })
        if (res.ok) {
            const data = await res.json();
            setLikePosts(data.posts);
            setAccountLikedPostLastpage(data.last)
        } else {
            setLikePosts([]);
            setAccountLikedPostLastpage(false)
        }
    }

    const addAccountPostPage = async () => {
        const res = await fetch("/api/accounts/" + params.account_id + "/posts?page=" + (accountPostPageNum + 1), { method: "GET", credentials: "same-origin" })
        if (res.ok) {
            const data = await res.json();
            setPosts(p => [...p, ...data.posts]);
            setAccountPostPageNum(p => p + 1)
            setAccountPostLastPage(data.last)
        } else {
        }
    }

    const addLikedPostPage = async() => {
        const res = await fetch("/api/accounts/" + params.account_id + "/posts/likes?page=" + (accountLikedPostPageNum + 1), { method: "GET", credentials: "same-origin" })
        if (res.ok) {
            const data = await res.json();
            setLikePosts(p => [...p, ...data.posts]);
            setAccountLikedPostPageNum(p => p + 1)
            setAccountLikedPostLastpage(data.last)
        } else {
        }
    }

    useEffect(() => {
        const getAccount = async () => {
            const res = await fetch("/api/accounts/" + params.account_id, {
                method: "GET",
                credentials: 'same-origin'
            });
            if (res.ok) {
                const data = await res.json();
                setAccountName(data.name);
                setFolloweeNum(data.followeeNum);
                setFollowerNum(data.followerNum);
                setFollowing(data.following);
            }
            setStatusCode(res.status)
            if (res.status === 404) {
                setId("");
            }
            setLoading(false)
        }
        getAccount();
        setAccountId(params.account_id);
        getAccountPosts();
        getLikePosts();
    }, [params.account_id, myAccount, setId])

    const tabSelect = (k) => {
        setTabKey(k)
        if(k === "all") {
            if(isChanged) {
                getAccountPosts();
                setIsChange(false);
            }
        } else if(k === "like") {
            if(isChanged) {
                getLikePosts();
                setIsChange(false);
            }
        }
    }

    const openMenu = (e) => {
        e.stopPropagation();
        setMenuOpen(!menuOpen)
    }

    return (
        <div onClick={() => setMenuOpen(false)} className="min-h-screen bg-gray-50">
            {loading ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto px-4 py-6">
                    {(200 <= statusCode) && (statusCode <= 299) && (
                        <div className="space-y-6">
                            <Header 
                                openMenu={openMenu} 
                                accountId={accountId} 
                                followeeNum={followeeNum}
                                followerNum={followerNum}
                                following={following}
                                accountName={accountName}
                                menuOpen={menuOpen}
                                setFollowing={setFollowing}
                                setFollowerNum={setFollowerNum}
                            />
                            
                            {/* Custom Tabs */}
                            <div className="card">
                                <div className="flex border-b border-gray-200">
                                    <button
                                        className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-200 ${
                                            tabKey === "all"
                                                ? "text-primary-600 border-b-2 border-primary-600"
                                                : "text-gray-500 hover:text-gray-700"
                                        }`}
                                        onClick={() => tabSelect("all")}
                                    >
                                        <FaEdit className="inline mr-2" />
                                        自分の投稿
                                    </button>
                                    <button
                                        className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-200 ${
                                            tabKey === "like"
                                                ? "text-primary-600 border-b-2 border-primary-600"
                                                : "text-gray-500 hover:text-gray-700"
                                        }`}
                                        onClick={() => tabSelect("like")}
                                    >
                                        <FaHeart className="inline mr-2" />
                                        イイねした投稿
                                    </button>
                                </div>
                                
                                <div className="p-6">
                                    {tabKey === "all" && (
                                        <Posts 
                                            posts={posts} 
                                            reload={() => setIsChange(true)} 
                                            addPage={addAccountPostPage} 
                                            isLast={accountPostLastPage}
                                        />
                                    )}
                                    {tabKey === "like" && (
                                        <Posts 
                                            posts={likePosts} 
                                            reload={() => setIsChange(true)} 
                                            addPage={addLikedPostPage} 
                                            isLast={accountLikedPostLastPage}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {statusCode === 404 && (
                        <div className="flex items-center justify-center min-h-screen">
                            <div className="card text-center max-w-md">
                                <div className="mb-6">
                                    <FaUser className="mx-auto text-6xl text-gray-300 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        アカウントが見つかりません
                                    </h3>
                                    <p className="text-gray-600">
                                        指定されたアカウントは存在しないか、削除されています。
                                    </p>
                                </div>
                                {myAccount && (
                                    <Link href="/login">
                                        <button className="btn-primary">
                                            ログイン
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function Header({openMenu, accountId, followeeNum, followerNum, accountName, following, menuOpen, setFollowing, setFollowerNum}) {
    const router = useRouter()
    const [id, setId] = useAuth();

    const follow = async () => {
        const res = await fetch("/api/accounts/" + accountId + "/follow", {
            body: JSON.stringify({ "follow": true }),
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: 'same-origin'
        });
        if (res.ok) {
            setFollowing(true);
            const num = await res.text();
            setFollowerNum(Number(num))
        }
    }

    const unFollow = async () => {
        const res = await fetch("/api/accounts/" + accountId + "/follow", {
            body: JSON.stringify({ "follow": false }),
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: 'same-origin'
        });
        if (res.ok) {
            setFollowing(false);
            const num = await res.text();
            setFollowerNum(Number(num))
        }
    }

    const logout = async (e) => {
        e.stopPropagation();
        setId("");
        const res = await fetch("/api/logout", {
            method: "POST",
            credentials: "same-origin"
        })
        router.push("/home")
    }

    return (
        <div className="card">
            <div className="flex items-start justify-between">
                {/* Profile Info */}
                <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                            <FaUser className="text-white text-xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">{accountName}</h1>
                            <div className="flex space-x-6 text-sm text-gray-600">
                                <span>
                                    <span className="font-semibold text-gray-900">{followerNum}</span> フォロワー
                                </span>
                                <span>
                                    <span className="font-semibold text-gray-900">{followeeNum}</span> フォロー中
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Follow Button */}
                    {(id !== accountId && id !== "" && id !== null) && (
                        <div className="mb-4">
                            {!following ? (
                                <button 
                                    className="btn-primary px-6 py-2 rounded-full"
                                    onClick={follow}
                                >
                                    フォロー
                                </button>
                            ) : (
                                <button 
                                    className="btn-secondary px-6 py-2 rounded-full border border-gray-300"
                                    onClick={unFollow}
                                >
                                    フォロー解除
                                </button>
                            )}
                        </div>
                    )}
                </div>
                
                {/* Menu */}
                <div className="relative">
                    <button 
                        className="btn-ghost p-2 rounded-full"
                        onClick={openMenu}
                    >
                        <FaEllipsisV className="text-gray-400" />
                    </button>
                    
                    {menuOpen && (
                        <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]">
                            {accountId === id && (
                                <button 
                                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                    onClick={logout}
                                >
                                    ログアウト
                                </button>
                            )}
                            <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50">
                                通報
                            </button>
                            {accountId === id && (
                                <Link href="/accounts/delete">
                                    <button className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50">
                                        アカウント削除
                                    </button>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}