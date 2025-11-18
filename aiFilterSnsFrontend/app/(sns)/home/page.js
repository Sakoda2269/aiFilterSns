"use client"
import Posts from "@/components/posts/Posts";
import PostSender from "@/components/postSender/postSender";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react"

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [followPosts, setFollowPosts] = useState([]);
    const [id] = useAuth();
    const [tabKey, setTabKey] = useState("all");
    const [isPostChange, setIsPostChange] = useState(false);
    const [allPostPageNum, setAllPostPageNum] = useState(0)
    const [allPostLastPage, setAllPostLastPage] = useState(false);
    const [followPostPageNum, setFollowPostPageNum] = useState(0);
    const [followPostLastPage, setFollowPostLastPage] = useState(false);

    const getAllPost = async () => {
        const res = await fetch("/api/posts?page=0", { method: "GET", credentials: "same-origin" })
        if (res.ok) {
            const data = await res.json();
            setPosts(data.posts);
            setAllPostLastPage(data.last)
        } else {
            setPosts([]);
            setAllPostLastPage(true)
        }
    }

    const getFollowPost = async () => {
        const res = await fetch("/api/posts/follow?page=0", { method: "GET", credentials: "same-origin" })
        if (res.ok) {
            const data = await res.json();
            setFollowPosts(data.posts);
            setFollowPostLastPage(data.last)
        } else {
            setFollowPosts([]);
            setFollowPostLastPage(true)
        }
    }

    const changePage = async() => {
        const res = await fetch("/api/posts?page="+(allPostPageNum + 1), { method: "GET", credentials: "same-origin" })
        if (res.ok) {
            const data = await res.json();
            setPosts(prev => (
                [...prev, ...data.posts]
            ));
            setAllPostPageNum(p => p + 1);
            setAllPostLastPage(data.last)
        }
    }

    const changeFollowPage = async() => {
        const res = await fetch("/api/posts/follow?page="+(followPostPageNum + 1), { method: "GET", credentials: "same-origin" })
        if (res.ok) {
            const data = await res.json();
            setFollowPosts(prev => (
                [...prev, ...data.posts]
            ));
            setFollowPostPageNum(p => p + 1);
            setFollowPostLastPage(data.last)
        }
    }

    useEffect(() => {
        getAllPost();
    }, [])

    const reload = () => {
        if (tabKey == "all") {
            getAllPost();
        } else if (tabKey == "follow") {
            getFollowPost();
        }
    }

    const postChanges = () => {
        setIsPostChange(true);
    }

    const tabSelect = (k) => {
        setTabKey(k);
        if (k == "all") {
            if(isPostChange) {
                getAllPost();
                setIsPostChange(false)
            }
            else if (posts.length == 0) {
                getAllPost();
            }
        } else if (k == "follow") {
            if(isPostChange) {
                getFollowPost();
                setIsPostChange(false);
            }
            else if (followPosts.length == 0) {
                getFollowPost();
            }
        }
    }

    const tabs = [
        { key: "all", label: "すべて", count: posts.length },
        { key: "follow", label: "フォロー中", count: followPosts.length }
    ];

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">タイムライン</h1>
                <p className="text-gray-600">最新の投稿をチェックしよう</p>
            </div>

            {/* Post Sender - Only for logged in users */}
            {id && <PostSender reload={reload} />}

            {/* Tabs */}
            {id && (
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => tabSelect(tab.key)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                        tabKey === tab.key
                                            ? 'border-primary-500 text-primary-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {tab.label}
                                    {tab.count > 0 && (
                                        <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                                            tabKey === tab.key
                                                ? 'bg-primary-100 text-primary-600'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Posts Content */}
            <div className="animate-fade-in">
                {id ? (
                    <>
                        {tabKey === "all" && (
                            <Posts 
                                posts={posts} 
                                reload={postChanges} 
                                addPage={changePage} 
                                isLast={allPostLastPage}
                            />
                        )}
                        {tabKey === "follow" && (
                            <Posts 
                                posts={followPosts} 
                                reload={postChanges} 
                                addPage={changeFollowPage} 
                                isLast={followPostLastPage}
                            />
                        )}
                    </>
                ) : (
                    <div>
                        <div className="text-center mb-6 p-6 bg-blue-50 rounded-lg">
                            <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                ログインして投稿を楽しもう
                            </h3>
                            <p className="text-blue-700">
                                アカウントを作成すると、投稿やいいね、フォローができます
                            </p>
                        </div>
                        <Posts posts={posts} addPage={changePage} isLast={allPostLastPage}/>
                    </div>
                )}
            </div>
        </div>
    )
}