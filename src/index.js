import { ethers } from "ethers";
const HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AKB EARN</title><style>body{background:#0a0a0a;color:#fff;font-family:system-ui;text-align:center;padding:40px 20px}.card{background:#1a1a1a;border:1px solid #333;border-radius:16px;padding:24px;max-width:480px;margin:20px auto}input,select{width:100%;padding:14px;border-radius:10px;border:1px solid #333;background:#111;color:#fff;margin:10px 0}button{width:100%;padding:16px;background:#FFD60A;color:#000;font-weight:900;border:0;border-radius:12px;cursor:pointer;font-size:16px}button:disabled{opacity:0.5}.result{margin-top:16px;padding:16px;background:#111;border-radius:10px;word-break:break-all;text-align:left}.yellow{color:#FFD60A}</style></head><body><h1 class="yellow">AKB EARN</h1><p>Balance ON-CHAIN Multi-Chain</p><div class="card"><select id="chain"><option value="eth">ETH - Ethereum</option><option value="bsc">BNB - BSC</option></select><input id="addr" placeholder="0x..." value="0xa2c10240111267cdcd558f90840bc80ffead46e5"><button id="btn" onclick="check()">VÉRIFIER</button><div id="res" class="result" style="display:none"></div></div><script>async function check(){const addr=document.getElementById('addr').value.trim();const chain=document.getElementById('chain').value;const res=document.getElementById('res');const btn=document.getElementById('btn');if(!addr.startsWith('0x')||addr.length!=42){res.style.display='block';res.innerHTML='❌ Adresse invalide';return}btn.disabled=true;btn.textContent='...';res.style.display='block';res.innerHTML='⏳ '+chain+'...';try{const r=await fetch('/api/balance?address='+addr+'&chain='+chain);const d=await r.json();if(d.error){res.innerHTML='❌ '+d.error+'<br>'+(d.details||'')}else{res.innerHTML='<b>'+d.chain+'</b><br><br><b>Balance:</b> <span class=yellow>'+d.balanceEth+' '+d.symbol+'</span><br><br>✅ '+d.source}}catch(e){res.innerHTML='❌ '+e.message}btn.disabled=false;btn.textContent='VÉRIFIER';}</script></body></html>`;
export default {
 async fetch(request, env, ctx) {
  const url = new URL(request.url);
  if (url.pathname === "/api/balance") {
    const address = url.searchParams.get("address");
    const chain = url.searchParams.get("chain") || "eth";
    if (!address || !ethers.isAddress(address)) return Response.json({ error: "Adresse invalide" }, { status: 400 });
    const RPCS = {
      eth: ["https://eth.llamarpc.com", "https://1rpc.io/eth"],
      bsc: ["https://binance.llamarpc.com", "https://1rpc.io/bnb"]
    };
    let lastErr;
    for (const rpcUrl of (RPCS[chain] || RPCS.eth)) {
      try {
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const bal = await provider.getBalance(address);
        return Response.json({ 
          address, balanceWei: bal.toString(), balanceEth: ethers.formatEther(bal),
          symbol: chain==="bsc"?"BNB":"ETH", chain: chain==="bsc"?"BSC":"Ethereum",
          source: rpcUrl
        }, { headers: { "Access-Control-Allow-Origin": "*" } });
      } catch (e) { lastErr = e; }
    }
    return Response.json({ error: "Tous les RPC ont échoué", details: lastErr?.message }, { status: 500 });
  }
  return new Response(HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } });
 }
}
