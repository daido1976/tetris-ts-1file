const BLOCK_SIZE = 24; // 1ブロックのサイズ
const BLOCK_COLS = 10; // ステージの幅
const BLOCK_ROWS = 20; // ステージの高さ
const SCREEN_WIDTH = BLOCK_SIZE * BLOCK_COLS; // スクリーンの幅
const SCREEN_HEIGHT = BLOCK_SIZE * BLOCK_ROWS; // スクリーンの高さ

const canvas = <HTMLCanvasElement>document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

const TETRO_TYPES = [
  [
    [0, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
];

// テトロ本体
let tetro = TETRO_TYPES[Math.floor(Math.random() * TETRO_TYPES.length)];
// テトロの座標（x はいいけど、y が増えるたびに下方向にいくのが気持ち悪い）
let tetroX = 0;
let tetroY = 0;

let stage = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const drawTetro = () => {
  tetro.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 1) {
        let px = (tetroX + x) * BLOCK_SIZE;
        let py = (tetroY + y) * BLOCK_SIZE;
        ctx.fillStyle = "green";
        ctx.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeStyle = "black";
        ctx.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
      }
    });
  });
};

const drawStage = () => {
  stage.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 1) {
        let px = x * BLOCK_SIZE;
        let py = y * BLOCK_SIZE;
        ctx.fillStyle = "green";
        ctx.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeStyle = "black";
        ctx.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
      }
    });
  });
};

// 一つ前のテトロをクリアする
const clearTetro = () => {
  ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
};

const drawAll = () => {
  clearTetro();
  drawStage();
  drawTetro();
};

const rotate = (): number[][] => {
  let newTetro: number[][] = [];
  tetro.forEach((row, y) => {
    newTetro[y] = [];
    row.forEach((_cell, x) => {
      newTetro[y][x] = tetro[3 - x][y];
    });
  });
  return newTetro;
};

const canMove = (dx: number, dy: number, newTetro = tetro): boolean => {
  let result = true;
  newTetro.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 1) {
        let newX = tetroX + dx + x;
        let newY = tetroY + dy + y;
        if (
          newX < 0 ||
          newY < 0 ||
          newX >= BLOCK_COLS ||
          newY >= BLOCK_ROWS ||
          stage[newY][newX] === 1
        ) {
          result = false;
        }
      }
    });
  });
  return result;
};

const handleKeydown = (e: KeyboardEvent) => {
  switch (e.code) {
    case "ArrowLeft":
      if (canMove(-1, 0)) {
        tetroX--;
      }
      break;
    case "ArrowRight":
      if (canMove(1, 0)) {
        tetroX++;
      }
      break;
    case "ArrowDown":
      if (canMove(0, 1)) {
        tetroY++;
      }
      break;
    case "Space":
      let newTetro = rotate();
      if (canMove(0, 0, newTetro)) {
        tetro = newTetro;
      }
      break;
    default:
      break;
  }
  drawAll();
};

// テトロの固定
const fixTetro = () => {
  tetro.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 1) {
        stage[tetroY + y][tetroX + x] = 1;
      }
    });
  });
};

// ラインが揃ったかどうかをチェックして揃ってたら消す
const checkAndDeleteLine = () => {
  stage.forEach((row, y) => {
    // 削除対象の row かどうかをチェックしている、0 が一つでもあれば削除対象ではない
    if (!row.some((cell) => cell === 0)) {
      // 削除対象の row(の y) から逆に回しつつ、一つ上の y の cell を代入している
      // ここ for 使わずに書きたい
      for (let ny = y; ny > 0; ny--) {
        for (let nx = 0; nx < BLOCK_COLS; nx++) {
          stage[ny][nx] = stage[ny - 1][nx];
        }
      }
    }
  });
};

// テトロの初期化(新しいテトロ作って落とすため)
const resetTetro = () => {
  tetro = TETRO_TYPES[Math.floor(Math.random() * TETRO_TYPES.length)];
  tetroX = 0;
  tetroY = 0;
};

// テトロの落下
const dropTetro = () => {
  if (canMove(0, 1)) {
    tetroY++;
  } else {
    // 動かせなければ以下を行う
    // 1. テトロを固定
    // 2. ラインが揃ってたら消す
    // 3. テトロの初期化(新しいテトロ作って落とすため)
    fixTetro();
    checkAndDeleteLine();
    resetTetro();
  }
  drawAll();
};

const initialize = () => {
  window.addEventListener("keydown", handleKeydown);
  drawAll();
  setInterval(dropTetro, 300);
};

initialize();
