// Pure educational calculations. No fitted parameters or oracle topology features.
export const modes = ["GINE baseline", "Hard MVF", "Soft incidence transport", "Hard + soft", "Topology-supervised event-MVF"];
export const stages = [
  "Input graph",
  "Local GINE analogy",
  "Incidence scores",
  "Auxiliary event head",
  "Hard partitions",
  "Soft transport",
  "Block feedback",
  "Graph readout",
];
export function preset(name = "bridge") {
  let n = 6,
    edges = [];
  const cycle = (start, size) => {
    for (let i = 0; i < size; i++) edges.push([start + i, start + ((i + 1) % size)]);
  };
  if (name === "c24") {
    n = 24;
    cycle(0, 24);
  } else if (name === "c12s") {
    n = 24;
    cycle(0, 12);
    cycle(12, 12);
  } else if (name === "cycle") {
    cycle(0, 6);
  } else if (name === "disconnected") {
    cycle(0, 3);
    cycle(3, 3);
  } else if (name === "tree") {
    edges = [
      [0, 1],
      [1, 2],
      [1, 3],
      [3, 4],
      [3, 5],
    ];
  } else if (name === "molecule") {
    n = 8;
    cycle(0, 6);
    edges.push([1, 6], [4, 7]);
  } else {
    cycle(0, 3);
    cycle(3, 3);
    edges.push([2, 3]);
  }
  return {
    nodes: Array.from({ length: n }, (_, id) => ({ id, feature: 1 })),
    edges: edges.map(([u, v], id) => ({ id, u, v, p: [0.5, 0.5], cycle: 0.5 })),
  };
}
export function partition(graph, priorities) {
  const n = graph.nodes.length,
    parent = Array.from({ length: n + graph.edges.length }, (_, i) => i);
  const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  const links = [];
  graph.nodes.forEach((node, v) => {
    const incident = graph.edges.flatMap((e, i) => (e.u === node.id || e.v === node.id ? [{ i, score: priorities[i] }] : []));
    const max = Math.max(...incident.map((x) => x.score));
    incident
      .filter((x) => x.score === max)
      .forEach(({ i }) => {
        parent[find(v)] = find(n + i);
        links.push([v, i]);
      });
  });
  const groups = new Map();
  parent.forEach((_, i) => {
    const r = find(i);
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r).push(i);
  });
  return { blocks: [...groups.values()], links };
}
export function trueBridges(graph) {
  // Removing an edge disconnects its endpoints iff the edge is a bridge.
  return graph.edges.map((edge, skip) => {
    const seen = new Set([edge.u]),
      queue = [edge.u];
    for (let k = 0; k < queue.length; k++)
      graph.edges.forEach((e, i) => {
        if (i === skip) return;
        const next = e.u === queue[k] ? e.v : e.v === queue[k] ? e.u : null;
        if (next !== null && !seen.has(next)) {
          seen.add(next);
          queue.push(next);
        }
      });
    return !seen.has(edge.v);
  });
}
export function transport(graph, h, q) {
  const index = new Map(graph.nodes.map((v, i) => [v.id, i]));
  const t = graph.edges.map((e, i) => {
    const denom = (e.p[0] + e.p[1]) * q[i];
    return (e.p[0] * q[i] * h[index.get(e.u)] + e.p[1] * q[i] * h[index.get(e.v)]) / Math.max(1e-8, denom);
  });
  const values = graph.nodes.map((v) => {
    let sum = 0,
      denom = 0;
    graph.edges.forEach((e, i) => {
      const endpoint = e.u === v.id ? 0 : e.v === v.id ? 1 : -1;
      if (endpoint >= 0) {
        const w = e.p[endpoint] * q[i];
        sum += w * t[i];
        denom += w;
      }
    });
    return sum / Math.max(1e-8, denom);
  });
  return { t, values };
}
export function simulate(graph, mode = 3, gate = 0.3) {
  const index = new Map(graph.nodes.map((v, i) => [v.id, i]));
  const h = graph.nodes.map((v) => {
    const neighbors = graph.edges.flatMap((e) => (e.u === v.id ? [e.v] : e.v === v.id ? [e.u] : []));
    return v.feature + (neighbors.length ? neighbors.reduce((s, id) => s + graph.nodes[index.get(id)].feature, 0) / neighbors.length : 0);
  });
  const learned = graph.edges.map((e) => (e.p[0] + e.p[1]) / 2);
  const cycle = graph.edges.map((e) => e.cycle),
    bridge = cycle.map((x) => 1 - x);
  const qs = mode === 4 ? [cycle, bridge] : [learned];
  const partitions = qs.map((q) => partition(graph, q));
  const flows = qs.map((q) => transport(graph, h, q));
  const blockFeatures = partitions.map(({ blocks }) =>
    blocks.map((cells) => {
      const vs = cells.filter((c) => c < graph.nodes.length),
        es = cells.filter((c) => c >= graph.nodes.length).map((c) => c - graph.nodes.length);
      const hv = vs.length ? vs.reduce((s, c) => s + h[c], 0) / vs.length : 0;
      const ze = es.length ? es.reduce((s, c) => s + learned[c] * flows[0].t[c], 0) / es.length : 0;
      return {
        cells,
        vertices: vs.length,
        edges: es.length,
        h: hv,
        z: ze,
        logV: Math.log1p(vs.length),
        logE: Math.log1p(es.length),
        signal: (hv + ze + Math.log1p(vs.length) + Math.log1p(es.length)) / 4,
      };
    })
  );
  const hard = [1, 3, 4].includes(mode),
    soft = [2, 3, 4].includes(mode);
  const updated = h.map(
    (x, i) =>
      x +
      (soft ? (gate * flows.reduce((s, f) => s + f.values[i], 0)) / flows.length : 0) +
      (hard ? (gate * blockFeatures.reduce((s, bs) => s + bs.find((b) => b.cells.includes(i)).signal, 0)) / blockFeatures.length : 0)
  );
  return { h, learned, partitions, flows, blockFeatures, updated, readout: updated.length ? updated.reduce((a, b) => a + b, 0) / updated.length : 0 };
}
// Future inference adapters must validate features, exported weights and Python parity.
export class TeachingEngine {
  kind = "teaching";
  run(graph, mode, gate) {
    return simulate(graph, mode, gate);
  }
}
