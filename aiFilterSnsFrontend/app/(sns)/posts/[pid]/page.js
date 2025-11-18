"use client"
import { useAuth, useFilters } from "@/contexts/AuthContext";
import getDate from "@/util/getDate";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUser, FaHeart, FaRegHeart, FaEllipsisH, FaFilter, FaUndo, FaTrash, FaArrowLeft } from "react-icons/fa";

export default function Post() {
    const params = useParams();
    const [post, setPost] = useState({});
    const [contents, setContents] = useState("");
    const [original, setOriginal] = useState("");
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [id] = useAuth();
    const [error, setError] = useState("");
    const [filterMenuOpen, setFilterMenuOpen] = useState(false);
    const filters = useFilters();
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
        getPost();
    }, [pid])

    const openMenu = (e) => {
        e.stopPropagation();
        setMenuOpen(!menuOpen)
    }

    const deletePost = async (e) => {
        e.stopPropagation();
        if (confirm("この投稿を削除しますか？")) {
            const res = await fetch("/api/posts/" + pid, {
                method: "Delete",
                credentials: "same-origin"
            })
            if (res.ok) {
                router.push("/home");
            }
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl text-gray-300 mb-4">📝</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">投稿が見つかりません</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button 
                    onClick={() => router.push("/home")}
                    className="btn-primary"
                >
                    ホームに戻る
                </button>
            </div>
        );
    }

    const [date, time] = getDate(post.createdDate);

    return (
        <div className="animate-fade-in" onClick={() => setMenuOpen(false)}>
            {/* Back button */}
            <div className="mb-6">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <FaArrowLeft />
                    <span>戻る</span>
                </button>
            </div>

            {/* Post content */}
            <div className="card">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                            <FaUser className="text-white" />
                        </div>
                        <div>
                            <Link 
                                href={"/accounts/" + post.authorId}
                                className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                            >
                                {post.authorName}
                            </Link>
                            <p className="text-gray-500">{date} {time}</p>
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
                                {post.authorId == id && (
                                    <button 
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                        onClick={deletePost}
                                    >
                                        <FaTrash className="text-xs" />
                                        <span>削除</span>
                                    </button>
                                )}
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
                <div className="mb-8">
                    <pre className="whitespace-pre-wrap text-gray-800 font-sans leading-relaxed text-lg">
                        {contents}
                    </pre>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-6 pt-6 border-t border-gray-100">
                    {id ? (
                        <button 
                            className={`flex items-center space-x-3 px-4 py-2 rounded-full transition-all duration-200 ${
                                liked 
                                    ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                                    : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                            }`}
                            onClick={liked ? unLike : like}
                        >
                            {liked ? <FaHeart className="text-xl animate-bounce-subtle" /> : <FaRegHeart className="text-xl" />}
                            <span className="font-medium">{likeCount} いいね</span>
                        </button>
                    ) : (
                        <Link href="/login">
                            <button className="flex items-center space-x-3 px-4 py-2 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200">
                                <FaRegHeart className="text-xl" />
                                <span className="font-medium">{likeCount} いいね</span>
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}