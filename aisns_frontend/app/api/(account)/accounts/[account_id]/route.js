import { cookies } from "next/headers";

const URL_PREFIX = process.env.API_SERVER_URL;

export async function GET(req, { params }) {

    const { account_id } = await params;
    const cookieStore = await cookies();
    const res = await fetch(URL_PREFIX + "/accounts/" + account_id, {
        method: "GET",
        headers: {
            Cookie: cookieStore.toString()
        }
    });
    if (res.ok) {
        const data = await res.text();
        console.log(data);
        return new Response(data, { status: 200 });
    } else {
        return new Response("errro", { status: res.status });
    }
}