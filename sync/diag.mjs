// Diagnóstico temporal: qué datos de saldo enseña la liga (no imprime tokens).
const BASE="https://mister.mundodeportivo.com", COOKIE=process.env.MISTER_COOKIE||"";
const H={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",Cookie:COOKIE,Origin:BASE,Referer:BASE+"/feed"};
const strip=s=>s.replace(/<script[\s\S]*?<\/script>/g," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
const st=await (await fetch(BASE+"/standings",{headers:H})).text();
const u=st.match(/_FG_user\s*=\s*\{[\s\S]{0,20000}?\};/);
const flag=k=>{const m=u&&u[0].match(new RegExp('["\']?'+k+'["\']?\\s*:\\s*([^,}\\n]+)'));return m?m[1].trim():"?"};
console.log("show_balances:",flag("show_balances"),"max_debt:",flag("max_debt"));
const rows=st.match(/<div class="player-row">[\s\S]*?<\/a>\s*<\/div>/g)||[];
console.log("Fila clasificación ejemplo:",strip(rows[1]||rows[0]||"").slice(0,200));
const ids=[...st.matchAll(/href=["'](users\/\d+\/[^"']+)["']/g)].map(m=>m[1]);
if(ids[1]){const h=await (await fetch(BASE+"/"+ids[1],{headers:H})).text();const t=strip(h);
 const i=t.search(/saldo|balance/i);console.log("Perfil rival, contexto saldo:",i>=0?t.slice(Math.max(0,i-80),i+160):"(no aparece la palabra saldo)");
 console.log("Perfil rival, inicio:",t.slice(0,300));}
const b=await fetch(BASE+"/ajax/balance",{method:"POST",headers:{...H,"X-Requested-With":"XMLHttpRequest","Content-Type":"application/x-www-form-urlencoded"}});
const bj=await b.json().catch(()=>null);console.log("ajax/balance claves:",bj&&bj.data?Object.keys(bj.data).join(","):b.status);
const p=await fetch(BASE+"/ajax/sw/players",{method:"POST",body:"post=players&offset=0&order=0&name=&filters%5Bowner%5D=0",headers:{...H,"X-Requested-With":"XMLHttpRequest","Content-Type":"application/x-www-form-urlencoded"}});
const pj=await p.json().catch(()=>null);const x=pj?.data?.players?.[0];console.log("Campos de jugador:",x?Object.keys(x).join(","):p.status);
