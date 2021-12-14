// concerning game play
var gamePlay = {
  animation_interval : 30,
  last_animation_time : 0,
  lastTargetAppearanceTime : 0,
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
    this.lastTargetAppearanceTime = -this.objStage.targetInterval;
    requestAnimationFrame(tick);
  }
}

function _objStage(stageNum) {
  this.totalTargetCnt = 10 * stageNum;
  this.targetInterval = 20;
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
    gamePlay.last_animation_time = timeStamp;;
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
  } else {
  }
}

function handleOrientation(event) {
  //let alpha = event.alpha;
  //let beta = event.beta;
  //let gamma = event.gamma;
  //gamma = prune(gamma, -1, 1);
  //gameObjects.car.accel.v1 = gamma;
}

function checkStageCleared() {
  let ret = false;
  if (gamePlay.objStage.totalTargetCnt == 0 &&
      gameObjects.mainChainFirst.next == gameObjects.mainChainLast) {
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
  const gap = gamePlay.last_animation_time - gamePlay.lastTargetAppearanceTime;
  if (gamePlay.objStage.totalTargetCnt > 0 && gap >= gamePlay.objStage.targetInterval) {
    gamePlay.objStage.totalTargetCnt--;
    gamePlay.lastBallTimeStamp = gamePlay.last_animation_time;
    gameObjects.push_to_chain(new objBubble());
  } 
}

function collision_check() {
  if (user_pressing) {
    // check collision of clicked(touched) position and balls
    gameObjects.oTouch = new objTouch(user_x, user_y);
    let oCatched = collisionWithChain(gameObjects.oTouch, gameObjects.mainChainFirst);
    if (oCatched != null) {
      gameObjects.remove_from_chain(oCatched);
      gamePlay.score += 10;
      TTS.speech(oCatched.hanguel);
      try {
        chkAndUnlockAchievement(gamePlay.score);
      } catch(err) {}
      try {
        navigator.vibrate(150);
      } catch(err) {}
    }
  }
}

function collisionWithChain(obj, chainFirst) {
  var ret = null;
  var t = chainFirst.next;
  while(t.next != null) {
    if (t.collision_chk(obj)) {
      ret = t;
      break;
    }
    t = t.next;            
  }

  return ret;
}
