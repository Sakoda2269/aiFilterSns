import { useState } from "react";


export default function PostSender({reload}) {

    const [contents, setContents] = useState("");
    const [error, setError] = useState("");

    const handleInput = (e) => {
        const value = e.target.value;
        setContents(value);
    }

    const send = async () => {
        const body = JSON.stringify({contents: contents});
        const res = await fetch("/api/posts", {
            method: "POST",
            body: body,
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });
        if(res.ok) {
            setContents("");
            setError("");
            reload();
        } else {
            const data = await res.text();
            setError(data);
        }
    }

    return (
        <div style={{padding: "10px"}}>
            <h6>投稿する</h6>
            <textarea className="form-control" value={contents} onChange={handleInput}></textarea>
            <div style={{textAlign: "right"}}><button className="btn btn-primary mt-3" onClick={send}>投稿</button></div>
        </div>
    )
}