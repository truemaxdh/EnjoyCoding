// concerning game play
var gamePlay = {
  animation_interval : 30,
  last_animation_time : 0,
  pause : true,
  gameover_flag : false,
  effect_flag : false,
  score : 0,
  stageNum : 0,
  max_stage : 10,
  objStage : null,
  init : function() {
    this.pause = true;
    this.gameover_flag = false;
    this.effect_flag = false;
    this.score = 0;
    this.last_animation_time = 0;
    this.setStage(this.stageNum);
  },
  setStage : function(stageNum) {
    this.stageNum = stageNum;
    this.objStage = new _objStage(stageNum);
  },
  startStage : function() {
    this.pause = false;
    requestAnimationFrame(tick);
  }
}

function _objStage(stageNum) {
}


function newGame() {
  gameCanvas.init();
  init_user_input();
  gamePlay.init();
  gameObjects.init();
  gamePlay.startStage();
}

function tick(timeStamp) {
  if ((timeStamp - gamePlay.last_animation_time) > gamePlay.animation_interval) {
    gamePlay.last_animation_time = timeStamp;
    gameObjects.move();
    gameCanvas.render();
    if (gamePlay.gameover_flag) {
      gameOver();
    } else {
      proc_user_input();
      if (gamePlay.effect_flag || checkStageCleared()) {
        gameObjects.stageClear.render();
      } else {
        upcoming_obj();
        collision_check();
      }
    }
  }
  if (!gamePlay.pause) {
    requestAnimationFrame(tick);
  }
}

function gameOver() {
  gamePlay.gameover_flag = true;
  oageObjects.gameOver.render();
}

function proc_user_input() {
  if (user_pressing) {
    if (user_x > gameObjects.car.center.v1) {
      gameObjects.car.accel.v1 = 1;
    }
    else if (user_x < gameObjects.car.center.v1) {
      gameObjects.car.accel.v1 = -1;
    }
  } else {
  }
}

function handleOrientation(event) {
  //let alpha = event.alpha;
  //let beta = event.beta;
  let gamma = event.gamma;
  gamma = prune(gamma, -1, 1);
  gameObjects.car.accel.v1 = gamma;
}

function checkStageCleared() {
  let ret = false;
  if (gameObjects.road.runningLength >= gameObjects.road.length) {
    stageCleared();
    ret = true;
  }
  return ret;
}

function stageCleared() {
  chkAndUnlockStage(gamePlay.stageNum);
  gamePlay.effect_flag = true;
  gameObjects.stageClear = new objStageClear(gamePlay.stageNum);
  gamePlay.setStage(gamePlay.stageNum + 1);
}

function upcoming_obj() {
  
}

function collision_check() {
  gameObjects.car.collision_chk(gameObjects.carAI);
  gameObjects.road.collision_chk(gameObjects.car);
  gameObjects.road.collision_chk(gameObjects.carAI);
}
