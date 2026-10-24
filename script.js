"use strict";


// ========================================
// 1. ゲーム基本設定
// ========================================

const DAY_START_MINUTE = 7 * 60;
const DAY_END_MINUTE = 22 * 60;


// 現実1秒ごとに何ゲーム分進めるか。
// speed=1なら2分進む。
const MINUTES_PER_TICK = 2;


// ========================================
// 2. ゲーム状態
// ========================================

const gameState = {

  version: 1,

  time: {
    year: 1,

    month: 4,
    day: 1,

    weekdayIndex: 0,

    currentMinute:
      DAY_START_MINUTE,

    speed: 1
  },

  weather: {
    id: "sunny",
    name: "晴れ"
  },

  currentScreen:
    "station"
};


// ========================================
// 3. 曜日
// ========================================

const WEEKDAYS = [
  "月曜日",
  "火曜日",
  "水曜日",
  "木曜日",
  "金曜日",
  "土曜日",
  "日曜日"
];


// ========================================
// 4. 仮の列車時刻表
// ========================================

const timetable = [
  7 * 60 + 15,
  7 * 60 + 35,
  8 * 60 + 5,

  10 * 60 + 30,
  12 * 60 + 15,
  14 * 60 + 10,

  17 * 60 + 40,
  18 * 60 + 45,
  20 * 60 + 10,

  21 * 60 + 30
];


// ========================================
// 5. DOM取得
// ========================================

const dateText =
  document.getElementById("dateText");

const weekdayText =
  document.getElementById("weekdayText");

const timeText =
  document.getElementById("timeText");

const weatherText =
  document.getElementById("weatherText");

const nextTrainText =
  document.getElementById("nextTrainText");


const speedButtons =
  document.querySelectorAll(
    ".speed-button"
  );


const navButtons =
  document.querySelectorAll(
    ".nav-button"
  );


const gameScreens =
  document.querySelectorAll(
    ".game-screen"
  );


// ========================================
// 6. 時刻表示
// ========================================

function formatTime(totalMinutes) {

  const hour =
    Math.floor(
      totalMinutes / 60
    );

  const minute =
    totalMinutes % 60;

  return (
    String(hour).padStart(2, "0") +
    ":" +
    String(minute).padStart(2, "0")
  );
}


// ========================================
// 7. 次の列車
// ========================================

function getNextTrainTime() {

  const now =
    gameState.time.currentMinute;

  const nextTrain =
    timetable.find(
      time => time >= now
    );

  return nextTrain ?? null;
}


function updateNextTrain() {

  const nextTrain =
    getNextTrainTime();

  if (nextTrain === null) {

    nextTrainText.textContent =
      "本日終了";

    return;
  }

  nextTrainText.textContent =
    formatTime(nextTrain);
}


// ========================================
// 8. 画面表示更新
// ========================================

function updateDisplay() {

  dateText.textContent =
    `${gameState.time.month}月${gameState.time.day}日`;


  weekdayText.textContent =
    WEEKDAYS[
      gameState.time.weekdayIndex
    ];


  timeText.textContent =
    formatTime(
      gameState.time.currentMinute
    );


  weatherText.textContent =
    gameState.weather.name;


  updateNextTrain();
}


// ========================================
// 9. 時計処理
// ========================================

function advanceTime() {

  const amount =
    MINUTES_PER_TICK *
    gameState.time.speed;


  gameState.time.currentMinute +=
    amount;


  // 22:00を超えないようにする
  if (
    gameState.time.currentMinute >=
    DAY_END_MINUTE
  ) {

    gameState.time.currentMinute =
      DAY_END_MINUTE;
  }


  updateDisplay();
}


// ========================================
// 10. 時間速度
// ========================================

function setSpeed(speed) {

  gameState.time.speed =
    speed;


  speedButtons.forEach(
    button => {

      const buttonSpeed =
        Number(
          button.dataset.speed
        );


      button.classList.toggle(
        "active",
        buttonSpeed === speed
      );

    }
  );
}


speedButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        const speed =
          Number(
            button.dataset.speed
          );

        setSpeed(speed);

      }
    );

  }
);


// ========================================
// 11. タブ切り替え
// ========================================

function changeScreen(screenName) {

  gameState.currentScreen =
    screenName;


  gameScreens.forEach(
    screen => {

      screen.classList.remove(
        "active"
      );

    }
  );


  navButtons.forEach(
    button => {

      button.classList.remove(
        "active"
      );

    }
  );


  const targetScreen =
    document.getElementById(
      `screen-${screenName}`
    );


  if (targetScreen) {

    targetScreen.classList.add(
      "active"
    );

  }


  const targetButton =
    document.querySelector(
      `[data-screen="${screenName}"]`
    );


  if (targetButton) {

    targetButton.classList.add(
      "active"
    );

  }

}


navButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        changeScreen(
          button.dataset.screen
        );

      }
    );

  }
);


// ========================================
// 12. ゲームループ
// ========================================

let gameTimer = null;


function startGameClock() {

  if (gameTimer !== null) {
    clearInterval(gameTimer);
  }


  gameTimer =
    setInterval(
      () => {

        if (
          gameState.time.currentMinute >=
          DAY_END_MINUTE
        ) {
          return;
        }

        advanceTime();

      },
      1000
    );
}


// ========================================
// 13. 初期化
// ========================================

function initializeGame() {

  updateDisplay();

  setSpeed(1);

  changeScreen(
    "station"
  );

  startGameClock();

}


initializeGame();