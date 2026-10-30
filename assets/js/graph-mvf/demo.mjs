import { preset, TeachingEngine, trueBridges, stages, modes } from "./model.mjs";
const engine = new TeachingEngine();
const root = document.querySelector("#graph-mvf");
const $ = (id) => root.querySelector(`[data-mv="${id}"]`);
let graph = preset(),
  stage = 0,
  playing = false,
  timer = null,
  selected = null;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const colors = ["#257894", "#b65e30", "#7b59a3", "#38825b", "#b33767", "#777222"];
const fmt = (x) => Number(x).toFixed(3);
function option(select, value, label) {
  const o = document.createElement("option");
  o.value = value;
  o.textContent = label;
  select.append(o);
}
modes.forEach((m, i) => option($("mode"), i, m));
[
  ["bridge", "Two cycles joined by a bridge"],
  ["cycle", "Single cycle"],
  ["disconnected", "Two disconnected cycles"],
  ["tree", "Tree"],
  ["molecule", "Molecular-like graph"],
  ["c24", "C24 (constant features)"],
  ["c12s", "C12 + C12 (constant features)"],
].forEach(([v, l]) => option($("preset"), v, l));
function svgElement(tag, attrs, parent) {
  const e = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  parent.append(e);
  return e;
}
function draw(svg, result, channel = 0, comparison = false) {
  svg.replaceChildren();
  const n = graph.nodes.length;
  const positions = graph.nodes.map((v, i) => [
    220 + 165 * Math.cos((2 * Math.PI * i) / n - Math.PI / 2),
    190 + 145 * Math.sin((2 * Math.PI * i) / n - Math.PI / 2),
  ]);
  const part = result.partitions[channel] || result.partitions[0];
  const blockIndex = (cell) => part.blocks.findIndex((b) => b.includes(cell));
  const paint = (cell) => ($("blocks").checked && (stage >= 4 || comparison) ? colors[blockIndex(cell) % colors.length] : "#657681");
  const bridgeLabels = $("oracle").checked ? trueBridges(graph) : [];
  const activate = (element, cell, label) => {
    element.setAttribute("tabindex", "0");
    element.dataset.cell = cell;
    element.setAttribute("role", "button");
    element.setAttribute("aria-label", label);
    const inspect = () => {
      selected = cell;
      details(result, channel);
    };
    element.addEventListener("click", inspect);
    element.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        inspect();
      }
    });
    const title = svgElement("title", {}, element);
    title.textContent = label;
  };
  graph.edges.forEach((e, i) => {
    const a = positions[graph.nodes.findIndex((v) => v.id === e.u)],
      b = positions[graph.nodes.findIndex((v) => v.id === e.v)];
    const middle = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    svgElement(
      "line",
      { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: bridgeLabels[i] ? "#c25324" : "#92999e", "stroke-width": bridgeLabels[i] ? 4 : 1.5 },
      svg
    );
    if ($("links").checked && (stage >= 4 || comparison))
      [a, b].forEach((p, k) => {
        const vi = graph.nodes.findIndex((v) => v.id === (k ? e.v : e.u));
        if (part.links.some(([v, edge]) => v === vi && edge === i))
          svgElement("line", { x1: p[0], y1: p[1], x2: middle[0], y2: middle[1], stroke: paint(n + i), "stroke-width": 4 }, svg);
      });
    if (stage >= 2 || comparison) {
      const cell = svgElement(
        "rect",
        { x: middle[0] - 7, y: middle[1] - 7, width: 14, height: 14, fill: "var(--global-bg-color,white)", stroke: paint(n + i), class: "mv-cell" },
        svg
      );
      activate(cell, n + i, `Edge ${e.id}, endpoints ${e.u} and ${e.v}`);
      if (n <= 8) svgElement("text", { x: middle[0] + 10, y: middle[1] - 8 }, svg).textContent = `e${e.id}`;
    }
    if ($("dots").checked && stage === 5 && !reduced.matches) {
      const phase = playing ? (Date.now() % Number($("speed").value)) / Number($("speed").value) : 0.25;
      [a, b].forEach((endpoint, k) => {
        const from = phase < 0.5 ? endpoint : middle,
          to = phase < 0.5 ? middle : endpoint,
          t = (phase % 0.5) * 2;
        const q = Number($("mode").value) === 4 ? (channel ? 1 - e.cycle : e.cycle) : result.learned[i];
        if (e.p[k] * q > 0)
          svgElement(
            "circle",
            { cx: from[0] + (to[0] - from[0]) * t, cy: from[1] + (to[1] - from[1]) * t, r: 4, fill: "#d68b00", opacity: 0.35 + 0.65 * e.p[k] * q },
            svg
          );
      });
    }
  });
  graph.nodes.forEach((v, i) => {
    const [x, y] = positions[i];
    const cell = svgElement(
      "circle",
      { cx: x, cy: y, r: n > 12 ? 11 : 17, fill: "var(--global-bg-color,white)", stroke: paint(i), class: "mv-cell" },
      svg
    );
    activate(cell, i, `Vertex ${v.id}, input ${v.feature}, updated ${fmt(result.updated[i])}`);
    svgElement("text", { x, y: y + 4, "text-anchor": "middle" }, svg).textContent = v.id;
    if (n <= 8)
      svgElement("text", { x, y: y + 34, "text-anchor": "middle" }, svg).textContent = fmt(
        stage >= 6 ? result.updated[i] : stage >= 1 ? result.h[i] : v.feature
      );
  });
}
const explanations = [
  ["G = (V,E), X(G) = V disjoint-union E", "Circles are vertex-cells; squares are edge-cells. Initial scalar vertex features are editable below."],
  [
    "GINE: h~v = hv + MLP((1+epsilon)hv + sum_u ReLU(hu + edge_uv))",
    "The displayed calculation is a visual analogy: input plus mean neighbor feature. It is not a fitted GINE layer.",
  ],
  [
    "a(v,e) = sigmoid(score(v,e)); s(e) = (a(u,e)+a(v,e))/2",
    "Each endpoint has its own illustrative incidence weight. Symmetric edge priorities use their arithmetic mean.",
  ],
  [
    "pi(e) = (pi_cycle(e), pi_bridge(e))",
    "Event values are synthetic, editable probabilities. The optional ground-truth overlay is computed separately and never feeds routing.",
  ],
  [
    "select(v) = argmax over incident e of q(e), retaining ALL exact ties",
    "Connected components of selected vertex–edge links partition every cell. This discrete operation is stop-gradient; singleton cells remain.",
  ],
  [
    "t_e(q) = sum_{v in e} p_ve q_e h~v / max(eps, sum_{v in e} p_ve q_e); T_v(q) = sum_e p_ve q_e t_e(q) / max(eps, sum_e p_ve q_e)",
    "Continuous normalized transport: vertex to edge-cell to vertex. Zero total weight produces zero. Equations (3.9-3.10) with the learned rho map replaced by the identity and eps = 1e-8.",
  ],
  [
    "b_B = [mean(h~_v), mean(s_e t_e), log(1+|B intersect V|), log(1+|B intersect E|)]",
    "Teaching feedback averages these four features and broadcasts a gated residual. The learned phi/psi maps are not loaded.",
  ],
  [
    "readout = mean_v(updated_v); L = L_graph + 0.2 L_event",
    "The scalar is an invariant teaching summary, not graph-class confidence. A trained graph-classification head is unavailable.",
  ],
];
function details(result, channel = 0) {
  const target = $("details");
  target.replaceChildren();
  const add = (text) => {
    const p = document.createElement("p");
    p.textContent = text;
    target.append(p);
  };
  if (selected === null) {
    add("Select a vertex or edge-cell to inspect its values and block.");
    return;
  }
  const n = graph.nodes.length;
  if (selected < n) {
    const v = graph.nodes[selected];
    if (!v) return;
    add(`Vertex ${v.id}: input ${fmt(v.feature)}, local ${fmt(result.h[selected])}, updated ${fmt(result.updated[selected])}.`);
  } else {
    const i = selected - n,
      e = graph.edges[i];
    if (!e) return;
    add(`Edge e${e.id} (${e.u}, ${e.v}): incidence weights ${e.p.map(fmt).join(", ")}; cycle ${fmt(e.cycle)}, bridge ${fmt(1 - e.cycle)}.`);
    add(`Edge-cell state t = ${fmt(result.flows[channel]?.t[i] ?? result.flows[0].t[i])}.`);
  }
  const b = result.blockFeatures[channel]?.find((b) => b.cells.includes(selected)) || result.blockFeatures[0].find((b) => b.cells.includes(selected));
  if (b)
    add(
      `Block: ${b.vertices} vertices, ${b.edges} edges. h=${fmt(b.h)}, z=${fmt(b.z)}, logV=${fmt(b.logV)}, logE=${fmt(b.logE)}. Cells: ${b.cells.map((c) => (c < n ? `v${graph.nodes[c].id}` : `e${graph.edges[c - n].id}`)).join(", ")}.`
    );
}
function render() {
  const focusCell = document.activeElement?.dataset.cell;
  const focusView = document.activeElement?.closest("svg")?.dataset.mv;
  const mode = Number($("mode").value),
    result = engine.run(graph, mode, Number($("gate").value));
  $("stage").textContent = `${stage + 1} / 8 — ${stages[stage]}`;
  $("equation").textContent = explanations[stage][0];
  $("explanation").textContent = explanations[stage][1];
  $("readout").textContent =
    `Teaching mean readout: ${fmt(result.readout)} · ${graph.nodes.length} vertices · ${graph.edges.length} edges · no trained prediction`;
  $("block-summary").textContent = result.blockFeatures
    .map((bs, i) => `${mode === 4 ? (i ? "Bridge" : "Cycle") : "Priority"} blocks: ${bs.map((b) => `(${b.vertices}V, ${b.edges}E)`).join(" ")}`)
    .join(" | ");
  draw($("graph"), result);
  details(result);
  const comparison = engine.run(graph, 4, Number($("gate").value));
  draw($("cycle-graph"), comparison, 0, true);
  draw($("bridge-graph"), comparison, 1, true);
  $("play").textContent = playing ? "Pause" : "Play";
  if (focusCell !== undefined && focusView) $(focusView).querySelector(`[data-cell="${focusCell}"]`)?.focus({ preventScroll: true });
}
function tables() {
  $("scores").replaceChildren();
  $("features").replaceChildren();
  const numeric = (value, min, max, label, change) => {
    const input = document.createElement("input");
    input.type = "number";
    input.min = min;
    input.max = max;
    input.step = "0.05";
    input.value = value;
    input.setAttribute("aria-label", label);
    input.addEventListener("change", () => {
      const x = Number(input.value);
      if (input.value === "" || !Number.isFinite(x) || x < min || x > max) {
        input.value = value;
        return;
      }
      change(x);
      requestAnimationFrame(render);
    });
    return input;
  };
  graph.edges.forEach((e) => {
    const row = document.createElement("tr"),
      name = document.createElement("th");
    name.scope = "row";
    name.textContent = `e${e.id}: ${e.u}–${e.v}`;
    row.append(name);
    [0, 1, 2].forEach((k) => {
      const td = document.createElement("td");
      td.append(
        numeric(k === 2 ? e.cycle : e.p[k], 0, 1, k === 2 ? `Cycle probability e${e.id}` : `Incidence v${k ? e.v : e.u} e${e.id}`, (x) => {
          if (k === 2) e.cycle = x;
          else e.p[k] = x;
        })
      );
      row.append(td);
    });
    $("scores").append(row);
  });
  graph.nodes.forEach((v) => {
    const label = document.createElement("label");
    label.textContent = `v${v.id}`;
    label.append(numeric(v.feature, -10, 10, `Feature vertex ${v.id}`, (x) => (v.feature = x)));
    $("features").append(label);
  });
  ["from", "to", "remove-node"].forEach((id) => {
    const previous = $(id).value;
    $(id).replaceChildren();
    graph.nodes.forEach((v) => option($(id), v.id, `v${v.id}`));
    if (graph.nodes.some((v) => String(v.id) === previous)) $(id).value = previous;
  });
}
function pause() {
  playing = false;
  clearInterval(timer);
  timer = null;
  render();
}
$("play").addEventListener("click", () => {
  if (playing) {
    pause();
    return;
  }
  playing = true;
  let elapsed = 0;
  timer = setInterval(() => {
    elapsed += 100;
    if (elapsed >= Number($("speed").value)) {
      elapsed = 0;
      if (stage === 7) {
        pause();
        return;
      }
      stage++;
    }
    render();
  }, 100);
  render();
});
$("next").addEventListener("click", () => {
  pause();
  stage = Math.min(7, stage + 1);
  render();
});
$("previous").addEventListener("click", () => {
  pause();
  stage = Math.max(0, stage - 1);
  render();
});
function reset() {
  playing = false;
  clearInterval(timer);
  graph = preset($("preset").value);
  stage = 0;
  selected = null;
  $("error").textContent = "";
  tables();
  render();
}
$("reset").addEventListener("click", reset);
$("preset").addEventListener("change", reset);
["mode", "gate", "links", "blocks", "dots", "oracle"].forEach((id) => $(id).addEventListener("change", () => requestAnimationFrame(render)));
function edit(action) {
  pause();
  $("error").textContent = "";
  action();
  selected = null;
  tables();
  render();
}
$("add-node").addEventListener("click", () =>
  edit(() => {
    if (graph.nodes.length >= 30) {
      $("error").textContent = "Maximum 30 vertices.";
      return;
    }
    graph.nodes.push({ id: Math.max(-1, ...graph.nodes.map((v) => v.id)) + 1, feature: 1 });
  })
);
$("delete-node").addEventListener("click", () =>
  edit(() => {
    if (graph.nodes.length <= 1) {
      $("error").textContent = "Keep at least one vertex.";
      return;
    }
    const id = Number($("remove-node").value);
    graph.nodes = graph.nodes.filter((v) => v.id !== id);
    graph.edges = graph.edges.filter((e) => e.u !== id && e.v !== id);
  })
);
$("toggle-edge").addEventListener("click", () =>
  edit(() => {
    const u = Number($("from").value),
      v = Number($("to").value);
    if (u === v) {
      $("error").textContent = "Self-loops are excluded from simple graphs.";
      return;
    }
    const i = graph.edges.findIndex((e) => (e.u === u && e.v === v) || (e.u === v && e.v === u));
    if (i >= 0) graph.edges.splice(i, 1);
    else if (graph.edges.length < 60) graph.edges.push({ id: Math.max(-1, ...graph.edges.map((e) => e.id)) + 1, u, v, p: [0.5, 0.5], cycle: 0.5 });
    else $("error").textContent = "Maximum 60 edges.";
  })
);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pause();
});
new IntersectionObserver((entries) => {
  if (!entries[0].isIntersecting && playing) pause();
}).observe(root);
reduced.addEventListener("change", pause);
tables();
render();
