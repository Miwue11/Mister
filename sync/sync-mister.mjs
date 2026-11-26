// Lee la liga de Mister (solo lectura) y copia jugadores, dueños y cláusulas a Firebase.
// Usa los endpoints internos de la web de Mister con la sesión de una cuenta de la liga.
// Nunca escribe nada en Mister.
import admin from "firebase-admin";

const BASE = "https://mister.mundodeportivo.com";
const COOKIE = (process.env.MISTER_COOKIE || "").trim();
const COMMUNITY = (process.env.MISTER_COMMUNITY_ID || "").trim();
let xAuth = (process.env.MISTER_X_AUTH || "").trim();
const MEMBERS = ["Miguel", "Agustin", "Jaime", "Carlos", "David"];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const norm = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function headers(extra = {}) {
  const h = { "User-Agent": UA, Origin: BASE, Referer: BASE + "/feed", Cookie: COOKIE, ...extra };
  if (xAuth) h["x-auth"] = xAuth;
  return h;
}

async function getHtml(path) {
  const r = await fetch(BASE + path, { headers: headers({ Accept: "text/html,*/*" }), redirect: "manual" });
  if (r.status >= 300 && r.status < 400) throw new Error(`SESION: ${path} redirige a ${r.headers.get("location") || "?"} (la sesión ha caducado)`);
  if (!r.ok) throw new Error(`${path} → HTTP ${r.status}`);
  const html = await r.text();
  const m = html.match(/_FG_cfg\s*=\s*\{[\s\S]{0,4000}?["']?auth["']?\s*:\s*["']([^"']+)["']/);
  if (m) xAuth = m[1];
  return html;
}

async function ajax(path, data = {}) {
  const body = new URLSearchParams(Object.entries(data).map(([k, v]) => [k, String(v)]));
  for (let i = 0; i < 2; i++) {
    const r = await fetch(BASE + path, {
      method: "POST", body,
      headers: headers({ Accept: "*/*", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "X-Requested-With": "XMLHttpRequest" })
    });
    if (r.status === 401 && i === 0) { await getHtml("/team"); continue; }
    if (r.status === 429) { await sleep(5000); continue; }
    if (!r.ok) throw new Error(`${path} → HTTP ${r.status}`);
    const t = await r.text();
    if (!t) return {};
    try { return JSON.parse(t); } catch { throw new Error(`${path} no devolvió JSON (¿sesión caducada?)`); }
  }
  throw new Error(`${path} → sin respuesta válida`);
}

function parseStandings(html) {
  const out = [], seen = new Set();
  const blocks = html.match(/<div class="player-row">[\s\S]*?<\/a>\s*<\/div>/g) || [];
  for (const b of blocks) {
    const id = (b.match(/users\/(\d+)\//) || [])[1];
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const raw = (b.match(/class="name\b[^"]*"[^>]*>([\s\S]*?)<\/div>/) || [])[1] || "";
    const name = raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || `Manager ${id}`;
    const played = (b.match(/class="played">([\s\S]*?)<\/div>/) || [])[1] || "";
    const vm = played.replace(/<[^>]+>/g, " ").match(/([\d.]{5,})/);
    out.push({ id, name, valor: vm ? Number(vm[1].replace(/\./g, "")) : null });
  }
  return out;
}

async function playerPool() {
  const all = [];
  for (let offset = 0; offset <= 3000; offset += 50) {
    const raw = await ajax("/ajax/sw/players", {
      post: "players", offset, order: 0, name: "",
      "filters[position]": 0, "filters[value_from]": 0, "filters[value_to]": 100000000, "filters[team]": 0,
      "filters[injured]": 0, "filters[favs]": 0, "filters[owner]": 0, "filters[benched]": 0, "filters[stealable]": 0
    });
    const batch = raw?.data?.players;
    if (!Array.isArray(batch) || !batch.length) break;
    all.push(...batch);
    if (batch.length < 50) break;
    await sleep(400);
  }
  return all;
}

async function clauseOf(id) {
  const raw = await ajax("/ajax/player-community-info", { id_player: id });
  const d = raw && typeof raw.data === "object" ? raw.data : raw;
  const v = Number(d?.clause?.value);
  return { clause: Number.isFinite(v) && v > 0 ? Math.round(v) : null, owner: d?.owner?.id != null ? String(d.owner.id) : null };
}

function autoMap(managers, saved) {
  const map = { ...saved };
  const used = new Set(Object.values(map));
  for (const m of managers) {
    if (map[m.id]) continue;
    const n = norm(m.name);
    const hit = MEMBERS.find(x => !used.has(x) && (n === norm(x) || n.startsWith(norm(x) + " ")));
    if (hit) { map[m.id] = hit; used.add(hit); }
  }
  return map;
}

// Solo lee la fecha de caducidad del token (campo exp); el token no se imprime nunca.
function tokenExpiry() {
  const t = (COOKIE.match(/(?:^|;\s*)token=([^;]+)/) || [])[1];
  if (!t) return null;
  try {
    const p = JSON.parse(Buffer.from(t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
    return typeof p.exp === "number" ? p.exp * 1000 : null;
  } catch { return null; }
}

async function main() {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) throw new Error("Falta el secreto FIREBASE_SERVICE_ACCOUNT");
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
  const db = admin.firestore();
  const estado = db.doc("mister/estado");
  try {
    if (!COOKIE) throw new Error("Falta el secreto MISTER_COOKIE");
    const exp = tokenExpiry();
    console.log("La sesión de Mister caduca:", exp ? new Date(exp).toISOString() : "no se sabe (el token no trae fecha)");
    if (COMMUNITY) await getHtml(`/action/change?id_community=${encodeURIComponent(COMMUNITY)}`).catch(() => {});
    const stHtml = await getHtml("/standings");
    const managers = parseStandings(stHtml);
    // El nombre de la propia cuenta a veces no viene en su fila: se toma de _FG_user.
    const me = stHtml.match(/_FG_user\s*=\s*\{[\s\S]{0,3000}?["']?id["']?\s*:\s*["']?(\d+)[\s\S]{0,3000}?["']?name["']?\s*:\s*["']([^"']+)["']/);
    for (const m of managers) if (/^Manager \d+$/.test(m.name) && me && me[1] === m.id) m.name = me[2];
    const meId = me ? me[1] : null;
    let saldo = null;
    try {
      const b = await ajax("/ajax/balance");
      const d = b && b.data;
      if (d && d.current != null) saldo = { id: meId, actual: Math.round(+d.current), futuro: d.future != null ? Math.round(+d.future) : null, fecha: Date.now() };
    } catch (e) { console.warn("Saldo no disponible:", e.message); }
    console.log("Saldo de la cuenta conectada:", saldo ? "leído" : "no disponible");
    console.log("Mánagers:", managers.map(m => m.name).join(", "));
    if (!managers.length) throw new Error("SESION: no se ha podido leer la clasificación (¿sesión caducada o liga distinta?)");
    console.log(`Clasificación: ${managers.length} mánagers`);

    const mapaSnap = await db.doc("mister/mapa").get();
    const savedMap = mapaSnap.exists ? (mapaSnap.data().mapa || {}) : {};
    const map = autoMap(managers, savedMap);
    if (JSON.stringify(map) !== JSON.stringify(savedMap)) await db.doc("mister/mapa").set({ mapa: map }, { merge: true });

    if (process.env.DIAG) {
      const u = stHtml.match(/_FG_user\s*=\s*\{[\s\S]{0,20000}?\};/);
      const keys = u ? [...u[0].matchAll(/["']?([a-zA-Z_]+)["']?\s*:/g)].map(m => m[1]).slice(0, 80) : [];
      console.log("DIAG _FG_user claves:", keys.join(","));
      for (const k of ["id", "id_uc", "id_user", "uc"]) { const m = u && u[0].match(new RegExp('["\']?' + k + '["\']?\\s*:\\s*["\']?(\\d+)')); console.log("DIAG", k, "=", m ? m[1] : "-"); }
      console.log("DIAG ids clasificación:", managers.map(m => m.id + ":" + m.name).join(" | "));
      const team = await getHtml("/team");
      console.log("DIAG imgs /team:", [...new Set([...team.matchAll(/<img[^>]+src=["']([^"']+)["']/g)].map(m => m[1].replace(/\d{3,}/g, "{n}")))].slice(0, 12).join(" | "));
    }
    const ids = new Set(managers.map(m => m.id));
    const pool = await playerPool();
    if (process.env.DIAG && pool[0]) console.log("DIAG pool campos:", JSON.stringify(Object.fromEntries(Object.entries(pool[0]).filter(([k, v]) => typeof v !== "object"))).slice(0, 900));
    const owned = pool.filter(p => p && p.id && ids.has(String(p.id_uc || "")));
    console.log(`Jugadores en la competición: ${pool.length}, con dueño en la liga: ${owned.length}`);

    const found = [];
    for (const p of owned) {
      const c = await clauseOf(p.id).catch(e => { console.warn(`cláusula ${p.id}: ${e.message}`); return { clause: null, owner: null }; });
      const owner = c.owner && ids.has(c.owner) ? c.owner : String(p.id_uc);
      const foto = String(p.photoUrl || p.photo_url || p.photo || "").trim();
      found.push({ id: String(p.id), nombre: String(p.name || "").trim(), owner, clause: c.clause, valor: Number(p.value) || 0,
        foto: /^https:\/\//.test(foto) ? foto : `https://cdn-mister.mundodeportivo.com/file/cdn-common/players/${p.id}.png` });
      await sleep(350);
    }

    const jSnap = await db.collection("jugadores").get();
    const existing = new Map(jSnap.docs.map(d => [d.id, d.data()]));
    const pend = (await db.collection("operaciones").where("estado", "==", "pendiente").get()).docs;
    const pendIds = new Set(pend.map(d => d.data().jugadorId));
    const now = Date.now();
    let nuevos = 0, cambios = 0, sinDueno = 0;
    const seenDocs = new Set();

    for (const f of found) {
      const dueno = map[f.owner] || null;
      if (!dueno) { sinDueno++; continue; }
      const docId = "m" + f.id;
      seenDocs.add(docId);
      const ref = db.doc("jugadores/" + docId);
      const cur = existing.get(docId);
      const base = { nombre: f.nombre, dueno, misterId: f.id, misterOwner: f.owner, valor: f.valor, foto: f.foto, sync: now };
      if (f.clause) base.real = f.clause;
      if (cur) {
        if (cur.dueno !== dueno) { await ref.set({ ...base, virtual: 0, act: now }, { merge: true }); cambios++; }
        else await ref.set(base, { merge: true });
        continue;
      }
      // ¿Ya estaba metido a mano? Se pasa su cláusula virtual al registro sincronizado.
      const manual = jSnap.docs.find(d => !d.data().misterId && d.data().dueno === dueno && norm(d.data().nombre) === norm(f.nombre));
      const virtual = manual ? (+manual.data().virtual || 0) : 0;
      await ref.set({ ...base, real: f.clause || (manual ? +manual.data().real || 0 : 0), virtual, act: now });
      if (manual) {
        for (const o of pend.filter(o => o.data().jugadorId === manual.id)) await o.ref.update({ jugadorId: docId });
        await manual.ref.delete();
      }
      nuevos++;
    }
    let quitados = 0;
    for (const [id, d] of existing) {
      if (d.misterId && !seenDocs.has(id) && !pendIds.has(id) && map[d.misterOwner]) { await db.doc("jugadores/" + id).delete(); quitados++; }
    }
    await estado.set({
      ok: true, fecha: now, ultimaOk: now, error: null, caduca: tokenExpiry(),
      managers, saldo, jugadores: found.length, sinDueno, nuevos, cambios, quitados
    });
    console.log(`Hecho: ${nuevos} nuevos, ${cambios} cambios de dueño, ${quitados} quitados, ${sinDueno} de mánagers sin asignar`);
  } catch (e) {
    console.error("ERROR:", e.message);
    await estado.set({ ok: false, fecha: Date.now(), error: String(e.message).slice(0, 300) }, { merge: true });
    process.exitCode = 1;
  }
}

main();
