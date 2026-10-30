import test from "node:test";
import assert from "node:assert/strict";
import { preset, partition, trueBridges, simulate, transport } from "../assets/js/graph-mvf/model.mjs";
const graph = (nodes, edges) => ({
  nodes: nodes.map((id) => ({ id, feature: 1 })),
  edges: edges.map(([u, v], id) => ({ id, u, v, p: [0.5, 0.5], cycle: 0.5 })),
});
test("triangle retains every exact tie and produces one six-cell block", () => {
  const g = graph(
      [0, 1, 2],
      [
        [0, 1],
        [1, 2],
        [2, 0],
      ]
    ),
    p = partition(g, [0.5, 0.5, 0.5]);
  assert.equal(p.links.length, 6);
  assert.deepEqual(
    p.blocks.map((b) => b.length),
    [6]
  );
});
test("path includes every cell and both true bridges", () => {
  const g = graph(
    [0, 1, 2],
    [
      [0, 1],
      [1, 2],
    ]
  );
  assert.equal(partition(g, [1, 1]).blocks[0].length, 5);
  assert.deepEqual(trueBridges(g), [true, true]);
});
test("unselected edge and isolated vertex survive as singleton blocks", () => {
  const g = graph(
      [0, 1, 2, 3],
      [
        [0, 1],
        [1, 2],
        [2, 0],
      ]
    ),
    p = partition(g, [1, 0, 1]);
  assert(p.blocks.some((b) => b.length === 1 && b[0] === 5));
  assert(p.blocks.some((b) => b.length === 1 && b[0] === 3));
  assert.equal(p.blocks.flat().length, 7);
});
test("C24 and two C12 cycles have identical local states and distinct cardinalities", () => {
  const a = simulate(preset("c24")),
    b = simulate(preset("c12s"));
  assert.deepEqual(a.h, b.h);
  assert.deepEqual(
    a.blockFeatures[0].map((x) => [x.vertices, x.edges]),
    [[24, 24]]
  );
  assert.deepEqual(
    b.blockFeatures[0].map((x) => [x.vertices, x.edges]),
    [
      [12, 12],
      [12, 12],
    ]
  );
});
test("relabeling preserves membership and graph readout", () => {
  const g = preset(),
    rename = (id) => 100 - id,
    h = { nodes: g.nodes.map((v) => ({ ...v, id: rename(v.id) })), edges: g.edges.map((e) => ({ ...e, u: rename(e.u), v: rename(e.v) })) };
  assert.deepEqual(simulate(g), simulate(h));
});
test("continuous transport normalizes weights, handles zero denominators", () => {
  const g = graph([0, 1, 2], [[0, 1]]);
  g.edges[0].p = [0.25, 0.75];
  const flow = transport(g, [2, 6, 9], [0.8]);
  assert(Math.abs(flow.t[0] - 5) < 1e-12);
  assert(flow.values.every((x, i) => Math.abs(x - (i === 2 ? 0 : 5)) < 1e-12));
  assert.deepEqual(transport(g, [2, 6, 9], [0]), { t: [0], values: [0, 0, 0] });
  g.edges[0].p = [0, 0];
  assert.deepEqual(transport(g, [2, 6, 9], [0.8]), { t: [0], values: [0, 0, 0] });
});
test("oracle topology is independent from simulation and all mechanisms are finite", () => {
  const g = preset();
  const before = simulate(g, 4);
  trueBridges(g);
  assert.deepEqual(before, simulate(g, 4));
  for (let i = 0; i < 5; i++) assert(Number.isFinite(simulate(g, i).readout));
  assert.deepEqual(simulate(g, 0).updated, simulate(g, 0).h);
});

test("node and edge storage permutations preserve canonical blocks", () => {
  const g = preset("bridge");
  g.edges[0].p = [0.8, 0.2];
  const reordered = { nodes: [...g.nodes].reverse(), edges: [...g.edges].reverse() };
  const canonical = (x) => {
    const r = simulate(x, 3);
    return r.partitions[0].blocks
      .map((b) =>
        b
          .map((c) => (c < x.nodes.length ? "v" + x.nodes[c].id : "e" + x.edges[c - x.nodes.length].id))
          .sort()
          .join(",")
      )
      .sort();
  };
  assert.deepEqual(canonical(g), canonical(reordered));
  assert(Math.abs(simulate(g, 3).readout - simulate(reordered, 3).readout) < 1e-12);
});
