
const URL_PREFIX = process.env.API_SERVER_URL;

export async function POST(req) {
    const res = await fetch(URL_PREFIX + "/logout", {method: "POST"})
    if(res.ok) {
        return new Response("logout success", {status: 200, headers: {"Set-Cookie": res.headers.get('set-cookie')}})
    } else {
        return new Response("error", {status: res.status});
    }
}