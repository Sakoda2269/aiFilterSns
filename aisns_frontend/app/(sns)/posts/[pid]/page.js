"use client"
import getDate from "@/util/getDate";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCircleUser, FaHeart, FaRegHeart } from "react-icons/fa6";

export default function Post() {
    const params = useParams();
    const [post, setPost] = useState({});
    const [contents, setContents] = useState("");
    const [original, setOriginal] = useState("");
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [id, setId] = useState("");
    const [error, setError] = useState("");
    const [filterMenuOpen, setFilterMenuOpen] = useState(false);
    const [filters, setFilters] = useState([]);
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
                setContents(data.contents);
                setOriginal(data.contents);
                setLiked(data.liked);
                setLikeCount(data.likeCount);
                setError("");
            } else {
                if (res.status == 404) {
                    setError("このポストは存在しません")
                }
            }
            setLoading(false);
        }
        const getFilters = async () => {
            const res = await fetch("/api/ai/filter", {
                method: "GET",
                credentials: "include"
            });
            if(res.ok) {
                const data = await res.json();
                setFilters(data);
            } else {
                setFilters(["エラー"]);
            }
        }
        setId(sessionStorage.getItem("id"));
        getPost();
        getFilters();
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
        if(id == "" || id == null) {
            router.push("/login")
            return;
        }
        const res = await fetch("/api/posts/" + pid + "/like", {
            method: "PUT",
            credentials: "same-origin",
            body: JSON.stringify({like: "true"}),
            headers: { "Content-Type": "application/json" }
        });
        if(res.ok) {
            const num = await res.text();
            setLiked(true);
            setLikeCount(num);
        }
    }

    const unLike = async (e) => {
        e.stopPropagation();
        if(id == ""  || id == null) {
            router.push("/login")
            return;
        }
        const res = await fetch("/api/posts/" + pid + "/like", {
            method: "PUT",
            credentials: "same-origin",
            body: JSON.stringify({like: "false"}),
            headers: { "Content-Type": "application/json" }
        });
        if(res.ok) {
            const num = await res.text();
            setLiked(false);
            setLikeCount(num);
        }
    }

    const openFilterMenu = (e)=> {
        e.stopPropagation();
        setFilterMenuOpen(!filterMenuOpen);
    }

    const doFilter = async (e, number) => {
        e.stopPropagation();
        if(number == -1) {
            setContents(original);
        } else {
            const res = await fetch("/api/ai/filter", {
                method: "POST",
                credentials: "same-origin",
                body: JSON.stringify({number: number, message: original}),
                headers: { "Content-Type": "application/json" }
            });
            if(res.ok) {
                const filterd = await res.text();
                setContents(filterd);
            }
        }
        setMenuOpen(false);
        setFilterMenuOpen(false);
    }

    return (
        <div className="container mt-3" onClick={() => setMenuOpen(false)} style={{ height: "100vh" }}>
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
                                    {menuOpen && 
                                        <div className="border rounded border-secondary"
                                            style={{ position: "absolute", left: "-80px", top: "20px", background: "white" }}>
                                            {post.authorId == id && <div><button className="btn btn-light" style={{ padding: "5px 10px", width: "80px" }} onClick={deletePost}>削除</button></div>}
                                            <div>
                                                <button className="btn btn-light" style={{ padding: "5px 10px", width: "80px" }} onClick={openFilterMenu}>フィルター</button>
                                                {filterMenuOpen && <div className="border rounded border-secondary"
                                                    style={{ position: "absolute", left: "-80px", top: "20px", background: "white", zIndex: 100 }}>
                                                    {filters.map((filter, index) => (
                                                        <div key={"filter"+filter}>
                                                            <button className="btn btn-light" style={{ padding: "5px 10px", width: "150px" }} onClick={e => doFilter(e, index)}>{filter}</button>
                                                        </div>
                                                    ))}
                                                    <div>
                                                        <button className="btn btn-light" style={{ padding: "5px 10px", width: "150px" }} onClick={e => doFilter(e, -1)}>元に戻す</button>
                                                    </div>
                                                </div>}
                                            </div>
                                        </div>
                                    }
                                </span>
                            </span>
                        </div>

                        <div className="mt-3 container">
                            {contents}
                        </div>
                        <div style={{ textAlign: "left"}}>
                            {liked ?
                                <span><button className="btn"><FaHeart color="red" onClick={unLike} /></button>: {likeCount}</span> :
                                <span><button className="btn"><FaRegHeart onClick={like} /></button>: {likeCount}</span>
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