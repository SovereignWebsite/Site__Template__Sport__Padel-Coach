/* Tomás Vilaréu demo. All words live in /data/content.json (EN and PT); court geometry in /data/court.json. */
(async () => {
const [C, G] = await Promise.all([fetch("/data/content.json").then((r) => r.json()), fetch("/data/court.json").then((r) => r.json())]);
const $ = (s) => document.querySelector(s);
const el = (t, a = {}, h = "") => { const e = document.createElement(t); Object.entries(a).forEach(([k, v]) => e.setAttribute(k, v)); if (h) e.innerHTML = h; return e; };
const SVGNS = "http://www.w3.org/2000/svg";
const sv = (t, a) => { const e = document.createElementNS(SVGNS, t); Object.entries(a).forEach(([k, v]) => e.setAttribute(k, v)); return e; };
let lang = "en"; try { lang = localStorage.getItem("tv-lang") || ""; } catch (e) {}
if (lang !== "en" && lang !== "pt") lang = (navigator.language || "en").toLowerCase().startsWith("pt") ? "pt" : "en";
const T = (k, v = {}) => { let s = (C.ui[k] || {})[lang] || ""; for (const [a, b] of Object.entries(v)) s = s.split("{" + a + "}").join(b); return s; };
const L = (o) => o[lang];
const col = (id) => `var(--${id.toLowerCase()})`;
const pad = (n) => String(n).padStart(2, "0");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
let picked = null, current = G.shots && Object.keys(G.shots)[0], raf = 0;
const shown = new Set(Object.keys(C.programmes));
const progEnd = (t, id) => { const [h, m] = t.split(":").map(Number), e = h * 60 + m + C.programmes[id].minutes; return `${pad(Math.floor(e / 60))}:${pad(e % 60)}`; };

function statics() {
  document.documentElement.lang = lang === "pt" ? "pt-PT" : "en-GB";
  document.title = T("title");
  document.querySelectorAll("[data-t]").forEach((n) => { n.textContent = T(n.dataset.t); });
  document.querySelectorAll("[data-t-alt]").forEach((n) => n.setAttribute("alt", T(n.dataset.tAlt)));
  document.querySelectorAll("[data-t-label]").forEach((n) => n.setAttribute("aria-label", T(n.dataset.tLabel)));
  $("#courtTitle").textContent = T("court_title");
  document.querySelectorAll(".lang button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
}
function about() {
  $("#principles").innerHTML = "";
  C.philosophy.forEach((x, i) => $("#principles").append(el("div", {}, `<i>${pad(i + 1)}</i><h3>${L(x.h)}</h3><p>${L(x.p)}</p>`)));
  $("#progs").innerHTML = "";
  Object.entries(C.programmes).forEach(([id, p]) => {
    $("#progs").append(el("article", { class: "prog", style: `--c:${col(id)}` }, `<h3>${L(p.title)}</h3><p class="for">${L(p.for)}</p><dl><dt>${T("p_length")}</dt><dd>${p.minutes} ${T("p_min")}</dd><dt>${T("p_group")}</dt><dd>${L(p.group)} ${T("p_players")}</dd><dt>${T("p_levels")}</dt><dd>${L(p.levels) === "Qualquer" || L(p.levels) === "Any" ? T("p_any") : L(p.levels)}</dd></dl><ul>${L(p.focus).map((f) => `<li>${f}</li>`).join("")}</ul>`));
  });
}
function week() {
  const START = 7, END = 21, H = 520;
  const y = (t) => { const [h, m] = t.split(":").map(Number); return ((h + m / 60 - START) / (END - START)) * H; };
  const grid = $("#weekGrid"); grid.innerHTML = ""; const slots = [];
  grid.append(el("div", { class: "col-h", style: "border-left:0" }, "&nbsp;"));
  Object.keys(C.days).forEach((d) => grid.append(el("div", { class: "col-h" }, `${d}<small>${L(C.days[d]).toUpperCase()}</small>`)));
  const rail = el("div", { class: "rail", style: `height:${H}px` });
  for (let h = START; h <= END; h += 2) rail.append(el("span", { style: `top:${y(h + ":00")}px` }, `${pad(h)}:00`));
  grid.append(rail);
  Object.entries(C.week).forEach(([d, list]) => {
    const c = el("div", { class: "day-col" });
    c.append(el("div", { class: "heat", style: `top:${y("11:30")}px;height:${y("17:00") - y("11:30")}px` }));
    list.forEach(({ time: t, programme: id }) => {
      const p = C.programmes[id], end = progEnd(t, id);
      const b = el("button", { type: "button", class: "slot" + (shown.has(id) ? "" : " dim"), style: `--c:${col(id)};top:${y(t)}px;height:${Math.max(y(end) - y(t), 44)}px`, "aria-pressed": String(!!(picked && picked.d === d && picked.t === t)), "data-p": id, "aria-label": `${L(C.days[d])} ${t} ${T("to")} ${end}, ${L(p.title)}` }, `<b>${t} ${T("to")} ${end}</b>${L(p.title)}`);
      b.addEventListener("click", () => { picked = { d, t, id }; week(); pickedText(); $("#done").hidden = true; });
      slots.push(b); c.append(b);
    });
    grid.append(c);
  });
  const wl = $("#weekList"); wl.innerHTML = "";
  Object.entries(C.week).forEach(([d, list]) => {
    const sec = el("div", {}, `<h3>${L(C.days[d])}</h3>`); const ul = el("ul");
    list.forEach(({ time: t, programme: id }) => {
      const p = C.programmes[id], end = progEnd(t, id); const li = el("li", { class: "row", style: `--c:${col(id)}` });
      const b = el("button", { type: "button", class: shown.has(id) ? "" : "dim", "aria-pressed": String(!!(picked && picked.d === d && picked.t === t)) }, `<i aria-hidden="true"></i><b>${t} ${T("to")} ${end}</b><span>${L(p.title)}</span>`);
      b.addEventListener("click", () => { picked = { d, t, id }; week(); pickedText(); $("#done").hidden = true; });
      li.append(b); ul.append(li);
    });
    sec.append(ul); wl.append(sec);
  });
  grid.append(el("div", { class: "heat-label", style: `top:${y("11:30") + 60}px` }, T("heat")));
  $("#chips").innerHTML = "";
  Object.entries(C.programmes).forEach(([id, p]) => {
    const b = el("button", { type: "button", "aria-pressed": String(shown.has(id)), style: `--c:${col(id)}` }, `<i></i>${L(p.title)}`);
    b.addEventListener("click", () => { shown.has(id) ? shown.delete(id) : shown.add(id); if (!shown.size) Object.keys(C.programmes).forEach((k) => shown.add(k)); week(); });
    $("#chips").append(b);
  });
}
function pickedText() {
  if (!picked) { $("#picked").textContent = T("ask_pick"); return; }
  const p = C.programmes[picked.id];
  $("#picked").innerHTML = `<strong>${L(C.days[picked.d])}, ${picked.t} ${T("to")} ${progEnd(picked.t, picked.id)}</strong><br>${T("picked", { prog: L(p.title), group: L(p.group), levels: L(p.levels) })}`;
}
let lvlSel = "3";
function levelOptions() {
  const s = $("#rLevel"); const keep = s.value || lvlSel; s.innerHTML = "";
  C.levels.forEach((l, i) => s.append(el("option", { value: i + 1 }, `${i + 1}. ${L(l.name)}`))); s.value = keep;
}
$("#reqForm").addEventListener("submit", (e) => {
  e.preventDefault(); const name = $("#rName").value.trim();
  const p = picked && C.programmes[picked.id];
  $("#done").textContent = picked ? T("ask_done", { name, day: L(C.days[picked.d]), time: picked.t, prog: L(p.title) }) : T("ask_first", { name });
  $("#done").hidden = false;
});
const quiz = $("#quiz");
function quizForm() {
  const prev = C.quiz.map((_, i) => (quiz.querySelector(`input[name="q${i}"]:checked`) || {}).value);
  quiz.innerHTML = "";
  C.quiz.forEach((q, qi) => {
    const fs = el("fieldset", {}, `<legend>${L(q.q)}</legend>`); const o = el("div", { class: "opts" });
    q.options.forEach((op, oi) => { const id = `q${qi}o${oi}`; const on = prev[qi] ? String(op.v) === prev[qi] : oi === (qi === 0 ? 2 : 1);
      o.append(el("label", { for: id }, `<input type="radio" id="${id}" name="q${qi}" value="${op.v}" ${on ? "checked" : ""}> ${L(op.label)}`)); });
    fs.append(o); const w = el("div", { class: "q" }); w.append(fs); quiz.append(w);
  });
}
function ladder() {
  const d = $("#ladder"); d.innerHTML = "";
  C.levels.forEach((l, i) => d.append(el("div", { "data-l": i + 1 }, `<b>${i + 1}</b><p><strong>${L(l.name)}.</strong> ${L(l.text)}</p>`)));
}
function score() {
  const vals = C.quiz.map((_, i) => Number((quiz.querySelector(`input[name="q${i}"]:checked`) || { value: 1 }).value));
  const lvl = Math.max(1, Math.min(7, Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)));
  document.querySelectorAll("#ladder div").forEach((d) => d.classList.toggle("on", Number(d.dataset.l) === lvl));
  const id = lvl <= 2 ? "P1" : lvl <= 4 ? "P2" : "P3", p = C.programmes[id];
  $("#resLevel").textContent = T("res_level", { n: lvl, name: L(C.levels[lvl - 1].name) });
  $("#resText").innerHTML = T("res_text", { prog: L(p.title), length: p.minutes + " " + T("p_min"), group: L(p.group), visit: L(C.programmes.P4.title) });
  lvlSel = String(lvl); $("#rLevel").value = lvlSel;
}
quiz.addEventListener("change", score);

/* Court lab */
const ball = $("#ball"), shadow = $("#shadow"), trail = $("#trail"), players = $("#players"), marks = $("#marks");
function shotBtns() {
  $("#shotBtns").innerHTML = "";
  C.shots.forEach((s) => {
    const b = el("button", { type: "button", "aria-pressed": String(s.id === current) }, L(s.name));
    b.addEventListener("click", () => { current = s.id; shotBtns(); play(); });
    $("#shotBtns").append(b);
  });
}
$("#replay").addEventListener("click", () => play());

/* court lab geometry */
function seg(sg, u) {
  const [x0, y0] = sg.from, [x1, y1] = sg.to;
  const c = sg.curve || 0;
  const x = x0 + (x1 - x0) * u, yy = y0 + (y1 - y0) * u + c * 4 * u * (1 - u);
  const bu = sg.bounceAt ? Math.min(u / sg.bounceAt, 1) : u;
  const h = sg.h * 4 * bu * (1 - bu) + (sg.bounceAt && u > sg.bounceAt ? 0.08 * Math.sin(Math.PI * (u - sg.bounceAt) / (1 - sg.bounceAt)) : 0);
  return [x, yy, h];
}
function pathD(s) {
  let d = "";
  s.path.forEach((sg, i) => { for (let k = 0; k <= 24; k++) { const [x, yy] = seg(sg, k / 24); d += `${i === 0 && k === 0 ? "M" : "L"}${x.toFixed(1)} ${yy.toFixed(1)} `; } });
  return d;
}
function cross(x, yy) { const g = sv("g", { stroke: "#f7c56a", "stroke-width": ".9", "stroke-linecap": "round" }); g.append(sv("path", { d: `M${x - 2} ${yy - 2}L${x + 2} ${yy + 2}M${x + 2} ${yy - 2}L${x - 2} ${yy + 2}` })); return g; }
function draw(s) {
  const cs = C.shots.find((x) => x.id === current);
  players.innerHTML = ""; marks.innerHTML = "";
  s.us.forEach(([x, yy], i) => { players.append(sv("circle", { cx: x, cy: yy, r: 4.2, fill: "#f08a43", stroke: "#3a1a05", "stroke-width": ".5" })); if (i === 0) { const t = sv("text", { x: x - 1.4, y: yy + 1.5, "font-size": "4", "font-family": "Archivo, sans-serif", "font-weight": "800", fill: "#1d0d02" }); t.textContent = "T"; players.append(t); } });
  s.them.forEach(([x, yy]) => players.append(sv("circle", { cx: x, cy: yy, r: 4.2, fill: "#f1f6f4", stroke: "#0a3b3a", "stroke-width": ".5" })));
  s.path.forEach((sg) => { if (sg.bounce) { const p = sg.bounceAt ? seg(sg, sg.bounceAt) : sg.to; marks.append(cross(p[0], p[1])); } if (sg.glass) marks.append(cross(sg.to[0], sg.to[1])); });
  trail.setAttribute("d", pathD(s));
  $("#shotName").textContent = L(cs.name); $("#shotKind").textContent = L(cs.kind); $("#shotText").textContent = L(cs.text); $("#shotPath").textContent = L(cs.path); $("#motionNote").hidden = !reduce;
  $("#mPace").style.width = s.pace + "%"; $("#mHeight").style.width = s.height + "%";
}
function place(x, yy, h) { ball.setAttribute("cx", x); ball.setAttribute("cy", yy - h * 6); ball.setAttribute("r", (1.6 + h * 2.2).toFixed(2)); shadow.setAttribute("cx", x); shadow.setAttribute("cy", yy + 1); shadow.setAttribute("rx", (2 - h * .6).toFixed(2)); }
function play() {
  cancelAnimationFrame(raf);
  const s = G.shots[current]; draw(s);
  const total = s.path.reduce((a, sg) => a + sg.t, 0);
  if (reduce) { const l = s.path[s.path.length - 1]; place(l.to[0], l.to[1], 0); return; }
  trail.style.strokeDashoffset = 0;
  let t0 = null;
  const step = (ts) => {
    if (t0 === null) t0 = ts;
    let e = (ts - t0) / 1000 * 0.9;
    if (e > total + 0.9) { t0 = ts; e = 0; }
    let acc = 0, done = false;
    for (const sg of s.path) {
      if (e <= acc + sg.t) { const [x, yy, h] = seg(sg, (e - acc) / sg.t); place(x, yy, h); done = true; break; }
      acc += sg.t;
    }
    if (!done) { const l = s.path[s.path.length - 1]; place(l.to[0], l.to[1], 0); }
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
}
function renderAll() { statics(); about(); levelOptions(); ladder(); quizForm(); score(); week(); pickedText(); shotBtns(); play(); }
document.querySelectorAll(".lang button").forEach((b) => b.addEventListener("click", () => { lang = b.dataset.lang; try { localStorage.setItem("tv-lang", lang); } catch (e) {} renderAll(); }));
renderAll();
})();
