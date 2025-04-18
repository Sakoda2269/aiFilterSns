"use client"

import Posts from "@/components/posts/Posts";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";

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
            if (res.status == 404) {
                setId("");
            }
            setLoading(false)
        }
        getAccount();
        setAccountId(params.account_id);
        getAccountPosts();
        getLikePosts();
    }, [params, myAccount, router])

    const tabSelect = (k) => {
        setTabKey(k)
        if(k == "all") {
            if(isChanged) {
                getAccountPosts();
                setIsChange(false);
            }
        } else if(k == "like") {
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
        <div onClick={() => setMenuOpen(false)} style={{ height: "90%" }}>
            {loading ? (<div>loading...</div>) :
                (
                    <div>
                        {(200 <= statusCode) && (statusCode <= 299) &&
                            <div className="mt-3">
                                <Header 
                                    openMenu={openMenu} 
                                    accountId={accountId} 
                                    followeeNum={followeeNum}
                                    followerNum={followerNum}
                                    following={following}
                                    accountName={accountName}
                                    menuOpen={menuOpen}
                                    setFollowing = {setFollowing}
                                    setFollowerNum={setFollowerNum}
                                    />
                                <Tabs
                                    id="post-tabs"
                                    activeKey={tabKey}
                                    onSelect={k => tabSelect(k)}
                                    justify>
                                    <Tab eventKey="all" title="自分の投稿">
                                        <Posts posts={posts} reload={() => setIsChange(true)} addPage={addAccountPostPage} isLast={accountPostLastPage}/>
                                    </Tab>
                                    <Tab eventKey="like" title="イイねした投稿">
                                        <Posts posts={likePosts} reload={() => setIsChange(true)} addPage={addLikedPostPage} isLast={accountLikedPostLastPage}/>
                                    </Tab>
                                </Tabs>
                            </div>
                        }
                        {statusCode == 404 &&
                            <div className="container mt-3">
                                <h3>アカウントが見つかりません</h3>
                                {myAccount && 
                                    <div className="mt-3">
                                        <Link href="/login"><button className="btn btn-primary">ログイン</button></Link>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                )
            }
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
            console.log(num)
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
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <span style={{width: "70%"}}>
                <span style={{ display: "flex" }}>
                    <div style={{paddingRight: "20px"}}>
                        <h3>{accountName}</h3>
                    </div>
                    {(id != accountId && id != "" && id != null) && 
                        <div>
                            {!following ?
                                <button className="btn btn-primary rounded-pill" onClick={follow}>フォロー</button>
                                :
                                <button className="btn btn-secondary rounded-pill" onClick={unFollow}>フォロー解除</button>}
                        </div>
                    }
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
                            <button className="btn btn-light" style={{ padding: "5px 10px", width: "150px" }} onClick={logout}>ログアウト</button>
                        </div>}
                        <div>
                            <button className="btn btn-light" style={{ padding: "5px 10px", width: "150px" }}>通報</button>
                        </div>
                        {accountId == id && <div>
                            <Link href={"/accounts/delete"}>
                                <button className="btn btn-light" style={{ color: "red", padding: "5px 10px", width: "150px" }}>アカウント削除</button>
                            </Link>
                        </div>}
                    </div>}
                </span>
            </span>
        </div>
    )
}