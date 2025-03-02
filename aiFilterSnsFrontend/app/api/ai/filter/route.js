import { cookies } from "next/headers";

const url = process.env.API_SERVER_URL;
export async function POST(req) {
    const {message, number} = await req.json();
    const formParams = new URLSearchParams();
    const cookieStore = await cookies();
    formParams.append("filter", number);
    formParams.append("post", message);
    const res = await fetch(url + "/filter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", Cookie: cookieStore.toString()},
        body: formParams.toString()
    }
    );
    return new Response(await res.text(), {status: 200})
}

export async function GET(req) {
    const cookieStore = await cookies();
    const res = await fetch(url + "/filter/filters", {headers: { Cookie: cookieStore.toString()},});
    return new Response(await res.text(), {status: 200});
}