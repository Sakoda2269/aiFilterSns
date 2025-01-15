import { cookies } from "next/headers";

const URL_PREFIX = process.env.API_SERVER_URL;

export async function GET(req, { params }) {

    const { pid } = await params;
    const res = await fetch(URL_PREFIX + "/posts/" + pid, {
        method: "GET",
    });
    if (res.ok) {
        const data = await res.json();
        console.log(data);
        return new Response(JSON.stringify(data), { status: 200 });
    } else {
        return new Response("errro", { status: res.status });
    }
}

export async function PUT(req, { params }) {
    const cookieStore = await cookies();
    const body = await req.json();
    const formParams = new URLSearchParams();
    formParams.append("contents", body.contents);
    const { pid } = await params;
    const res = await fetch(URL_PREFIX + "/posts/" + pid, {
        method: "PUT", 
        body:formParams.toString(),
        headers:{
            Cookie: cookieStore.toString(),
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
    if(res.ok) {
        const data = await res.text();
        return new Response(data, {status: 200})
    } else {
        return new Response("error", {status: res.status})
    }
}

export async function DELETE(req, { params }) {
    const cookieStore = await cookies();
    const { pid } = await params;
    const res = await fetch(URL_PREFIX + "/posts/" + pid, {
        method: "DELETE", 
        headers:{Cookie: cookieStore.toString()}
    })
    if(res.ok) {
        const data = await res.text();
        return new Response(data, {status: 200})
    } else {
        return new Response("error", {status: res.status})
    }
}