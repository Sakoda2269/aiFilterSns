import { cookies } from "next/headers";

const URL_PREFIX = process.env.API_SERVER_URL;

export async function GET(req, { params }) {

    const { account_id } = await params;
    const cookieStore = await cookies();
    const res = await fetch(URL_PREFIX + "/accounts/" + account_id + "/posts", {
        method: "GET",
        headers: {Cookie: cookieStore.toString()}
    });
    if (res.ok) {
        const data = await res.json();
        const posts = data.content;
        return new Response(JSON.stringify(posts), { status: 200 });
    } else {
        return new Response("errro", { status: res.status });
    }
}