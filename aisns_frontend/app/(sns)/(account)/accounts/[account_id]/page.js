"use client"

import Posts from "@/components/posts/Posts";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountPage() {

    const [accountId, setAccountId] = useState("");
    const [accountName, setAccountName] = useState("");
    const [loading, setLoading] = useState(true);
    const [followerNum, setFollowerNum] = useState(0);
    const [followeeNum, setFolloweeNum] = useState(0);
    const [following, setFollowing] = useState(false);
    const [statusCode, setStatusCode] = useState(0)
    const [id, setId] = useState("");
    const params = useParams();
    const serachParams = useSearchParams();
    const myAccount = serachParams.get("myaccount");
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const getAccount = async () => {
            const res = await fetch("/api/accounts/" + params.account_id, {
                method: "GET",
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                setAccountName(data.name);
                setFolloweeNum(data.followeeNum);
                setFollowerNum(data.followerNum);
                setFollowing(data.following);
            }
            setStatusCode(res.status)
            if (res.status == 404 && myAccount) {
                router.push("/login")
            }
            setLoading(false)
        }

        const getAccountPosts = async() => {
            const res = await fetch("/api/accounts/" + params.account_id + "/posts", {method: "GET"})
            if(res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        }

        setAccountId(params.account_id);
        setId(sessionStorage.getItem("id"));
        getAccount();
        getAccountPosts();
    }, [params, myAccount, router])

    const follow = async () => {
        const res = await fetch("/api/accounts/" + accountId + "/follow", {
            body: JSON.stringify({ "follow": true }),
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: 'include'
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
            credentials: 'include'
        });
        if (res.ok) {
            setFollowing(false);
            const num = await res.text();
            console.log(num)
            setFollowerNum(Number(num))
        }
    }

    const logout = async (e) => {
        e.stopPropagation();
        sessionStorage.removeItem("id");
        const res = await fetch("/api/logout", {
            method: "POST",
            credentials: "same-origin"
        })
        router.push("/home")
    }

    const openMenu = (e) => {
        e.stopPropagation();
        setMenuOpen(!menuOpen)
    }

    return (
        <div>
            {loading ? (<div>loading...</div>) :
                (
                    <div>
                        {(200 <= statusCode) && (statusCode <= 299) &&
                            <div className="container mt-3">
                                <div className="lr">
                                    <span>
                                        <span style={{ display: "flex" }}>
                                            <h3>{accountName}</h3>
                                            {id != accountId && <div className="container">
                                                {!following ?
                                                    <button className="btn btn-primary rounded-pill" onClick={follow}>フォロー</button>
                                                    :
                                                    <button className="btn btn-secondary rounded-pill" onClick={unFollow}>フォロー解除</button>}
                                            </div>}
                                        </span>
                                        <div className="container">
                                            <div>フォロワー:&nbsp;{followerNum}</div>
                                            <div>フォロー中:&nbsp;{followeeNum}</div>
                                        </div>
                                    </span>
                                    <span>
                                        <span style={{ marginLeft: "30px", position: "relative" }}>
                                            <button className="btn rounded-circle border-secondary" onClick={openMenu}>︙</button>
                                            {menuOpen && <div className="border rounded border-secondary"
                                                style={{ position: "absolute", left: "-130px", top: "20px", background: "white", padding: "1px" }}>
                                                {accountId == id && <div>
                                                    <button className="btn btn-light" style={{padding: "5px 10px", width: "150px" }} onClick={logout}>ログアウト</button>
                                                </div>}
                                                <div>
                                                    <button className="btn btn-light" style={{ padding: "5px 10px", width: "150px" }}>通報</button>
                                                </div>
                                                {accountId == id && <div>
                                                    <button className="btn btn-light" style={{color: "red", padding: "5px 10px", width: "150px" }}>アカウント削除</button>
                                                </div>}
                                            </div>}
                                        </span>
                                    </span>
                                </div>
                                <div className="mt-3" style={{textAlign: "center"}}>
                                    <h4>投稿一覧</h4>
                                    <Posts posts={posts} />
                                </div>
                            </div>
                        }
                        {statusCode == 404 &&
                            <div className="container mt-3">
                                <h3>アカウントが見つかりません</h3>
                            </div>
                        }
                    </div>
                )
            }
        </div>
    );
}