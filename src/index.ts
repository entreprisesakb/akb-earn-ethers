import { ethers } from "ethers";
interface Env { TREASURY_PRIVATE_KEY: string; API_KEY: string; ASSETS: Fetcher; }
const BSC_RPC = "https://bsc-dataseed.binance.org/";
const ERC20_ABI = ["function balanceOf(address) view returns (uint256)","function transfer(address to, uint256 amount) returns (bool)","function decimals() view returns (uint8)"];
function timingSafeEqual(a: string, b: string): boolean { if (a.length !== b.length) return false; let r=0; for(let i=0;i<a.length;i++) r|=a.charCodeAt(i)^b.charCodeAt(i); return r===0; }
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, X-API-Key" };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (url.pathname === "/api/withdraw" && request.method === "POST") {
      const apiKey = request.headers.get("X-API-Key") || "";
      if (!env.API_KEY) return new Response(JSON.stringify({ error: "API_KEY not configured" }), { status: 503, headers: { ...cors, "Content-Type": "application/json" } });
      if (!timingSafeEqual(apiKey, env.API_KEY)) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...cors, "Content-Type": "application/json" } });
      try {
        const { address, amount, token } = await request.json() as { address: string; amount: string; token?: string };
        if (!address || !ethers.isAddress(address)) return new Response(JSON.stringify({ error: "Invalid address" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
        const provider = new ethers.JsonRpcProvider(BSC_RPC);
        const wallet = new ethers.Wallet(env.TREASURY_PRIVATE_KEY, provider);
        if (token && ethers.isAddress(token)) {
          const contract = new ethers.Contract(token, ERC20_ABI, wallet);
          const decimals: number = await contract.decimals().catch(() => 18);
          const parsed = ethers.parseUnits(amount, decimals);
          const bal: bigint = await contract.balanceOf(wallet.address);
          if (bal < parsed) return new Response(JSON.stringify({ error: "Insufficient token balance" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
          const tx = await contract.transfer(address, parsed);
          return new Response(JSON.stringify({ txHash: tx.hash, from: wallet.address, mode: "ethers-onchain" }), { headers: { ...cors, "Content-Type": "application/json" } });
        } else {
          const parsed = ethers.parseEther(amount);
          const bal = await provider.getBalance(wallet.address);
          if (bal < parsed) return new Response(JSON.stringify({ error: "Insufficient BNB" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
          const tx = await wallet.sendTransaction({ to: address, value: parsed });
          return new Response(JSON.stringify({ txHash: tx.hash, from: wallet.address, mode: "ethers-onchain" }), { headers: { ...cors, "Content-Type": "application/json" } });
        }
      } catch (e: any) { return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } }); }
    }
    return env.ASSETS.fetch(request);
  }
}
