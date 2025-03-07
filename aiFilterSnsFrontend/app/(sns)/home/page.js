"use client"
import Posts from "@/components/posts/Posts";
import PostSender from "@/components/postSender/postSender";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react"
import { Tab, Tabs } from "react-bootstrap";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [followPosts, setFollowPosts] = useState([]);
    const [id, setId] = useAuth();
    const [tabKey, setTabKey] = useState("all");
    const [isPostChange, setIsPostChange] = useState(false);
    const [allPostPageNum, setAllPostPageNum] = useState(0)
    const [allPostLastPage, setAllPostLastPage] = useState(false);
    const [followPostPageNum, setFollowPostPageNum] = useState(0);
    const [followPostLastPage, setFollowPostLastPage] = useState(false);



    const getAllPost = async () => {
        let res;
        if(id != "" || id != null) {
            res = await fetch("/api/posts?page=0", { method: "GET", credentials: "include" })
        } else {
            res = await fetch("/api/posts?page=0", { method: "GET", credentials: "include"})
        }
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
        const res = await fetch("/api/posts/follow?page=0", { method: "GET", credentials: "include" })
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
        const res = await fetch("/api/posts?page="+(allPostPageNum + 1), { method: "GET", credentials: "include" })
        if (res.ok) {
            const data = await res.json();
            setPosts(prev => (
                [...prev, ...data.posts]
            ));
            setAllPostPageNum(p => p + 1);
            setAllPostLastPage(data.last)
        } else {
        }
    }

    const changeFollowPage = async() => {
        const res = await fetch("/api/posts/follow?page="+(followPostPageNum + 1), { method: "GET", credentials: "include" })
        if (res.ok) {
            const data = await res.json();
            setFollowPosts(prev => (
                [...prev, ...data.posts]
            ));
            setFollowPostPageNum(p => p + 1);
            setFollowPostLastPage(data.last)
        } else {
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

    return (
        <div>
            {id != "" ? <div>
                <div className="mt-3" style={{ textAlign: "center" }}>
                    <h3>TimeLine</h3>
                </div>
                <PostSender reload={reload} />
                <Tabs
                    id="post-tabs"
                    activeKey={tabKey}
                    onSelect={k => tabSelect(k)}
                    justify>
                    <Tab eventKey="all" title="すべて">
                        <Posts posts={posts}  reload={postChanges} addPage={changePage} isLast={allPostLastPage}/>
                    </Tab>
                    <Tab eventKey="follow" title="フォロー中">
                        <Posts posts={followPosts}  reload={postChanges} addPage={changeFollowPage} isLast={followPostLastPage}/>
                    </Tab>
                </Tabs>
            </div> :
                <div>
                    <div className="mt-3" style={{ textAlign: "center" }}>
                        <h3>TimeLine</h3>
                    </div>
                    <Posts posts={posts} addPage={changePage} isLast={allPostLastPage}/>
                </div>}
        </div>
    )
}