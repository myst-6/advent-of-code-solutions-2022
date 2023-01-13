const input = `Valve QE has flow rate=3; tunnels lead to valves OU, ME, UX, AX, TW
Valve TN has flow rate=16; tunnels lead to valves UW, CG, WB
Valve UX has flow rate=0; tunnels lead to valves AA, QE
Valve HK has flow rate=5; tunnels lead to valves HT, QU, TW, WV, OK
Valve SK has flow rate=14; tunnels lead to valves GH, GA, XM
Valve HY has flow rate=0; tunnels lead to valves LG, AA
Valve BK has flow rate=0; tunnels lead to valves SZ, AA
Valve BY has flow rate=11; tunnels lead to valves SP, HS, DN, KD, TK
Valve GR has flow rate=0; tunnels lead to valves FE, OK
Valve OH has flow rate=0; tunnels lead to valves BM, KE
Valve DC has flow rate=0; tunnels lead to valves AX, XH
Valve YS has flow rate=0; tunnels lead to valves XH, EU
Valve KP has flow rate=0; tunnels lead to valves KI, OF
Valve LG has flow rate=0; tunnels lead to valves FE, HY
Valve FE has flow rate=4; tunnels lead to valves RU, GR, YI, LG, ME
Valve NK has flow rate=0; tunnels lead to valves SD, BM
Valve EU has flow rate=0; tunnels lead to valves NS, YS
Valve OF has flow rate=0; tunnels lead to valves CJ, KP
Valve TW has flow rate=0; tunnels lead to valves HK, QE
Valve GL has flow rate=0; tunnels lead to valves AF, CQ
Valve OU has flow rate=0; tunnels lead to valves KN, QE
Valve BM has flow rate=24; tunnels lead to valves GH, NK, YH, OH
Valve GA has flow rate=0; tunnels lead to valves SK, SZ
Valve EI has flow rate=17; tunnels lead to valves ZX, AF
Valve QN has flow rate=25; tunnel leads to valve SD
Valve ZX has flow rate=0; tunnels lead to valves EI, WB
Valve ME has flow rate=0; tunnels lead to valves QE, FE
Valve CJ has flow rate=21; tunnels lead to valves OF, YI, KD
Valve AX has flow rate=0; tunnels lead to valves DC, QE
Valve LW has flow rate=0; tunnels lead to valves AA, HT
Valve CQ has flow rate=18; tunnels lead to valves GL, XM
Valve KN has flow rate=0; tunnels lead to valves SZ, OU
Valve HS has flow rate=0; tunnels lead to valves UZ, BY
Valve RU has flow rate=0; tunnels lead to valves TK, FE
Valve SZ has flow rate=6; tunnels lead to valves WV, GA, BK, KE, KN
Valve AF has flow rate=0; tunnels lead to valves GL, EI
Valve YI has flow rate=0; tunnels lead to valves FE, CJ
Valve HT has flow rate=0; tunnels lead to valves LW, HK
Valve WV has flow rate=0; tunnels lead to valves SZ, HK
Valve TK has flow rate=0; tunnels lead to valves BY, RU
Valve GH has flow rate=0; tunnels lead to valves BM, SK
Valve CG has flow rate=0; tunnels lead to valves TN, SP
Valve AA has flow rate=0; tunnels lead to valves HY, UX, VQ, LW, BK
Valve SP has flow rate=0; tunnels lead to valves BY, CG
Valve XM has flow rate=0; tunnels lead to valves SK, CQ
Valve DN has flow rate=0; tunnels lead to valves NS, BY
Valve XH has flow rate=22; tunnels lead to valves YS, QU, UZ, DC
Valve KI has flow rate=20; tunnels lead to valves UW, KP
Valve OK has flow rate=0; tunnels lead to valves HK, GR
Valve YH has flow rate=0; tunnels lead to valves VQ, BM
Valve UZ has flow rate=0; tunnels lead to valves XH, HS
Valve KE has flow rate=0; tunnels lead to valves OH, SZ
Valve VQ has flow rate=0; tunnels lead to valves AA, YH
Valve QU has flow rate=0; tunnels lead to valves HK, XH
Valve WB has flow rate=0; tunnels lead to valves TN, ZX
Valve UW has flow rate=0; tunnels lead to valves KI, TN
Valve SD has flow rate=0; tunnels lead to valves NK, QN
Valve NS has flow rate=23; tunnels lead to valves EU, DN
Valve KD has flow rate=0; tunnels lead to valves BY, CJ`;

