const URL_PREFIX = process.env.API_SERVER_URL;


export async function POST(req) {
    const body = await req.json();
    const formParams = new URLSearchParams();
    formParams.append("email", body.email);
    formParams.append("password", body.password);
    const res = await fetch(URL_PREFIX + "/login", {
        method: "POST",
        body:formParams.toString(),
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    if(res.ok) {
        return new Response(JSON.stringify("ok"), {status: 200})
    } else {
        const data = await res.text();
        return new Response(data, {status: res.status});
    }
}