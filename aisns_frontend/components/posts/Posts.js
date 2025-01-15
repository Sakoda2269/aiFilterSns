import getDate from "@/util/getDate";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Posts({posts}) {
    return (
        <div>
            {posts.map((value, index) => (<ListPost post={value} key={"post" + index}/>))}
        </div>
    )
}  

function ListPost({post}){ 
    const aid = post.authorId;
    const aname = post.authorName;
    const contents = post.contents;
    const pid = post.postId;
    const created = post.createdDate;
    const [date, time] = getDate(created);

    const [mouseOver, setMouseOver] = useState(false);
    const router = useRouter();

    const jumpPostPage = (e) => {
        e.stopPropagation();
        router.push("/posts/" + pid);
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
            <div style={{paddingLeft: "30px"}}>{contents}</div>
            <br />
        </div>
    )
}