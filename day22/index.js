const fs = require("fs");
const input = fs.readFileSync("./input.txt", "utf8");
const lines = input.split("\n").map((line) => line.replace("\r", ""));
const br = lines.findIndex((line) => line.trim().length === 0);
const [map, moveStr] = [lines.slice(0, br), lines[br + 1]];
const moves = moveStr.match(/\d+|L|R/g) || [];
const rowlen = Math.max(...map.map((row) => row.length));
map.forEach((row, i) => (map[i] = row.padEnd(rowlen, " ")));

// get each 50x50 square
// .12
// .4.
// 67.
// 9..
const squares = [];
for (let i = 0; i < map.length; i += 50) {
  for (let j = 0; j < map[i].length; j += 50) {
    squares.push(map.slice(i, i + 50).map((row) => row.slice(j, j + 50)));
  }
}

// dir: 0 = right, 1 = down, 2 = left, 3 = up
const dirs = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

// by inspection
// square_no, row, col, dir
const start_pos = [1, 0, 0, 0];

function move_std(curr_pos) {
  const [n, i, j, dir] = curr_pos;
  const [di, dj] = dirs[dir];
  const next_pos = [n, i + di, j + dj, dir];
  if (next_pos[1] < 0 || next_pos[2] < 0) return null;
  if (next_pos[1] >= 50 || next_pos[2] >= 50) return null;
  return next_pos;
}

function transition_right(next_square) {
  return (i, _j) => [next_square, i, 0, 0];
}

function transition_left(next_square) {
  return (i, _j) => [next_square, i, 49, 2];
}

function transition_down(next_square) {
  return (_i, j) => [next_square, 0, j, 1];
}

function transition_up(next_square) {
  return (_i, j) => [next_square, 49, j, 3];
}

// left = higher, right = lower
const shift_map = {
  1: {
    0: transition_right(2),
    1: transition_down(4),
    2: (i, _j) => [6, 49 - i, 0, 0], // 6, higher = lower, we now going right
    3: (_i, j) => [9, j, 0, 0], // 9, left = higher, we now going right
  },
  2: {
    0: (i, _j) => [7, 49 - i, 49, 2], // 7, higher = lower, we now going left 
    1: (_i, j) => [4, j, 49, 2], // 4, left = higher, we now going left
    2: transition_left(1),
    3: transition_up(9), // !
  },
  4: {
    0: (i, _j) => [2, 49, i, 3], // 2, higher = left, we now going up
    1: transition_down(7),
    2: (i, _j) => [6, 0, i, 1], // 6, higher = left, we now going down
    3: transition_up(1),
  },
  6: {
    0: transition_right(7),
    1: transition_down(9),
    2: (i, _j) => [1, 49 - i, 0, 0], // 1, higher = lower, we now going right
    3: (_i, j) => [4, j, 0, 0], // 4, left = higher, we now going right
  },
  7: {
    0: (i, _j) => [2, 49 - i, 49, 2], // 2, higher = lower, we now going left
    1: (_i, j) => [9, j, 49, 2], // 9, left = higher, we now going left
    2: transition_left(6),
    3: transition_up(4),
  },
  9: {
    0: (i, _j) => [7, 49, i, 3], // 7, higher = left, we now going UPPP OMG
    1: transition_down(2), // !
    2: (i, _j) => [1, 0, i, 1], // 1, higher = left, we now going down 
    3: transition_up(6),
  }
};

function shift(curr_pos) {
  const [n, i, j, dir] = curr_pos;
  const shift_func = shift_map[n][dir];
  return shift_func(i, j);
}

function move(curr_pos) {
  const next_std_pos = move_std(curr_pos);
  if (next_std_pos === null) return shift(curr_pos);
  return next_std_pos;
}

function turn(curr_pos, dir) {
  const next_pos = [...curr_pos];
  if (dir === "L") {
    next_pos[3] = (next_pos[3] + 3) % 4;
  } else if (dir === "R") {
    next_pos[3] = (next_pos[3] + 1) % 4;
  } else {
    throw new Error(`Invalid direction ${dir}`);
  }
  return next_pos;
}

function at(curr_pos) {
  const [n, i, j, _dir] = curr_pos;
  return squares[n][i][j];
}

function iteration(curr_pos, token) {
  if (/^\d+$/.test(token)) {
    for (let i = 0; i < +token; i++) {
      const next_pos = move(curr_pos);
      if (at(next_pos) === "#") {
        break;
      } else {
        curr_pos = next_pos;
      }
    }
  }
  else if (/^(L|R)$/.test(token)) curr_pos = turn(curr_pos, token);
  else throw new Error(`Invalid move ${token}`);
  return curr_pos;
}

let curr_pos = [...start_pos];

for (const token of moves) {
  curr_pos = iteration(curr_pos, token);
}

// [4, 16, 34, 1]
// formula: row * 1000 + col * 4 + dir
// square_no is 4 => row +50, col +50
// so we get row = 67, col = 85, dir = 1
// so the answer is 67341
// wrong! too low

// fixed bug!!
// [ 2, 46, 28, 1 ]
// lower than before, so no point in trying :(

// fixed another bug!!
// [ 9, 44, 3, 2 ]
// square_no is 9 => row +150, col +0
// so we get row = 195, col = 4, dir = 2
// so the answer is 195018
// wrong! too high

// fixed one last bug..
// [ 6, 36, 10, 1 ]
// square_no is 6 => row +100, col +0
// so we get row = 137, col = 11, dir = 1
// so the answer is 137045

console.log(curr_pos);
