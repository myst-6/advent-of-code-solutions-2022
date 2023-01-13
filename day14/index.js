class Board {
  constructor() {
    this.data = new Map();
  }

  set(i, j, char) {
    if (!this.data.has(i)) {
      this.data.set(i, new Map());
    }
    this.data.get(i).set(j, char);
  }

  blocked(i, j) {
    return this.data.has(i) && this.data.get(i).has(j);
  }

  void(i, j) {
    for (const i2 of this.data.keys()) {
      const row = this.data.get(i2);
      for (const j2 of row.keys()) {
        if (i2 === i && j2 > j) return false;
      }
    }
    return true;
  }

  count(char) {
    let count = 0;
    for (const row of this.data.values()) {
      for (const value of row.values()) {
        if (value === char) {
          count++;
        }
      }
    }
    return count;
  }

  stringify(startI, endI, startJ, endJ) {
    const lines = [];
    // example prints it sideways
    for (let j=startJ; j<=endJ; j++) {
      let line = "";
      for (let i=startI; i<=endI; i++) {
        if (this.blocked(i, j)) {
          line += this.data.get(i).get(j);
        } else {
          line += " ";
        }
      }
      lines.push(line);
    }
    return lines.join("\n");
  }

  bounds() {
    const is = [], js = [];
    for (const i of this.data.keys()) {
      const row = this.data.get(i);
      is.push(i);
      for (const j of row.keys()) {
        js.push(j);
      }
    }
    return [
      Math.min(...is),
      Math.max(...is),
      Math.min(...js),
      Math.max(...js)
    ];
  }
}

function down([i, j]) {
  return [i, j + 1];
}

function left([i, j]) {
  return [i - 1, j];
}

function right([i, j]) {
  return [i + 1, j];
}

function constructBoard(input) {
  const board = new Board();
  for (const line of input.split("\n")) {
    const points = line.split(" -> ")
      .map(pt => pt.split(",").map(x => +x));
    for (let i = 0; i < points.length - 1; i++) {
      const from = points[i];
      const to = points[i + 1];
      const diff = [to[0] - from[0], to[1] - from[1]];
      while (from[0] !== to[0] || from[1] !== to[1]) {
        board.set(from[0], from[1], "#");
        from[0] += Math.sign(diff[0]);
        from[1] += Math.sign(diff[1]);
      }
    }
    // fill in last hole
    const last = points[points.length - 1];
    board.set(last[0], last[1], "#");
  }
  return board;
}