const debug = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`;

const start = performance.now();
const values = {};
const adjList = {};

for (const line of input.split("\n")) {
  const tokens = line.match(/[A-Z]{2}|\d+/g);
  const [key, rate, ...adj] = tokens;
  values[key] = +rate;
  adjList[key] = adj;
}

/* old code
// state: [time, curr, rate, total, open]
const begin = [30, "AA", 0, 0, new Set()];

function getEntry([time, curr, rate, total, open]) {
  let hsh = `${time},${curr},${rate}`;
  for (const x of open) hsh += "," + x;
  return [hsh, total];
}

function unhash([key, value]) {
  const [time, curr, rate, ...open] = key.split(",");
  return [+time, curr, +rate, +value, new Set(open)];
}

function findNeighbours([time, curr, rate, total, open]) {
  const next = [];

  // can open the valve, if not already open
  if (values[curr] > 0 && !open.has(curr)) {
    const nextOpen = new Set(open);
    nextOpen.add(curr);
    next.push([time - 1, curr, rate + values[curr], total + rate, nextOpen]);
  }

  // can visit any adj tunnel
  for (const tunnel of adjList[curr]) {
    next.push([time - 1, tunnel, rate, total + rate, open]);
  }

  // perhaps sitting still is also an option

  return next;
}
*/

// new code

const begin = [30, "AA", 0, 0, new Set()];
const important = Object.keys(adjList).filter((x) => values[x] > 0);
const minDist = {};

function bfs(from, to) {
  const visited = new Set([from]);
  let curr = new Set([from]),
    d = 0;
  while (!curr.has(to)) {
    d++;
    const next = new Set();
    for (const x of curr) {
      for (const adj of adjList[x]) {
        if (!visited.has(adj)) {
          next.add(adj);
          visited.add(adj);
        }
      }
    }
    if (next.size === 0) {
      d = Infinity;
      break;
    }
    curr = next;
  }
  return d;
}

for (const x of [...important, "AA"]) {
  minDist[x] = {};
  for (const y of important) {
    if (x === y) continue;
    const d = bfs(x, y);
    if (Number.isFinite(d)) {
      minDist[x][y] = bfs(x, y);
    }
  }
}

// state: [time, curr, rate, total, open]
function findNeighbours([time, curr, rate, total, open]) {
  const next = [];

  // open current valve
  if (time > 0 && !open.has(curr) && values[curr] > 0) {
    const newOpen = new Set(open);
    newOpen.add(curr);
    next.push([time - 1, curr, rate + values[curr], total + rate, newOpen]);
  } else {
    // visit a nearby unopened valve
    for (const adj in minDist[curr]) {
      const dist = minDist[curr][adj];
      // console.log(curr,adj,dist,time);
      if (dist <= time && !open.has(adj)) {
        next.push([time - dist, adj, rate, total + rate * dist, open]);
      }
    }
  }

  // do nothin
  if (next.length === 0) {
    next.push([0, curr, rate, total + rate * time, open]);
  }

  return next;
}

function getEntry([time, curr, rate, total, open]) {
  let hsh = `${time},${curr},${rate}`;
  const xs = [...open].sort();
  for (const x of xs) hsh += "," + x;
  return [hsh, total];
}

function unhash([key, value]) {
  const [time, curr, rate, ...open] = key.split(",");
  return [+time, curr, +rate, +value, new Set(open)];
}

// const visited = new Set();
const [k, v] = getEntry(begin);
const next = new Map([[k, v]]);
const keys = new Set([k]);
let max = 0;
while (keys.size > 0) {
  const key = keys.values().next().value;
  const curr = unhash([key, next.get(key)]);
  keys.delete(key);
  if (Math.random() < 0.001) console.log(curr[0], keys.size);
  if (curr[0] == 0) {
    if (Math.random() < 0.001) console.log(curr, keys.size);
    if (curr[3] > max) {
      max = curr[3];
    }
    continue;
  }
  for (const state of findNeighbours(curr)) {
    const [key, value] = getEntry(state);
    if (next.has(key)) {
      let total = next.get(key);
      if (value > total) {
        next.set(key, value);
        keys.add(key);
      }
    } else {
      next.set(key, value);
      keys.add(key);
    }
  }
}

const end = performance.now();
console.log(max, end - start);
