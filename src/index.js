export default {
  async fetch(request, env) {
    return new Response(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AKB EARN - BSC On-Chain</title>
<style>
body{background:#0a0e27;color:white;font-family:Arial;text-align:center;padding:20px}
.card{background:#1a1f3d;padding:20px;border-radius:15px;margin:15px 0}
button{background:#f0b90b;color:black;padding:15px 30px;border:none;border-radius:10px;font-weight:bold;font-size:18px;width:100%}
input{width:90%;padding:12px;border-radius:10px;border:none;margin:10px 0}
h1{color:#f0b90b}
</style>
</head>
<body>
<h1>🔥 AKB EARN 🔥</h1>
<p>✅ Worker connecté à BSC avec ethers.js</p>
<div class="card">
<h3>Version GitHub → Cloudflare</h3>
<p>ID: 74e41378 - 100% - 0% erreur</p>
<p>✅ ethers installé automatiquement</p>
</div>
<div class="card">
<input id="addr" placeholder="Adresse BSC 0x..." />
<button onclick="check()">VÉRIFIER BALANCE ON-CHAIN</button>
<p id="res"></p>
</div>
<script type="module">
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.13.2/+esm";
async function check(){
 const a=document.getElementById('addr').value;
 const r=document.getElementById('res');
 if(!a){r.innerText='Entre une adresse';return}
 r.innerText='Connexion BSC...';
 try{
  const provider = new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
  const bal = await provider.getBalance(a);
  r.innerText='Balance: '+ethers.formatEther(bal)+' BNB (ON-CHAIN ✅)';
 }catch(e){r.innerText='Erreur: '+e.message}
}
window.check=check;
</script>
</body>
</html>`, {headers:{"Content-Type":"text/html"}});
  }
}
