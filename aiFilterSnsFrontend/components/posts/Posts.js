import { useAuth, useFilters } from "@/contexts/AuthContext";
import getDate from "@/util/getDate";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaEllipsisH, FaFilter, FaUndo, FaUser } from "react-icons/fa";

export default function Posts({posts, reload, addPage, isLast}) {
    return (
        <div className="space-y-4">
            {posts.map((value, index) => (
                <div key={"post" + index} className="animate-slide-up">
                    <ListPost post={value} reload={reload}/>
                </div>
            ))}
            
            {!isLast && (
                <div className="flex justify-center py-8">
                    <button 
                        className="btn-secondary px-8 py-3 text-sm font-medium"
                        onClick={addPage}
                    >
                        さらに読み込む
                    </button>
                </div>
            )}
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
    const [menuOpen, setMenuOpen] = useState(false);
    const [filterMenuOpen, setFilterMenuOpen] = useState(false);
    const [id] = useAuth();
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

    return(
        <div 
            className="card hover:shadow-md transition-all duration-200 cursor-pointer group"
            onClick={jumpPostPage}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                        <FaUser className="text-white text-sm" />
                    </div>
                    <div>
                        <Link 
                            href={"/accounts/" + aid} 
                            onClick={(e) => e.stopPropagation()}
                            className="font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                        >
                            {aname}
                        </Link>
                        <p className="text-sm text-gray-500">{date} {time}</p>
                    </div>
                </div>
                
                <div className="relative">
                    <button 
                        className="btn-ghost p-2 transition-colors"
                        onClick={openMenu}
                    >
                        <FaEllipsisH className="text-gray-400 hover:text-gray-600" />
                    </button>
                    
                    {menuOpen && (
                        <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                            <button 
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                onClick={openFilterMenu}
                            >
                                <FaFilter className="text-xs" />
                                <span>フィルター</span>
                            </button>
                            
                            {filterMenuOpen && (
                                <div className="absolute right-full top-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[150px]">
                                    {filters.map((filter, index) => (
                                        <button 
                                            key={"filter"+filter}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                            onClick={e => doFilter(e, index)}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                    <button 
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 border-t border-gray-100"
                                        onClick={e => doFilter(e, -1)}
                                    >
                                        <FaUndo className="text-xs" />
                                        <span>元に戻す</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Content */}
            <div className="mb-4">
                <pre className="whitespace-pre-wrap text-gray-800 font-sans leading-relaxed">
                    {contents}
                </pre>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-4 pt-3 border-t border-gray-100">
                {id ? (
                    <button 
                        className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-all duration-200 ${
                            liked 
                                ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                                : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                        }`}
                        onClick={liked ? unLike : like}
                    >
                        {liked ? <FaHeart className="animate-bounce-subtle" /> : <FaRegHeart />}
                        <span className="text-sm font-medium">{likeCount}</span>
                    </button>
                ) : (
                    <Link href="/login" onClick={(e) => e.stopPropagation()}>
                        <button className="flex items-center space-x-2 px-3 py-1 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200">
                            <FaRegHeart />
                            <span className="text-sm font-medium">{likeCount}</span>
                        </button>
                    </Link>
                )}
            </div>
        </div>
    )
}