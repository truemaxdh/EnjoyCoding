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
  console.log(gameObjects.isBallEmpty());
  document.getElementById( 'bgm' ).play();
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
  } else {
  }
}

function upcoming_obj() {
  if (gamePlay.objStage.totalBallCnt > 0 && (gamePlay.last_animation_time - gamePlay.lastBallTimeStamp) >= gamePlay.objStage.ballInterval) {
    gamePlay.objStage.totalBallCnt--;
    gamePlay.lastBallTimeStamp = gamePlay.last_animation_time;
    push_to_chain(new objBall(360, 100, gamePlay.objStage.ballSize), gameObjects.ballEnds);
  } else if (gamePlay.stageNum < gamePlay.max_stage && gameObjects.isBallEmpty()) {
    stageCleared();
  }
}

function stageCleared() {
  chkAndUnlockStage(gamePlay.stageNum);
  gamePlay.effect_flag = true;
  push_to_chain(new objStageClear(gamePlay.stageNum), gameObjects.ballEnds);
  gamePlay.setStage(gamePlay.stageNum + 1);
}

function collision_check() {
  if (user_pressing) {
    // check collision of clicked(touched) position and balls
    gameObjects.oTouch = new objTouch(user_x, user_y);
    let oCatched = collision_obj_grp(gameObjects.oTouch, gameObjects.ballEnds);;
    if (oCatched != null) {
      remove_from_chain(oCatched);
      if (--oCatched.size > 0) {
        let new1 = new objBall(oCatched.center.v1, oCatched.center.v2, oCatched.size);
        let new2 = new objBall(oCatched.center.v1, oCatched.center.v2, oCatched.size);
        new1.speed.v2 = Math.random() * oCatched.speed.v2;
        new2.speed.v2 = Math.random() * oCatched.speed.v2;
        push_to_chain(new1, gameObjects.ballEnds);
        push_to_chain(new2, gameObjects.ballEnds);
      } else {
        gamePlay.eliminatedBallCnt++;
      }
      gamePlay.score += 10;
      try {
        chkAndUnlockAchievement(gamePlay.score);
      } catch(err) {}
    }
  }
}

function push_to_chain(obj, ends) {
  ends[1].prev.next = obj;
  obj.prev = ends[1].prev;
  obj.next = ends[1];
  ends[1].prev = obj;
}

function remove_from_chain(obj) {
  obj.prev.next = obj.next;
  obj.next.prev = obj.prev;
}

function collision_obj_grp(obj, ends) {
  var ret = null;
  var t = ends[0].next;
  while(t.next != null) {
    if (t.collision_chk(obj)) {
      ret = t;
      break;
    }
    t = t.next;            
  }

  return ret;
}
