export default {
  async fetch(request, env, ctx): Promise<Response> {
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>AKB Earn - Etherscan Live</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}body{font-family:Inter,system-ui;background:#0a0a0f;color:#fff;min-height:100vh}
.header{background:linear-gradient(135deg,#ff6a00,#ff2d55);padding:18px;text-align:center;font-weight:900;font-size:22px;letter-spacing:1px}
.container{max-width:900px;margin:0 auto;padding:20px}
.card{background:#15151f;border:1px solid #222;border-radius:16px;padding:20px;margin:15px 0}
.badge{display:inline-block;background:#00ff88;color:#000;padding:4px 12px;border-radius:99px;font-weight:800;font-size:12px}
h2{margin:12px 0}input{width:100%;padding:14px;border-radius:12px;border:1px solid #333;background:#0f0f18;color:#fff;margin:10px 0}
button{width:100%;padding:14px;border-radius:12px;border:0;background:linear-gradient(135deg,#ff6a00,#ff2d55);color:#fff;font-weight:800;font-size:16px;cursor:pointer}
.stats{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:15px}
.stat{background:#0f0f18;padding:14px;border-radius:12px;border:1px solid #222}
.green{color:#00ff88}.orange{color:#ff8c00}
</style>
</head>
<body>
<div class="header">🔥 AKB EARN - AKASAVANT INFINI 🔥</div>
<div class="container">
  <div class="card">
    <span class="badge">LIVE BOSS ✅</span>
    <h2>aka-earn.akasavantinfini.fun est LIVE !</h2>
    <p style="opacity:.7">Worker: akb-earn | Deploy: 9728091 + custom domain OK</p>
    <div class="stats">
      <div class="stat"><div>Statut</div><div class="green"><b>VERT 2x</b></div></div>
      <div class="stat"><div>Domaine</div><div class="orange"><b>Connecté</b></div></div>
    </div>
  </div>
  <div class="card">
    <h2>⚙️ Etherscan API Key - Earn Module</h2>
    <input id="apikey" placeholder="Colle ton ETHERSCAN API KEY ici (ex: 123ABC...)">
    <input id="wallet" placeholder="Wallet address 0x...">
    <button onclick="check()">CHECK BALANCE EARN 🚀</button>
    <div id="result" style="margin-top:15px;white-space:pre-wrap"></div>
  </div>
  <div class="card"><p>© Entreprise AKB - Korhogo CI - Savanes - BOSS MODE ON</p></div>
</div>
<script>
async function check(){
  const key=document.getElementById('apikey').value.trim();
  const wallet=document.getElementById('wallet').value.trim();
  const res=document.getElementById('result');
  if(!key||!wallet){res.textContent='⚠️ Rentre APIKEY + wallet BOSS';return}
  res.textContent='⏳ Checking...';
  try{
    const r=await fetch(\`https://api.etherscan.io/api?module=account&action=balance&address=\${wallet}&tag=latest&apikey=\${key}\`);
    const j=await r.json();
    if(j.status=='1'){res.textContent=\`✅ SUCCESS BOSS\\nBalance: \${j.result} Wei\\n=\${j.result/1e18} ETH\\nEtherscan API OK !\`; }
    else{res.textContent='❌ Erreur: '+j.message+' - '+j.result}
  }catch(e){res.textContent='❌ '+e}
}
</script>
</body>
</html>`;
    return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }
} satisfies ExportedHandler;
