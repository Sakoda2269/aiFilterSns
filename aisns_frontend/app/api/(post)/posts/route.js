import { cookies } from "next/headers";

const URL_PREFIX = process.env.API_SERVER_URL;

export async function GET(req) {
    const res = await fetch(URL_PREFIX + "/posts", {method: "GET"})
    if(res.ok) {
        const data = await res.json();
        const posts = data.content;
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

export async function POST(req) {
    const body = await req.json();
    const formParams = new URLSearchParams();
    formParams.append("contents", body.contents);
    const cookieStore = await cookies();
    const res = await fetch(URL_PREFIX + "/posts", {
        method: "POST",
        body: formParams.toString(),
        headers: { "Content-Type": "application/x-www-form-urlencoded", Cookie: cookieStore.toString()}
    });
    if(res.ok) {
        const pid = await res.text();
        return new Response(pid, {status: 200});
    } else {
        return new Response("errro", {status: res.status});
    }
}