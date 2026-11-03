const HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AKB EARN</title><style>body{background:#0a0a0a;color:#fff;font-family:system-ui;text-align:center;padding:40px 20px}.card{background:#1a1a1a;border:1px solid #333;border-radius:16px;padding:24px;max-width:480px;margin:20px auto}input,select{width:100%;padding:14px;border-radius:10px;border:1px solid #333;background:#111;color:#fff;margin:10px 0}button{width:100%;padding:16px;background:#FFD60A;color:#000;font-weight:900;border:0;border-radius:12px;cursor:pointer;font-size:16px}.result{margin-top:16px;padding:16px;background:#111;border-radius:10px;word-break:break-all;text-align:left}.yellow{color:#FFD60A}</style></head><body><h1 class="yellow">AKB EARN</h1><p>Balance ON-CHAIN - Fix Final</p><div class="card"><select id="chain"><option value="eth">ETH - Ethereum</option><option value="bsc" selected>BNB - BSC</option></select><input id="addr" placeholder="0x..." value="0xa2c10240111267cdcd558f90840bc80ffead46e5"><button id="btn" onclick="check()">VÉRIFIER BALANCE</button><div id="res" class="result" style="display:none"></div></div><script>async function check(){const a=document.getElementById('addr').value.trim();const c=document.getElementById('chain').value;const r=document.getElementById('res');const b=document.getElementById('btn');if(!a.startsWith('0x')||a.length!=42){r.style.display='block';r.innerHTML='❌ Adresse invalide';return}b.disabled=true;b.textContent='...';r.style.display='block';r.innerHTML='⏳ '+c+'...';try{const x=await fetch('/api/balance?address='+a+'&chain='+c);const d=await x.json();if(d.error)r.innerHTML='❌ '+d.error+'<br>'+(d.details||'');else r.innerHTML='<b>'+d.chain+'</b><br><br>Balance: <span class=yellow>'+d.balanceEth+' '+d.symbol+'</span><br><br>✅ '+d.source}catch(e){r.innerHTML='❌ '+e.message}b.disabled=false;b.textContent='VÉRIFIER BALANCE';}</script></body></html>`;
function isAddr(a){return /^0x[a-fA-F0-9]{40}$/.test(a)}
async function getBalanceRPC(rpcUrl, address){
  const body = JSON.stringify({jsonrpc:"2.0",id:1,method:"eth_getBalance",params:[address,"latest"]});
  const resp = await fetch(rpcUrl,{method:"POST",headers:{"Content-Type":"application/json"},body});
  const json = await resp.json();
  if(json.error) throw new Error(json.error.message);
  return json.result;
}
export default {
 async fetch(request){
  const url = new URL(request.url);
  if(url.pathname === "/api/balance"){
    const address = url.searchParams.get("address");
    const chain = url.searchParams.get("chain") || "bsc";
    if(!isAddr(address)) return Response.json({error:"Adresse invalide"}, {status:400});
    const RPCS = {
      eth: "https://eth.llamarpc.com",
      bsc: "https://1rpc.io/bnb"
    };
    try{
      const rpcUrl = RPCS[chain] || RPCS.bsc;
      const hexBal = await getBalanceRPC(rpcUrl, address);
      const wei = BigInt(hexBal);
      const eth = Number(wei) / 1e18;
      return Response.json({
        address, balanceWei: wei.toString(),
        balanceEth: eth.toString(),
        symbol: chain==="bsc"?"BNB":"ETH",
        chain: chain==="bsc"?"BSC":"Ethereum",
        source: rpcUrl + " direct fetch"
      }, {headers:{"Access-Control-Allow-Origin":"*"}});
    }catch(e){ return Response.json({error:"RPC échoué", details:e.message}, {status:500}); }
  }
  return new Response(HTML,{headers:{"Content-Type":"text/html; charset=utf-8"}});
 }
}
