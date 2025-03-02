import { cookies } from "next/headers";

const URL_PREFIX = process.env.API_SERVER_URL;

export async function POST(req) {
    const cookieStore = await cookies();
    const res = await fetch(URL_PREFIX + "/auth", {
        method: "GET",
        headers: {
            Cookie: cookieStore.toString()
        }
    });
    if(res.ok) {
        return new Response(await res.text(), {status: 200});
    }
    return new Response("", {status: res.status});
}