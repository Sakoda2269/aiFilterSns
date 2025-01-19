import { cookies } from "next/headers";

const URL_PREFIX = process.env.API_SERVER_URL;

export async function GET(req, { params }) {

    const { account_id } = await params;
    const cookieStore = await cookies();
    const queryParams = req.nextUrl.searchParams;
    const pageNum = queryParams.get("page");
    const res = await fetch(URL_PREFIX + "/accounts/" + account_id + "/posts?page=" + pageNum, {
        method: "GET",
        headers: {Cookie: cookieStore.toString()}
    });
    if (res.ok) {
        const data = await res.json();
        const posts = data.content;
        const isLast = data.last
        return new Response(JSON.stringify({posts:posts, last: isLast}), {status: 200})
    } else {
        return new Response("errro", { status: res.status });
    }
}