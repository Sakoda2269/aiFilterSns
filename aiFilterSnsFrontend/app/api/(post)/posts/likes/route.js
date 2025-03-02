import { cookies } from "next/headers";

const URL_PREFIX = process.env.API_SERVER_URL;

export async function GET(req) {
    const cookieStore = await cookies();
    const res = await fetch(URL_PREFIX + "/posts/likes", {method: "GET", headers:{Cookie: cookieStore.toString()}})
    if(res.ok) {
        const data = await res.json();
        const posts = data.content;
        console.log(posts);
        if(posts) {
            return new Response(JSON.stringify(posts), {status: 200})
        }
        else {
            return new Response("empty", {status: 404});
        }
    } else {
        return new Response("error", {status: res.status})
    }
}