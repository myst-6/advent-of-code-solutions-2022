const input = `Monkey 0:
  Starting items: 83, 62, 93
  Operation: new = old * 17
  Test: divisible by 2
    If true: throw to monkey 1
    If false: throw to monkey 6

Monkey 1:
  Starting items: 90, 55
  Operation: new = old + 1
  Test: divisible by 17
    If true: throw to monkey 6
    If false: throw to monkey 3

Monkey 2:
  Starting items: 91, 78, 80, 97, 79, 88
  Operation: new = old + 3
  Test: divisible by 19
    If true: throw to monkey 7
    If false: throw to monkey 5

Monkey 3:
  Starting items: 64, 80, 83, 89, 59
  Operation: new = old + 5
  Test: divisible by 3
    If true: throw to monkey 7
    If false: throw to monkey 2

Monkey 4:
  Starting items: 98, 92, 99, 51
  Operation: new = old * old
  Test: divisible by 5
    If true: throw to monkey 0
    If false: throw to monkey 1

Monkey 5:
  Starting items: 68, 57, 95, 85, 98, 75, 98, 75
  Operation: new = old + 2
  Test: divisible by 13
    If true: throw to monkey 4
    If false: throw to monkey 0

Monkey 6:
  Starting items: 74
  Operation: new = old + 4
  Test: divisible by 7
    If true: throw to monkey 3
    If false: throw to monkey 2

Monkey 7:
  Starting items: 68, 64, 60, 68, 87, 80, 82
  Operation: new = old * 19
  Test: divisible by 11
    If true: throw to monkey 4
    If false: throw to monkey 5`;

const monkeys = [];

for (const line of input.split("\n")) {
  if (!line) continue;
  const n = [...line].findIndex(c => c != " ");
  if (n === 0) {
    monkeys.push({inspected: 0});
  } else if (n === 2) {
    if (line.includes("Starting")) {
      monkeys[monkeys.length - 1].items = line.match(/\d+/g).map(x => BigInt(x));
    } else if (line.includes("Operation")) {
      const operation = line.match(/(?<=\=).*/g)[0].replace(/\d+/g, n => `BigInt(${n})`);
      monkeys[monkeys.length - 1].op = new Function("old", `return ${operation}`);
    } else if (line.includes("Test")) {
      const factor = BigInt(line.match(/\d+/g)[0]);
      monkeys[monkeys.length - 1].factor = factor;
      monkeys[monkeys.length - 1].test = (n) => n % factor === 0n;
    }
  } else if (n === 4) {
    const bool = line.includes("true").toString();
    monkeys[monkeys.length - 1][bool] = +line.match(/\d+/g)[0];
  } else {
    throw new Error(`sus: ${n} in '${line}'`);
  }
}

const m = monkeys.reduce((prod, monkey) => prod * monkey.factor, 1n);

const ROUNDS = 10000;
for (let round = 0; round < ROUNDS; round++) {
  for (let turn = 0; turn < monkeys.length; turn++) {
    const monkey = monkeys[turn];
    const items = monkey.items;
    monkey.items = [];
    monkey.inspected += items.length;
    for (const item of items) {
      // const worry = Math.floor(monkey.op(item) / 3);
      const worry = monkey.op(item);
      const result = monkey.test(worry).toString();
      const next = monkey[result];
      monkeys[next].items.push(worry % m);
    }
  }
  // console.log(Math.max(...monkeys.map(m => Math.max(...m.items))));
}

monkeys.sort((a, b) => b.inspected - a.inspected);
console.log(monkeys[0].inspected * monkeys[1].inspected);

// 112815
// 21126812364 too low
// 32396040072 too high
