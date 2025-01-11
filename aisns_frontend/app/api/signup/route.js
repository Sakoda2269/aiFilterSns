const URL_PREFIX = process.env.API_SERVER_URL;


export async function POST(req) {
    const body = await req.json();
    const formParams = new URLSearchParams();
    formParams.append("email", body.email);
    formParams.append("name", body.name);
    formParams.append("password", body.password);
    const res = await fetch(URL_PREFIX + "/accounts/signup", {
        method: "POST",
        body:formParams.toString(),
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    if(res.ok) {
        const data = await res.text();
        return new Response(JSON.stringify(data), {status: 200})
    } else {
        const data = res.body;
        return new Response(data, {status: res.status});
    }
}