import { cookies } from "next/headers";

const URL_PREFIX = process.env.API_SERVER_URL;

export async function PUT(req, { params }) {
    const { pid } = await params;
    const body = await req.json();
    const cookieStore = await cookies();
    const formParams = new URLSearchParams();
    formParams.append("like", body.like);
    const res = await fetch(URL_PREFIX + "/posts/" + pid + "/like", {
        method: "PUT",
        body: formParams.toString(),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Cookie: cookieStore.toString()
        }
    });
    if(res.ok) {
        const data = await res.text();
        return new Response(data, {status: 200})
    } else {
        return new Response("error", {status:res.status})
    }
}