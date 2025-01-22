import { cookies } from "next/headers";

const URL_PREFIX = process.env.API_SERVER_URL;

export async function POST(req) {
    const body = await req.json();
    const formParams = new URLSearchParams();
    formParams.append("password", body.password);
    const cookieStore = await cookies();
    const res = await fetch(URL_PREFIX + "/accounts/delete", {
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