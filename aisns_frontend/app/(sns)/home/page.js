"use client"
import Posts from "@/components/posts/Posts";
import PostSender from "@/components/postSender/postSender";
import { useEffect, useState } from "react"
import { Tab, Tabs } from "react-bootstrap";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [followPosts, setFollowPosts] = useState([]);
    const [id, setId] = useState("");
    const [tabKey, setTabKey] = useState("all");

    const getAllPost = async () => {
        const res = await fetch("/api/posts", { method: "GET" })
        if (res.ok) {
            const data = await res.json();
            setPosts(data);
        } else {
            setPosts([]);
        }
    }

    const getFollowPost = async () => {
        const res = await fetch("/api/posts/follow", { method: "GET", credentials: "include"})
        if (res.ok) {
            const data = await res.json();
            setFollowPosts(data);
        } else {
            setFollowPosts([]);
        }
    }

    useEffect(() => {
        const localId = sessionStorage.getItem("id");
        if (localId) {
            setId(localId);
        }
        getAllPost();
    }, [])

    const reload = () => {
        if(tabKey == "all") {
            getAllPost();
        } else if (tabKey == "follow") {
            getFollowPost();
        }
    }


    const tabSelect = (k) => {
        setTabKey(k);
        if(k == "all") {
            if(posts.length == 0) {
                getAllPost();
            }
        } else if(k == "follow") {
            if(followPosts.length == 0) {
                getFollowPost();
            }
        }
    }

    return (
        <div>
            {id != "" ? <div>
                <Tabs
                    id="post-tabs"
                    activeKey={tabKey}
                    onSelect={k => tabSelect(k)}>
                    <Tab eventKey="all" title="すべて">
                        <PostSender reload={reload}/>
                        <Posts posts={posts} />
                    </Tab>
                    <Tab eventKey="follow" title="フォロー中">
                        <PostSender reload={reload}/>
                        <Posts posts={followPosts} />
                    </Tab>
                </Tabs>
            </div> : <Posts posts={posts} />}
        </div>
    )
}