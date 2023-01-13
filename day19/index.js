const sample = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 14 clay. Each geode robot costs 3 ore and 16 obsidian.
Blueprint 2: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 19 clay. Each geode robot costs 2 ore and 12 obsidian.
Blueprint 3: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 9 clay. Each geode robot costs 4 ore and 16 obsidian.`;

function parse(input) {
  const blueprints = input.split("\n");
  return blueprints.map((blueprint) => {
    const numbers = blueprint.match(/\d+/g);
    if (!numbers) throw new Error("Invalid blueprint");
    const [
      id,
      oreRobot_oreCost,
      clayRobot_oreCost,
      obsidianRobot_oreCost,
      obsidianRobot_clayCost,
      geodeRobot_oreCost,
      geodeRobot_obsidianCost,
    ] = numbers.map(x => Number(x));
    return {
      id,
      oreRobot_oreCost,
      clayRobot_oreCost,
      obsidianRobot_oreCost,
      obsidianRobot_clayCost,
      geodeRobot_oreCost,
      geodeRobot_obsidianCost,
      max_oreCost: Math.max(oreRobot_oreCost, clayRobot_oreCost, geodeRobot_oreCost),
      max_clayCost: obsidianRobot_clayCost,
      max_obsidianCost: geodeRobot_obsidianCost,
    };
  });
}

const blueprints = parse(sample);

// state: [
//   oreAmount (0), clayAmount (1), obsidianAmount (2), geodeAmount (3),
//   oreRobots (4), clayRobots (5), obsidianRobots (6), geodeRobots (7), 
//   time (8),
// ]

function make_hash(state) {
  return state.join(",");
}

function unhash(hash) {
  return hash.split(",").map(x => Number(x));
}

const before = process.hrtime();
let sum = 0;
let prod = 1;
for (const blueprint of blueprints) {
  function findNeighbours(state) {
    const next = [];
    // generate materials
    const base = [
      state[0] + state[4], state[1] + state[5], state[2] + state[6], state[3] + state[7],
      state[4], state[5], state[6], state[7],
      state[8] - 1
    ];
    // make ore robot
    // idea: only make robot if we have R < C
    // where R is the rate we produce ore
    // and C is the max cost of a robot
    // same idea for other robots
    // if (state[4] < blueprint.max_oreCost) {
    if (state[0] >= blueprint.oreRobot_oreCost) {
      const copy = [...base];
      copy[0] -= blueprint.oreRobot_oreCost;
      copy[4] += 1;
      next.push(copy);
    }
    // }
    // make clay robot
    // if (state[5] < blueprint.max_clayCost) {
    if (state[0] >= blueprint.clayRobot_oreCost) {
      const copy = [...base];
      copy[0] -= blueprint.clayRobot_oreCost;
      copy[5] += 1;
      next.push(copy);
    }
    // }
    // make obsidian robot
    // if (state[6] < blueprint.max_obsidianCost) {
    if (state[0] >= blueprint.obsidianRobot_oreCost && state[1] >= blueprint.obsidianRobot_clayCost) {
      const copy = [...base];
      copy[0] -= blueprint.obsidianRobot_oreCost;
      copy[1] -= blueprint.obsidianRobot_clayCost;
      copy[6] += 1;
      next.push(copy);
    }
    // }
    // make geode robot
    // if (state[0] >= blueprint.geodeRobot_oreCost && state[2] >= blueprint.geodeRobot_obsidianCost) {
    const copy = [...base];
    copy[0] -= blueprint.geodeRobot_oreCost;
    copy[2] -= blueprint.geodeRobot_obsidianCost;
    copy[7] += 1;
    next.push(copy);
    // idea: always make geode robot if we can
    return [copy];
    // }x
    // do nothing
    // idea: only if at least one of the previous conditions fail
    if (next.length < 4) {
      next.push(base);
    }
    return next;
  }

  const start = [
    0, 0, 0, 0,
    1, 0, 0, 0,
    32
  ];
  const stack = [start];
  const visited = new Set([make_hash(start)]);
  let maxGeodeCount = 0;
  while (stack.length > 0) {
    const curr = stack.pop();
    if (Math.random() < 1e-8) console.log("thinking...");
    if (curr[8] === 0) {
      if (curr[3] > maxGeodeCount) {
        maxGeodeCount = curr[3];
        console.log('new max', maxGeodeCount);
      }
    } else {
      const next = findNeighbours(curr);
      for (const state of next) {
        const hash = make_hash(state);
        if (!visited.has(hash)) {
          stack.push(state);
          if (visited.size > 10_000_000) visited.clear();
          visited.add(hash);
        }
      }
    }
  }
  console.log(`max geode count: ${maxGeodeCount}, for id ${blueprint.id}`);
  sum += blueprint.id * maxGeodeCount;
  prod *= maxGeodeCount;
}

const after = process.hrtime(before);
console.log(`sum: ${sum}`);
console.log(`prod: ${prod}`);
console.log(`time: ${(after[0] + after[1] / 1e9).toFixed(2)}s`);

// 20: 0.79s
// 21: 1.27s
// 22: 2.35s
// 23: 4.91s
// 24: 11.42s
// 25: 15.51s
// ...
// (extrapolated) 32: 1480s = 0.4 hours
// and i like those odds

// 1: 11
// 2: 22
// 3: 17
// prod: 4114
// actual runtime: 22444s (~6.25 hours)
