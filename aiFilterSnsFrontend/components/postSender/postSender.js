import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function PostSender({ reload }) {
    const [contents, setContents] = useState("");
    const [canSend, setCanSend] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleInput = (e) => {
        const value = e.target.value;
        setCanSend(value.length > 0 && value.length < 256);
        setContents(value);
        setError("");
    }

    const send = async () => {
        if (!canSend || isLoading) return;
        
        setIsLoading(true);
        const body = JSON.stringify({ contents: contents });
        
        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                body: body,
                credentials: "same-origin",
                headers: { "Content-Type": "application/json" }
            });
            
            if (res.ok) {
                setContents("");
                setError("");
                setCanSend(false);
                reload();
            } else {
                const data = await res.text();
                setError(data);
            }
        } catch (err) {
            setError("投稿に失敗しました");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="card mb-6 animate-fade-in">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">新しい投稿</h3>
            </div>
            
            <div className="space-y-4">
                <textarea 
                    className="input-field resize-none h-24"
                    placeholder="今何を考えていますか？"
                    value={contents} 
                    onChange={handleInput}
                    maxLength={255}
                />
                
                {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                        {error}
                    </div>
                )}
                
                <div className="lr">
                    <span className={`text-sm ${
                        contents.length > 200 
                            ? 'text-red-500' 
                            : contents.length > 150 
                                ? 'text-yellow-500' 
                                : 'text-gray-500'
                    }`}>
                        {contents.length}/255
                    </span>
                    
                    <button 
                        className={`btn-primary flex items-center space-x-2 ${
                            !canSend || isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={send}
                        disabled={!canSend || isLoading}
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <FaPaperPlane className="text-sm" />
                        )}
                        <span>{isLoading ? '投稿中...' : '投稿'}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}