const input = `529,71 -> 529,72 -> 539,72 -> 539,71
484,168 -> 489,168
493,23 -> 493,13 -> 493,23 -> 495,23 -> 495,19 -> 495,23 -> 497,23 -> 497,15 -> 497,23 -> 499,23 -> 499,14 -> 499,23 -> 501,23 -> 501,14 -> 501,23 -> 503,23 -> 503,21 -> 503,23 -> 505,23 -> 505,18 -> 505,23
502,165 -> 507,165
481,165 -> 486,165
527,96 -> 527,98 -> 525,98 -> 525,106 -> 536,106 -> 536,98 -> 530,98 -> 530,96
528,68 -> 528,59 -> 528,68 -> 530,68 -> 530,63 -> 530,68 -> 532,68 -> 532,64 -> 532,68 -> 534,68 -> 534,66 -> 534,68 -> 536,68 -> 536,60 -> 536,68
493,23 -> 493,13 -> 493,23 -> 495,23 -> 495,19 -> 495,23 -> 497,23 -> 497,15 -> 497,23 -> 499,23 -> 499,14 -> 499,23 -> 501,23 -> 501,14 -> 501,23 -> 503,23 -> 503,21 -> 503,23 -> 505,23 -> 505,18 -> 505,23
500,176 -> 505,176
513,124 -> 513,126 -> 510,126 -> 510,134 -> 524,134 -> 524,126 -> 518,126 -> 518,124
498,140 -> 498,142 -> 497,142 -> 497,150 -> 507,150 -> 507,142 -> 502,142 -> 502,140
493,23 -> 493,13 -> 493,23 -> 495,23 -> 495,19 -> 495,23 -> 497,23 -> 497,15 -> 497,23 -> 499,23 -> 499,14 -> 499,23 -> 501,23 -> 501,14 -> 501,23 -> 503,23 -> 503,21 -> 503,23 -> 505,23 -> 505,18 -> 505,23
527,96 -> 527,98 -> 525,98 -> 525,106 -> 536,106 -> 536,98 -> 530,98 -> 530,96
506,42 -> 510,42
524,55 -> 524,46 -> 524,55 -> 526,55 -> 526,45 -> 526,55 -> 528,55 -> 528,47 -> 528,55 -> 530,55 -> 530,46 -> 530,55 -> 532,55 -> 532,48 -> 532,55
490,156 -> 495,156
496,174 -> 501,174
503,40 -> 507,40
501,136 -> 501,137 -> 514,137 -> 514,136
493,23 -> 493,13 -> 493,23 -> 495,23 -> 495,19 -> 495,23 -> 497,23 -> 497,15 -> 497,23 -> 499,23 -> 499,14 -> 499,23 -> 501,23 -> 501,14 -> 501,23 -> 503,23 -> 503,21 -> 503,23 -> 505,23 -> 505,18 -> 505,23
493,23 -> 493,13 -> 493,23 -> 495,23 -> 495,19 -> 495,23 -> 497,23 -> 497,15 -> 497,23 -> 499,23 -> 499,14 -> 499,23 -> 501,23 -> 501,14 -> 501,23 -> 503,23 -> 503,21 -> 503,23 -> 505,23 -> 505,18 -> 505,23
524,55 -> 524,46 -> 524,55 -> 526,55 -> 526,45 -> 526,55 -> 528,55 -> 528,47 -> 528,55 -> 530,55 -> 530,46 -> 530,55 -> 532,55 -> 532,48 -> 532,55
495,165 -> 500,165
537,85 -> 537,77 -> 537,85 -> 539,85 -> 539,76 -> 539,85 -> 541,85 -> 541,75 -> 541,85
527,96 -> 527,98 -> 525,98 -> 525,106 -> 536,106 -> 536,98 -> 530,98 -> 530,96
524,55 -> 524,46 -> 524,55 -> 526,55 -> 526,45 -> 526,55 -> 528,55 -> 528,47 -> 528,55 -> 530,55 -> 530,46 -> 530,55 -> 532,55 -> 532,48 -> 532,55
529,71 -> 529,72 -> 539,72 -> 539,71
488,165 -> 493,165
528,68 -> 528,59 -> 528,68 -> 530,68 -> 530,63 -> 530,68 -> 532,68 -> 532,64 -> 532,68 -> 534,68 -> 534,66 -> 534,68 -> 536,68 -> 536,60 -> 536,68
524,42 -> 528,42
537,85 -> 537,77 -> 537,85 -> 539,85 -> 539,76 -> 539,85 -> 541,85 -> 541,75 -> 541,85
533,118 -> 538,118
537,85 -> 537,77 -> 537,85 -> 539,85 -> 539,76 -> 539,85 -> 541,85 -> 541,75 -> 541,85
500,42 -> 504,42
528,68 -> 528,59 -> 528,68 -> 530,68 -> 530,63 -> 530,68 -> 532,68 -> 532,64 -> 532,68 -> 534,68 -> 534,66 -> 534,68 -> 536,68 -> 536,60 -> 536,68
493,153 -> 498,153
472,176 -> 477,176
491,162 -> 496,162
528,68 -> 528,59 -> 528,68 -> 530,68 -> 530,63 -> 530,68 -> 532,68 -> 532,64 -> 532,68 -> 534,68 -> 534,66 -> 534,68 -> 536,68 -> 536,60 -> 536,68
487,159 -> 492,159
521,40 -> 525,40
501,136 -> 501,137 -> 514,137 -> 514,136
475,174 -> 480,174
528,68 -> 528,59 -> 528,68 -> 530,68 -> 530,63 -> 530,68 -> 532,68 -> 532,64 -> 532,68 -> 534,68 -> 534,66 -> 534,68 -> 536,68 -> 536,60 -> 536,68
484,162 -> 489,162
515,40 -> 519,40
528,68 -> 528,59 -> 528,68 -> 530,68 -> 530,63 -> 530,68 -> 532,68 -> 532,64 -> 532,68 -> 534,68 -> 534,66 -> 534,68 -> 536,68 -> 536,60 -> 536,68
485,172 -> 490,172
512,34 -> 516,34
537,85 -> 537,77 -> 537,85 -> 539,85 -> 539,76 -> 539,85 -> 541,85 -> 541,75 -> 541,85
492,172 -> 497,172
501,136 -> 501,137 -> 514,137 -> 514,136
493,23 -> 493,13 -> 493,23 -> 495,23 -> 495,19 -> 495,23 -> 497,23 -> 497,15 -> 497,23 -> 499,23 -> 499,14 -> 499,23 -> 501,23 -> 501,14 -> 501,23 -> 503,23 -> 503,21 -> 503,23 -> 505,23 -> 505,18 -> 505,23
489,174 -> 494,174
516,121 -> 521,121
512,118 -> 517,118
529,115 -> 534,115
519,118 -> 524,118
493,23 -> 493,13 -> 493,23 -> 495,23 -> 495,19 -> 495,23 -> 497,23 -> 497,15 -> 497,23 -> 499,23 -> 499,14 -> 499,23 -> 501,23 -> 501,14 -> 501,23 -> 503,23 -> 503,21 -> 503,23 -> 505,23 -> 505,18 -> 505,23
513,124 -> 513,126 -> 510,126 -> 510,134 -> 524,134 -> 524,126 -> 518,126 -> 518,124
505,26 -> 505,28 -> 500,28 -> 500,31 -> 513,31 -> 513,28 -> 509,28 -> 509,26
528,68 -> 528,59 -> 528,68 -> 530,68 -> 530,63 -> 530,68 -> 532,68 -> 532,64 -> 532,68 -> 534,68 -> 534,66 -> 534,68 -> 536,68 -> 536,60 -> 536,68
524,55 -> 524,46 -> 524,55 -> 526,55 -> 526,45 -> 526,55 -> 528,55 -> 528,47 -> 528,55 -> 530,55 -> 530,46 -> 530,55 -> 532,55 -> 532,48 -> 532,55
505,26 -> 505,28 -> 500,28 -> 500,31 -> 513,31 -> 513,28 -> 509,28 -> 509,26
498,140 -> 498,142 -> 497,142 -> 497,150 -> 507,150 -> 507,142 -> 502,142 -> 502,140
509,40 -> 513,40
493,23 -> 493,13 -> 493,23 -> 495,23 -> 495,19 -> 495,23 -> 497,23 -> 497,15 -> 497,23 -> 499,23 -> 499,14 -> 499,23 -> 501,23 -> 501,14 -> 501,23 -> 503,23 -> 503,21 -> 503,23 -> 505,23 -> 505,18 -> 505,23
528,68 -> 528,59 -> 528,68 -> 530,68 -> 530,63 -> 530,68 -> 532,68 -> 532,64 -> 532,68 -> 534,68 -> 534,66 -> 534,68 -> 536,68 -> 536,60 -> 536,68
524,55 -> 524,46 -> 524,55 -> 526,55 -> 526,45 -> 526,55 -> 528,55 -> 528,47 -> 528,55 -> 530,55 -> 530,46 -> 530,55 -> 532,55 -> 532,48 -> 532,55
493,23 -> 493,13 -> 493,23 -> 495,23 -> 495,19 -> 495,23 -> 497,23 -> 497,15 -> 497,23 -> 499,23 -> 499,14 -> 499,23 -> 501,23 -> 501,14 -> 501,23 -> 503,23 -> 503,21 -> 503,23 -> 505,23 -> 505,18 -> 505,23
525,112 -> 530,112
527,96 -> 527,98 -> 525,98 -> 525,106 -> 536,106 -> 536,98 -> 530,98 -> 530,96
524,55 -> 524,46 -> 524,55 -> 526,55 -> 526,45 -> 526,55 -> 528,55 -> 528,47 -> 528,55 -> 530,55 -> 530,46 -> 530,55 -> 532,55 -> 532,48 -> 532,55
537,121 -> 542,121
494,159 -> 499,159
513,124 -> 513,126 -> 510,126 -> 510,134 -> 524,134 -> 524,126 -> 518,126 -> 518,124
509,121 -> 514,121
493,23 -> 493,13 -> 493,23 -> 495,23 -> 495,19 -> 495,23 -> 497,23 -> 497,15 -> 497,23 -> 499,23 -> 499,14 -> 499,23 -> 501,23 -> 501,14 -> 501,23 -> 503,23 -> 503,21 -> 503,23 -> 505,23 -> 505,18 -> 505,23
528,68 -> 528,59 -> 528,68 -> 530,68 -> 530,63 -> 530,68 -> 532,68 -> 532,64 -> 532,68 -> 534,68 -> 534,66 -> 534,68 -> 536,68 -> 536,60 -> 536,68
493,23 -> 493,13 -> 493,23 -> 495,23 -> 495,19 -> 495,23 -> 497,23 -> 497,15 -> 497,23 -> 499,23 -> 499,14 -> 499,23 -> 501,23 -> 501,14 -> 501,23 -> 503,23 -> 503,21 -> 503,23 -> 505,23 -> 505,18 -> 505,23
537,85 -> 537,77 -> 537,85 -> 539,85 -> 539,76 -> 539,85 -> 541,85 -> 541,75 -> 541,85
528,88 -> 528,89 -> 542,89 -> 542,88
498,140 -> 498,142 -> 497,142 -> 497,150 -> 507,150 -> 507,142 -> 502,142 -> 502,140
524,55 -> 524,46 -> 524,55 -> 526,55 -> 526,45 -> 526,55 -> 528,55 -> 528,47 -> 528,55 -> 530,55 -> 530,46 -> 530,55 -> 532,55 -> 532,48 -> 532,55
524,55 -> 524,46 -> 524,55 -> 526,55 -> 526,45 -> 526,55 -> 528,55 -> 528,47 -> 528,55 -> 530,55 -> 530,46 -> 530,55 -> 532,55 -> 532,48 -> 532,55
513,124 -> 513,126 -> 510,126 -> 510,134 -> 524,134 -> 524,126 -> 518,126 -> 518,124
529,71 -> 529,72 -> 539,72 -> 539,71
524,55 -> 524,46 -> 524,55 -> 526,55 -> 526,45 -> 526,55 -> 528,55 -> 528,47 -> 528,55 -> 530,55 -> 530,46 -> 530,55 -> 532,55 -> 532,48 -> 532,55
505,26 -> 505,28 -> 500,28 -> 500,31 -> 513,31 -> 513,28 -> 509,28 -> 509,26
505,162 -> 510,162
523,121 -> 528,121
493,176 -> 498,176
493,23 -> 493,13 -> 493,23 -> 495,23 -> 495,19 -> 495,23 -> 497,23 -> 497,15 -> 497,23 -> 499,23 -> 499,14 -> 499,23 -> 501,23 -> 501,14 -> 501,23 -> 503,23 -> 503,21 -> 503,23 -> 505,23 -> 505,18 -> 505,23
501,159 -> 506,159
478,172 -> 483,172
524,55 -> 524,46 -> 524,55 -> 526,55 -> 526,45 -> 526,55 -> 528,55 -> 528,47 -> 528,55 -> 530,55 -> 530,46 -> 530,55 -> 532,55 -> 532,48 -> 532,55
524,55 -> 524,46 -> 524,55 -> 526,55 -> 526,45 -> 526,55 -> 528,55 -> 528,47 -> 528,55 -> 530,55 -> 530,46 -> 530,55 -> 532,55 -> 532,48 -> 532,55
527,96 -> 527,98 -> 525,98 -> 525,106 -> 536,106 -> 536,98 -> 530,98 -> 530,96
498,140 -> 498,142 -> 497,142 -> 497,150 -> 507,150 -> 507,142 -> 502,142 -> 502,140
497,156 -> 502,156
521,109 -> 526,109
518,112 -> 523,112
518,42 -> 522,42
505,26 -> 505,28 -> 500,28 -> 500,31 -> 513,31 -> 513,28 -> 509,28 -> 509,26
519,92 -> 519,93 -> 528,93
522,115 -> 527,115
505,26 -> 505,28 -> 500,28 -> 500,31 -> 513,31 -> 513,28 -> 509,28 -> 509,26
493,23 -> 493,13 -> 493,23 -> 495,23 -> 495,19 -> 495,23 -> 497,23 -> 497,15 -> 497,23 -> 499,23 -> 499,14 -> 499,23 -> 501,23 -> 501,14 -> 501,23 -> 503,23 -> 503,21 -> 503,23 -> 505,23 -> 505,18 -> 505,23
512,42 -> 516,42
537,85 -> 537,77 -> 537,85 -> 539,85 -> 539,76 -> 539,85 -> 541,85 -> 541,75 -> 541,85
513,124 -> 513,126 -> 510,126 -> 510,134 -> 524,134 -> 524,126 -> 518,126 -> 518,124
493,23 -> 493,13 -> 493,23 -> 495,23 -> 495,19 -> 495,23 -> 497,23 -> 497,15 -> 497,23 -> 499,23 -> 499,14 -> 499,23 -> 501,23 -> 501,14 -> 501,23 -> 503,23 -> 503,21 -> 503,23 -> 505,23 -> 505,18 -> 505,23
498,140 -> 498,142 -> 497,142 -> 497,150 -> 507,150 -> 507,142 -> 502,142 -> 502,140
482,174 -> 487,174
493,23 -> 493,13 -> 493,23 -> 495,23 -> 495,19 -> 495,23 -> 497,23 -> 497,15 -> 497,23 -> 499,23 -> 499,14 -> 499,23 -> 501,23 -> 501,14 -> 501,23 -> 503,23 -> 503,21 -> 503,23 -> 505,23 -> 505,18 -> 505,23
537,85 -> 537,77 -> 537,85 -> 539,85 -> 539,76 -> 539,85 -> 541,85 -> 541,75 -> 541,85
493,23 -> 493,13 -> 493,23 -> 495,23 -> 495,19 -> 495,23 -> 497,23 -> 497,15 -> 497,23 -> 499,23 -> 499,14 -> 499,23 -> 501,23 -> 501,14 -> 501,23 -> 503,23 -> 503,21 -> 503,23 -> 505,23 -> 505,18 -> 505,23
479,176 -> 484,176
486,176 -> 491,176
498,140 -> 498,142 -> 497,142 -> 497,150 -> 507,150 -> 507,142 -> 502,142 -> 502,140
481,170 -> 486,170
513,124 -> 513,126 -> 510,126 -> 510,134 -> 524,134 -> 524,126 -> 518,126 -> 518,124
493,23 -> 493,13 -> 493,23 -> 495,23 -> 495,19 -> 495,23 -> 497,23 -> 497,15 -> 497,23 -> 499,23 -> 499,14 -> 499,23 -> 501,23 -> 501,14 -> 501,23 -> 503,23 -> 503,21 -> 503,23 -> 505,23 -> 505,18 -> 505,23
515,36 -> 519,36
512,38 -> 516,38
498,140 -> 498,142 -> 497,142 -> 497,150 -> 507,150 -> 507,142 -> 502,142 -> 502,140
528,88 -> 528,89 -> 542,89 -> 542,88
537,85 -> 537,77 -> 537,85 -> 539,85 -> 539,76 -> 539,85 -> 541,85 -> 541,75 -> 541,85
498,162 -> 503,162
524,55 -> 524,46 -> 524,55 -> 526,55 -> 526,45 -> 526,55 -> 528,55 -> 528,47 -> 528,55 -> 530,55 -> 530,46 -> 530,55 -> 532,55 -> 532,48 -> 532,55
513,124 -> 513,126 -> 510,126 -> 510,134 -> 524,134 -> 524,126 -> 518,126 -> 518,124
505,26 -> 505,28 -> 500,28 -> 500,31 -> 513,31 -> 513,28 -> 509,28 -> 509,26
515,115 -> 520,115
509,165 -> 514,165
528,68 -> 528,59 -> 528,68 -> 530,68 -> 530,63 -> 530,68 -> 532,68 -> 532,64 -> 532,68 -> 534,68 -> 534,66 -> 534,68 -> 536,68 -> 536,60 -> 536,68
528,68 -> 528,59 -> 528,68 -> 530,68 -> 530,63 -> 530,68 -> 532,68 -> 532,64 -> 532,68 -> 534,68 -> 534,66 -> 534,68 -> 536,68 -> 536,60 -> 536,68
518,38 -> 522,38
509,36 -> 513,36
528,88 -> 528,89 -> 542,89 -> 542,88
528,68 -> 528,59 -> 528,68 -> 530,68 -> 530,63 -> 530,68 -> 532,68 -> 532,64 -> 532,68 -> 534,68 -> 534,66 -> 534,68 -> 536,68 -> 536,60 -> 536,68
524,55 -> 524,46 -> 524,55 -> 526,55 -> 526,45 -> 526,55 -> 528,55 -> 528,47 -> 528,55 -> 530,55 -> 530,46 -> 530,55 -> 532,55 -> 532,48 -> 532,55
506,38 -> 510,38
526,118 -> 531,118
519,92 -> 519,93 -> 528,93
527,96 -> 527,98 -> 525,98 -> 525,106 -> 536,106 -> 536,98 -> 530,98 -> 530,96
505,26 -> 505,28 -> 500,28 -> 500,31 -> 513,31 -> 513,28 -> 509,28 -> 509,26
488,170 -> 493,170
530,121 -> 535,121
528,68 -> 528,59 -> 528,68 -> 530,68 -> 530,63 -> 530,68 -> 532,68 -> 532,64 -> 532,68 -> 534,68 -> 534,66 -> 534,68 -> 536,68 -> 536,60 -> 536,68
493,23 -> 493,13 -> 493,23 -> 495,23 -> 495,19 -> 495,23 -> 497,23 -> 497,15 -> 497,23 -> 499,23 -> 499,14 -> 499,23 -> 501,23 -> 501,14 -> 501,23 -> 503,23 -> 503,21 -> 503,23 -> 505,23 -> 505,18 -> 505,23
493,23 -> 493,13 -> 493,23 -> 495,23 -> 495,19 -> 495,23 -> 497,23 -> 497,15 -> 497,23 -> 499,23 -> 499,14 -> 499,23 -> 501,23 -> 501,14 -> 501,23 -> 503,23 -> 503,21 -> 503,23 -> 505,23 -> 505,18 -> 505,23
528,68 -> 528,59 -> 528,68 -> 530,68 -> 530,63 -> 530,68 -> 532,68 -> 532,64 -> 532,68 -> 534,68 -> 534,66 -> 534,68 -> 536,68 -> 536,60 -> 536,68
524,55 -> 524,46 -> 524,55 -> 526,55 -> 526,45 -> 526,55 -> 528,55 -> 528,47 -> 528,55 -> 530,55 -> 530,46 -> 530,55 -> 532,55 -> 532,48 -> 532,55
493,23 -> 493,13 -> 493,23 -> 495,23 -> 495,19 -> 495,23 -> 497,23 -> 497,15 -> 497,23 -> 499,23 -> 499,14 -> 499,23 -> 501,23 -> 501,14 -> 501,23 -> 503,23 -> 503,21 -> 503,23 -> 505,23 -> 505,18 -> 505,23
527,96 -> 527,98 -> 525,98 -> 525,106 -> 536,106 -> 536,98 -> 530,98 -> 530,96`;

const board = constructBoard(input);

// for part 2, all we do is add an infinite
// floor.
const [minI, maxI, minJ, maxJ] = board.bounds();
for (let i=0; i<=1000; i++) {
  board.set(i, maxJ + 2, "#");
}

function addSand(board) {
  if (board.blocked(500, 0)) return false;
  let pos = [500, 0], settled = false;
  while (!settled) {
    // if (board.void(...pos)) {
      // for part 2, there should be no void:
    //   throw new Error(`${pos[0]},${pos[1]}`);
    //   return false;
    // }
    settled = true;
    for (const newPos of [
      down(pos),
      left(down(pos)), 
      right(down(pos))
    ]) {
      if (!board.blocked(...newPos)) {
        pos = newPos;
        settled = false;
        break;
      }
    }
  }
  board.set(...pos, "o");
  console.log(pos);
  return true;
}

// let count = 0;
// while (addSand(board)) {
//   count++;
//   // console.log(board.stringify(490, 510, 0, 10));
//   console.log(count);
// }

console.log(board.stringify(400, 600, 0, 100))
