const fs = require("fs");
const input = fs.readFileSync("./input.txt", "utf8");
const lines = input.split("\n").map((line) => line.replace("\r", ""));
const br = lines.findIndex((line) => line.trim().length === 0);
const [map, moveStr] = [lines.slice(0, br), lines[br + 1]];
const moves = moveStr.match(/\d+|L|R/g);
const rowlen = Math.max(...map.map((row) => row.length));
map.forEach((row, i) => (map[i] = row.padEnd(rowlen, " ")));
const copy = map.map((row) => [...row]);

// i, j, dir
// dir: 0=right, 1=down, 2=left, 3=up
const dirs = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];
let pos = [0, map[0].indexOf("."), 0];

function move(n) {
  for (let i = 0; i < n; i++) {
    const dir = pos[2];
    const [di, dj] = dirs[dir];
    let [ni, nj] = pos;
    do {
      [ni, nj] = [ni + di, nj + dj];
      if (ni < 0) ni += map.length;
      if (nj < 0) nj += rowlen;
      if (ni >= map.length) ni -= map.length;
      if (nj >= rowlen) nj -= rowlen;
    } while (map[ni][nj] === " ");
    if (map[ni][nj] === "#") break;
    copy[ni][nj] = [">", "v", "<", "^"][dir];
    pos[0] = ni;
    pos[1] = nj;
  }
}

function turn(let) {
  if (let === "L") {
    pos[2] = (pos[2] + 3) % 4;
  } else if (let === "R") {
    pos[2] = (pos[2] + 1) % 4;
  } else {
    throw new Error(`Invalid direction ${let}`);
  }
}

for (const token of moves) {
  // console.log(token);
  if (/^\d+$/.test(token)) move(+token);
  else if (/^(L|R)$/.test(token)) turn(token);
  else throw new Error(`Invalid move ${token}`);
}

const row = pos[0] + 1,
  col = pos[1] + 1,
  facing = pos[2];
console.log(copy.map((row) => row.join("")).join("\n"));
console.log({ row, col, facing });
console.log(1000 * row + 4 * col + facing);
