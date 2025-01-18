import getDate from "@/util/getDate";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";

export default function Posts({posts, reload}) {
    return (
        <div>
            {posts.map((value, index) => (<ListPost post={value} key={"post" + index} reload={reload}/>))}
        </div>
    )
}  

function ListPost({post, reload}){ 
    const [aid, setAid] = useState(post.authorId);
    const [aname, setAname] = useState(post.authorName);
    const [contents, setContents] = useState(post.setContents);
    const [pid, setPid] = useState(post.postId);
    const [created, setCreated] = useState(post.createdDate);
    const [liked, setLiked] = useState(post.liked);
    const [date, time] = getDate(created);
    const [likeCount, setLikeCount] = useState(post.likeCount);
    const [mouseOver, setMouseOver] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setAid(post.authorId);
        setAname(post.authorName);
        setContents(post.contents);
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
            credentials: "same-origin",
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
            credentials: "same-origin",
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

    return(
        <div className="container mt-3" style={{borderBottom: "1px solid black", background: mouseOver ? "#dddddd" : "white"}}
            onMouseEnter={() => setMouseOver(true)}
            onMouseLeave={() => setMouseOver(false)}
            onClick={jumpPostPage}>
            <div className="lr">
                <span><Link href={"/accounts/" + aid} onClick={(e) => {e.stopPropagation()}}><h4>{aname}</h4></Link></span>
                <span style={{paddingTop: "5px"}}>{date}&nbsp;{time}</span>
            </div>
            <div style={{paddingLeft: "30px", textAlign: "left"}}>{contents}</div>
            <br />
            <div style={{textAlign: "left"}}>
                {liked ? 
                    <span><button className="btn" onClick={unLike} ><FaHeart color="red" size={20}/></button>: {likeCount}</span>:
                    <span><button className="btn" onClick={like} ><FaRegHeart size={20}/></button>: {likeCount}</span>
                }
            </div>
        </div>
    )
}