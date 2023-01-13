const input = `30373
25512
65332
33549
35390`.split("\n");

function isHighest(list, max) {
  return list.every(x => +x < +max);
}

let count = 0;
for (let i = 0; i < input.length; i++) {
  for (let j = 0; j < input[i].length; j++) {
    const max = input[i][j];
    const up = input.slice(0, i).map(x => x[j]);
    const down = input.slice(i + 1).map(x => x[j]);
    const left = [...input[i].slice(0, j)];
    const right = [...input[i].slice(j + 1)];
    if (
      isHighest(up, max) ||
      isHighest(down, max) ||
      isHighest(left, max) ||
      isHighest(right, max)
    ) {

      count++;
    } else console.log(`${i},${j}`)
  }
}
console.log(count);
