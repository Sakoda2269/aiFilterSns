"use client"
import getDate from "@/util/getDate";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCircleUser, FaHeart, FaRegHeart } from "react-icons/fa6";

export default function Post() {
    const params = useParams();
    const [post, setPost] = useState({});
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [id, setId] = useState("");
    const [error, setError] = useState("");
    const pid = params.pid;
    const router = useRouter();

    useEffect(() => {
        const getPost = async () => {
            const res = await fetch("/api/posts/" + pid, {
                method: "GET",
                credentials: "same-origin"
            });
            if (res.ok) {
                const data = await res.json();
                setPost(data);
                setLiked(data.liked);
                setError("");
            } else {
                if (res.status == 404) {
                    setError("このポストは存在しません")
                }
            }
            setLoading(false);
        }
        setId(sessionStorage.getItem("id"));
        getPost();
    }, [pid])

    const openMenu = (e) => {
        e.stopPropagation();
        setMenuOpen(!menuOpen)
    }

    const deletePost = async (e) => {
        e.stopPropagation();
        const res = await fetch("/api/posts/" + pid, {
            method: "Delete",
            credentials: "same-origin"
        })
        if (res.ok) {
            router.push("/home");
        }
    }

    const like = async (e) => {
        e.stopPropagation();
        const res = await fetch("/api/posts/" + pid + "/like", {
            method: "PUT",
            credentials: "same-origin",
            body: JSON.stringify({like: "true"}),
            headers: { "Content-Type": "application/json" }
        });
        if(res.ok) {
            setLiked(true);
        }
    }

    const unLike = async (e) => {
        e.stopPropagation();
        const res = await fetch("/api/posts/" + pid + "/like", {
            method: "PUT",
            credentials: "same-origin",
            body: JSON.stringify({like: "false"}),
            headers: { "Content-Type": "application/json" }
        });
        if(res.ok) {
            setLiked(false);
        }
    }

    return (
        <div className="container mt-3" onClick={() => setMenuOpen(false)} style={{ height: "100%" }}>
            {loading ? (
                <div>
                    loading...
                </div>
            ) : (
                <>{error == "" ?
                    (<div>
                        <div className="lr mt-3" style={{ borderBottom: "1px solid black" }}>
                            <span><h3><FaCircleUser size={30} />&nbsp;<Link href={"/accounts/" + post.authorId}>{post.authorName}</Link></h3></span>
                            <span>
                                <span>{getDate(post.createdDate)[0]}&nbsp;{getDate(post.createdDate)[1]}</span>
                                <span style={{ marginLeft: "30px", position: "relative" }}>
                                    <button className="btn rounded-circle border-secondary" onClick={openMenu}>︙</button>
                                    {menuOpen && <div className="border rounded border-secondary"
                                        style={{ position: "absolute", left: "-80px", top: "20px", background: "white" }}>
                                        {post.authorId == id && <div><button className="btn btn-light" style={{ padding: "5px 10px", width: "80px" }} onClick={deletePost}>削除</button></div>}
                                        <div><button className="btn btn-light" style={{ padding: "5px 10px", width: "80px" }}>通報</button></div>
                                    </div>}
                                </span>
                            </span>
                        </div>

                        <div className="mt-3 container">
                            {post.contents}
                        </div>
                        <div style={{ textAlign: "left"}}>
                            {liked ?
                                <button className="btn"><FaHeart color="red" onClick={unLike} /></button> :
                                <button className="btn"><FaRegHeart onClick={like} /></button>
                            }
                        </div>
                    </div>) :
                    (
                        <div>
                            <h3>{error}</h3>
                        </div>
                    )
                }</>
            )}
        </div>
    )
}