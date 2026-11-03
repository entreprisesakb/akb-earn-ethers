export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    
    // API health check
    if (url.pathname === "/api/health") {
      return new Response(JSON.stringify({ status: "AKB Earn OK", time: new Date().toISOString() }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // Default - serve AKB Earn
    return new Response(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>AKB Earn</title></head><body style="font-family:sans-serif;text-align:center;padding:50px"><h1>🔥 AKB Earn is LIVE BOSS !</h1><p>aka-earn.akasavantinfini.fun</p><p id="status">Loading...</p><script>fetch('/api/health').then(r=>r.json()).then(d=>document.getElementById('status').innerText=JSON.stringify(d))</script></body></html>`, {
      headers: { "Content-Type": "text/html", "Cache-Control": "no-cache" }
    });
  }
}
