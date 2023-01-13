const input = `Sensor at x=98246, y=1908027: closest beacon is at x=1076513, y=2000000
Sensor at x=1339369, y=2083853: closest beacon is at x=1076513, y=2000000
Sensor at x=679177, y=3007305: closest beacon is at x=1076513, y=2000000
Sensor at x=20262, y=3978297: closest beacon is at x=13166, y=4136840
Sensor at x=3260165, y=2268955: closest beacon is at x=4044141, y=2290104
Sensor at x=2577675, y=3062584: closest beacon is at x=2141091, y=2828176
Sensor at x=3683313, y=2729137: closest beacon is at x=4044141, y=2290104
Sensor at x=1056412, y=370641: closest beacon is at x=1076513, y=2000000
Sensor at x=2827280, y=1827095: closest beacon is at x=2757345, y=1800840
Sensor at x=1640458, y=3954524: closest beacon is at x=2141091, y=2828176
Sensor at x=2139884, y=1162189: closest beacon is at x=2757345, y=1800840
Sensor at x=3777450, y=3714504: closest beacon is at x=3355953, y=3271922
Sensor at x=1108884, y=2426713: closest beacon is at x=1076513, y=2000000
Sensor at x=2364307, y=20668: closest beacon is at x=2972273, y=-494417
Sensor at x=3226902, y=2838842: closest beacon is at x=3355953, y=3271922
Sensor at x=22804, y=3803886: closest beacon is at x=13166, y=4136840
Sensor at x=2216477, y=2547945: closest beacon is at x=2141091, y=2828176
Sensor at x=1690953, y=2203555: closest beacon is at x=1076513, y=2000000
Sensor at x=3055156, y=3386812: closest beacon is at x=3355953, y=3271922
Sensor at x=3538996, y=719130: closest beacon is at x=2972273, y=-494417
Sensor at x=2108918, y=2669413: closest beacon is at x=2141091, y=2828176
Sensor at x=3999776, y=2044283: closest beacon is at x=4044141, y=2290104
Sensor at x=2184714, y=2763072: closest beacon is at x=2141091, y=2828176
Sensor at x=2615462, y=2273553: closest beacon is at x=2757345, y=1800840`;

function cab([x1, y1], [x2, y2]) {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

function part1() {
  const set = new Set();
  const blacklist = new Set();
  let row = 2_000_000;
  for (const line of input.split("\n")) {
    const [x1, y1, x2, y2] = line.match(/(\-)?\d+/g).map(x => +x);
    const dist = cab([x1, y1], [x2, y2]);
    const count = dist - Math.abs(y1 - row);
    for (let off = -count; off <= +count; off++) {
      set.add(x1 + off);
    }
    if (y1 === row) blacklist.add(x1);
    if (y2 === row) blacklist.add(x2);
  }

  for (const x of blacklist) {
    set.delete(x);
  }
  console.log(set.size);
}

// 5125700

function getIntervals(row) {
  const intervals = [];
  for (const line of input.split("\n")) {
    const [x1, y1, x2, y2] = line.match(/(\-)?\d+/g).map(x => +x);
    const dist = cab([x1, y1], [x2, y2]);
    const count = dist - Math.abs(y1 - row);
    const interval = [x1 - count, x1 + count];
    if (interval[0] <= interval[1]) {
      intervals.push(interval);
    }
  }
  intervals.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return intervals;
}

function combineIntervals([...intervals], min, max) {
  for (let i = 0; i < intervals.length - 1; i++) {
    const current = intervals[i];
    const next = intervals[i + 1];
    if (next[0] <= current[1]) {
      intervals.splice(i, 2, [current[0], Math.max(current[1], next[1])]);
      i -= 1;
    }
  }
  for (let i = 0; i < intervals.length; i++) {
    if (intervals[i][1] < min) {
      intervals.splice(i, 1);
      i -= 1;
    } else if (intervals[i][0] < min) {
      intervals[i][0] = min;
    } else if (intervals[i][0] > max) {
      intervals.splice(i, 1);
      i -= 1;
    } else if (intervals[i][1] > max) {
      intervals[i][1] = max;
    }
  }
  return intervals;
}

function outside(intervals, min, max) {
  const options = new Set();
  if (intervals[0][0] > min) {
    for (let i = 0; i < intervals[0]; i++) {
      options.add(i);
    }
  }
  if (intervals[intervals.length - 1][1] < max) {
    for (let i = intervals[intervals.length - 1][1] + 1; i <= max; i++) {
      options.add(i);
    }
  }
  for (let i = 0; i < intervals.length - 1; i++) {
    for (let k = intervals[i][1] + 1; k < intervals[i + 1][0]; k++) {
      options.add(k);
    }
  }
  return options;
}

function createBlacklist() {
  const blacklist = new Map();
  for (const line of input.split("\n")) {
    const [x1, y1, x2, y2] = line.match(/(\-)?\d+/g).map(x => +x);
    if (!blacklist.has(y1)) {
      blacklist.set(y1, new Set());
    }
    if (!blacklist.has(y2)) {
      blacklist.set(y2, new Set());
    }
    blacklist.get(y1).add(x1);
    blacklist.get(y2).add(x2);
  }
  return blacklist;
}

const blacklist = createBlacklist();
function check(row, min, max) {
  const intervals = getIntervals(row);
  const combined = combineIntervals(intervals, min, max);
  const result = outside(combined, min, max);
  // console.log(row, intervals, combined, result);
  if (result.size > 0) {
    const blacklist_row = blacklist.get(row) || new Set();
    for (const x of result) {
      if (!blacklist_row.has(x)) {
        console.log("OMGGGG!!!", row,result,x);
        console.log(`x=${x},y=${row}`);
        console.log(x * 4000000 + row);
        return false;
      }
    }
    console.log("sadge ._.", row, result);
    return true;
  } else return true;
}

function part2() {
  let lim = 4_000_000;
  // let lim = 20;
  for (let i = 0; i < lim; i++) {
    const result = check(i, 0, lim);
    if (result) console.log(`${i} done`);
    else break;
  }
}

console.log(part1());
