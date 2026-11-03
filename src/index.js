import { ethers } from "ethers";
const HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AKB EARN</title><style>body{background:#0a0a0a;color:#fff;font-family:system-ui;text-align:center;padding:40px 20px}.card{background:#1a1a1a;border:1px solid #333;border-radius:16px;padding:24px;max-width:480px;margin:20px auto}input,select{width:100%;padding:14px;border-radius:10px;border:1px solid #333;background:#111;color:#fff;margin:10px 0}button{width:100%;padding:16px;background:#FFD60A;color:#000;font-weight:900;border:0;border-radius:12px;cursor:pointer;font-size:16px}button:disabled{opacity:0.5}.result{margin-top:16px;padding:16px;background:#111;border-radius:10px;word-break:break-all;text-align:left}.yellow{color:#FFD60A}</style></head><body><h1 class="yellow">AKB EARN</h1><p>Vérification ON-CHAIN Multi-Chain</p><div class="card"><select id="chain"><option value="eth">ETH - Ethereum</option><option value="bsc">BNB - BSC</option></select><input id="addr" placeholder="0x..." value="0xa2c10240111267cdcd558f90840bc80ffead46e5"><button id="btn" onclick="check()">VÉRIFIER BALANCE ON-CHAIN</button><div id="res" class="result" style="display:none"></div></div><script>async function check(){const addr=document.getElementById('addr').value.trim();const chain=document.getElementById('chain').value;const res=document.getElementById('res');const btn=document.getElementById('btn');if(!addr.startsWith('0x')||addr.length!=42){res.style.display='block';res.innerHTML='❌ Adresse invalide';return}btn.disabled=true;btn.textContent='Vérification...';res.style.display='block';res.innerHTML='⏳ '+chain+'...';try{const r=await fetch('/api/balance?address='+addr+'&chain='+chain);const d=await r.json();if(d.error){res.innerHTML='❌ '+d.error}else{res.innerHTML='<b>Adresse:</b> '+d.address+'<br><br><b>Réseau:</b> '+d.chain+'<br><br><b>Balance:</b> <span class=yellow>'+d.balanceEth+' '+d.symbol+'</span><br><br><b>On-chain:</b> '+d.balanceWei+' wei<br><br>✅ Source: '+d.source}}catch(e){res.innerHTML='❌ '+e.message}btn.disabled=false;btn.textContent='VÉRIFIER BALANCE ON-CHAIN';}</script></body></html>`;
export default {
 async fetch(request, env, ctx) {
  const url = new URL(request.url);
  if (url.pathname === "/api/balance") {
    const address = url.searchParams.get("address");
    const chain = url.searchParams.get("chain") || "eth";
    if (!address || !ethers.isAddress(address)) return Response.json({ error: "Adresse invalide" }, { status: 400 });
    try {
      let rpcUrl, symbol, chainName;
      if (chain === "bsc") { rpcUrl = "https://bsc.publicnode.com"; symbol = "BNB"; chainName = "BSC"; }
      else { rpcUrl = "https://ethereum.publicnode.com"; symbol = "ETH"; chainName = "Ethereum"; }
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);
      return Response.json({ address, balanceWei: balanceWei.toString(), balanceEth, symbol, chain: chainName, source: "ethers.js + "+rpcUrl }, { headers: { "Access-Control-Allow-Origin": "*" } });
    } catch (e) { return Response.json({ error: "Erreur RPC", details: e.message }, { status: 500 }); }
  }
  return new Response(HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } });
 }
}
