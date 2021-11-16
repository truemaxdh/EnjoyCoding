// concerning game play
var gamePlay = {
  animation_interval : 30,
  last_animation_time : 0,
  pause : true,
  gameover_flag : false,
  effect_flag : false,
  score : 0,
  lastBallTimeStamp : 0,
  stageNum : 0,
  max_stage : 10,
  o_game_over : null,
  eliminatedBallCnt : 0,
  objStage : null,
  init : function() {
    this.pause = true;
    this.gameover_flag = false;
    this.effect_flag = false;
    this.score = 0;
    this.eliminatedBallCnt = 0;
    this.o_game_over = null;
    this.last_animation_time = 0;
    this.setStage(this.stageNum);
    this.lastBallTimeStamp = -this.objStage.ballInterval;
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
  this.totalBallCnt = stageNum;
  this.ballInterval = 10000;
  this.ballSize = 5;
}


function newGame() {
  gameCanvas.init();
  init_user_input();
  gamePlay.init();
  gameObjects.init();
  //document.getElementById( 'bgm' ).play();
  gamePlay.startStage();
}

function tick(timeStamp) {
  if ((timeStamp - gamePlay.last_animation_time) > gamePlay.animation_interval) {
    gamePlay.last_animation_time = timeStamp;
    gameObjects.move();
    if (!gamePlay.effect_flag) {
      upcoming_obj();
    }
    gameCanvas.render();

    if (gamePlay.gameover_flag) {
      gameOver();
    } else {
      proc_user_input();
      if (!gamePlay.effect_flag) {
        collision_check();
      }
    }
  }
  if (!gamePlay.pause) {
    requestAnimationFrame(tick);
  }
}

function gameOver() {
  if (o_game_over == null) {
    gamePlay.gameover_flag = true;
    o_game_over = new objGameOver();
    o_jet.game_over();
  } else if (o_game_over.count_down-- == 0) {
    document.getElementById( 'bgm' ).pause();
    gamePlay.pause = true;        
    if (isApp && glGameSvc.loginStatus) {
      try {  
        Android.submitScore(glGameSvc.leaderboardId, score);
      } catch(e) {
        Android.showToast("submitScoe failed.");
      }

    }
    OpenUserResult();
    document.getElementById('user_score').innerHTML = score;
  }
  o_game_over.render(ctx_game);
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

function upcoming_obj() {
  
}

function stageCleared() {
  chkAndUnlockStage(gamePlay.stageNum);
  gamePlay.effect_flag = true;
  push_to_chain(new objStageClear(gamePlay.stageNum), gameObjects.ballEnds);
  gamePlay.setStage(gamePlay.stageNum + 1);
}

function collision_check() {
  gameObjects.road.collision_chk(gameObjects.car);
  gameObjects.road.collision_chk(gameObjects.carAI);
}
