import { ethers } from "ethers";

const HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>AKB EARN</title>
<style>
body{background:#0a0a0a;color:#fff;font-family:system-ui;text-align:center;padding:40px 20px}
.card{background:#1a1a1a;border:1px solid #333;border-radius:16px;padding:24px;max-width:480px;margin:20px auto}
input{width:100%;padding:14px;border-radius:10px;border:1px solid #333;background:#111;color:#fff;margin:10px 0}
button{width:100%;padding:16px;background:#FFD60A;color:#000;font-weight:900;border:0;border-radius:12px;cursor:pointer;font-size:16px}
button:disabled{opacity:0.5}
.result{margin-top:16px;padding:16px;background:#111;border-radius:10px;word-break:break-all;text-align:left}
.yellow{color:#FFD60A}
</style></head>
<body>
<h1 class="yellow">AKB EARN</h1>
<p>Vérification balance ON-CHAIN (ethers RPC direct)</p>
<div class="card">
<input id="addr" placeholder="0x... adresse Ethereum" value="0x51519c43364780C8Eb484ba170c8413c934F9721">
<button id="btn" onclick="check()">VÉRIFIER BALANCE ON-CHAIN</button>
<div id="res" class="result" style="display:none"></div>
</div>
<script>
async function check(){
 const addr=document.getElementById('addr').value.trim();
 const res=document.getElementById('res');
 const btn=document.getElementById('btn');
 if(!addr.startsWith('0x')||addr.length!=42){res.style.display='block';res.innerHTML='❌ Adresse invalide';return}
 btn.disabled=true; btn.textContent='Vérification...'; res.style.display='block'; res.innerHTML='⏳ Interrogation blockchain...';
 try{
  const r=await fetch('/api/balance?address='+addr);
  const d=await r.json();
  if(d.error){res.innerHTML='❌ '+d.error+'<br><small>'+(d.details||'')+'</small>'}else{res.innerHTML='<b>Adresse:</b> '+d.address+'<br><br><b>Balance:</b> <span class=yellow>'+d.balanceEth+' ETH</span><br><br><b>On-chain:</b> '+d.balanceWei+' wei<br><br>✅ Source: '+d.source}
 }catch(e){res.innerHTML='❌ Erreur: '+e.message}
 btn.disabled=false; btn.textContent='VÉRIFIER BALANCE ON-CHAIN';
}
</script>
</body></html>`;

export default {
 async fetch(request, env, ctx) {
  const url = new URL(request.url);
  if (url.pathname === "/api/balance") {
    const address = url.searchParams.get("address");
    if (!address || !ethers.isAddress(address)) {
      return Response.json({ error: "Adresse invalide" }, { status: 400 });
    }
    try {
      // RPC PUBLIC FIABLE - PAS ETHERSCAN
      const provider = new ethers.JsonRpcProvider("https://ethereum.publicnode.com");
      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);
      return Response.json({ address, balanceWei: balanceWei.toString(), balanceEth, source: "ethers.js + publicnode RPC" }, {
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    } catch (e) {
      return Response.json({ error: "Erreur RPC", details: e.message }, { status: 500 });
    }
  }
  return new Response(HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } });
 }
}
