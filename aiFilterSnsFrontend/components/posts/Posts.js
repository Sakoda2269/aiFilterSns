import { useAuth, useFilters } from "@/contexts/AuthContext";
import getDate from "@/util/getDate";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";

export default function Posts({posts, reload, addPage, isLast}) {
    return (
        <div style={{overflow: "visible", height: "100%", width: "100%"}}>
            {posts.map((value, index) => (
                <div key={"post" + index} style={{}}>
                    <ListPost post={value} reload={reload}/>
                </div>
            ))}
            <div>
                {!isLast && (
                    <div style={{padding: "30px"}}>
                        <button className="btn btn-light border border-secondary" style={{width: "100%"}} onClick={addPage}>追加で読み込む</button>
                    </div>
                )}
            </div>
        </div>
    )
}  

function ListPost({post, reload}){ 
    const [aid, setAid] = useState(post.authorId);
    const [aname, setAname] = useState(post.authorName);
    const [contents, setContents] = useState(post.contents);
    const [original, setOriginal] = useState(post.contents);
    const [pid, setPid] = useState(post.postId);
    const [created, setCreated] = useState(post.createdDate);
    const [liked, setLiked] = useState(post.liked);
    const [date, time] = getDate(created);
    const [likeCount, setLikeCount] = useState(post.likeCount);
    const [mouseOver, setMouseOver] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [filterMenuOpen, setFilterMenuOpen] = useState(false);
    const [id, setId] = useAuth();
    const filters = useFilters();
    const router = useRouter();

    useEffect(() => {
        setAid(post.authorId);
        setAname(post.authorName);
        setContents(post.contents);
        setOriginal(post.contents);
        setPid(post.postId);
        setCreated(post.createdDate);
        setLiked(post.liked);
        setLikeCount(post.likeCount);

    }, [post])

    const jumpPostPage = (e) => {
        e.stopPropagation();
        router.push("/posts/" + pid);
    }

    const like = async (e) => {
        e.stopPropagation();
        const res = await fetch("/api/posts/" + pid + "/like", {
            method: "PUT",
            credentials: "include",
            body: JSON.stringify({like: "true"}),
            headers: { "Content-Type": "application/json" }
        });
        if(res.ok) {
            const num = await res.text();
            setLiked(true);
            setLikeCount(num)
            if(reload) {
                reload();
            }
        }
    }

    const unLike = async (e) => {
        e.stopPropagation();
        const res = await fetch("/api/posts/" + pid + "/like", {
            method: "PUT",
            credentials: "include",
            body: JSON.stringify({like: "false"}),
            headers: { "Content-Type": "application/json" }
        });
        if(res.ok) {
            const num = await res.text();
            setLiked(false);
            setLikeCount(num)
            if(reload) {
                reload();
            }
        }
    }

    const openMenu = (e) => {
        e.stopPropagation();
        setMenuOpen(!menuOpen)
        setFilterMenuOpen(false);
    }

    const openFilterMenu = (e) => {
        e.stopPropagation();
        setFilterMenuOpen(true);
    }

    const doFilter = async (e, number) => {
        e.stopPropagation();
        if(number == -1) {
            setContents(original);
        } else {
            const res = await fetch("/api/ai/filter", {
                method: "POST",
                credentials: "include",
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

    

    return(
        <div className="mt-3" style={{width: "100%", borderBottom: "1px solid black", background: mouseOver ? "#dddddd" : "white", paddingLeft: "20px"}}
            onClick={jumpPostPage}>
            <div className="row">
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <div><Link href={"/accounts/" + aid} onClick={(e) => {e.stopPropagation()}}><h4>{aname}</h4></Link></div>
                    <div style={{paddingTop: "5px"}}>
                        {date}&nbsp;{time}
                    </div>
                    <div style={{position: "relative" }}>
                        <button className="btn rounded-circle border-secondary" onClick={openMenu}>︙</button>
                        {menuOpen && <div className="border rounded border-secondary"
                            style={{ position: "absolute", left: "-80px", top: "20px", background: "white" }}>
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
                        </div>}
                    </div>
                </div>
            </div>
            <div className="row" style={{width: "100%", textAlign: "left", paddingBottom: "15px"}}>
                <pre>{contents}</pre>
            </div>
            {id != "" ?
                <div className="row" style={{textAlign: "left"}}>
                    {liked ? 
                        <span><button className="btn" onClick={unLike} ><FaHeart color="red" size={20}/></button>: {likeCount}</span>:
                        <span><button className="btn" onClick={like} ><FaRegHeart size={20}/></button>: {likeCount}</span>
                    }
                </div> 
            : 
                <div className="row" style={{textAlign: "left"}}>
                    <span><Link href="/login"><button className="btn" onClick={(e)=>e.stopPropagation()}><FaRegHeart size={20}/></button></Link>: {likeCount}</span>
                </div>
            } 
        </div>
    )
}