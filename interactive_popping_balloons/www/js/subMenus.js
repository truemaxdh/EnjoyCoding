function showSubMenu() {
  if (curPage == 'game') {
    gamePlay.pause = true;
    pauseBGM();
  }
  document.getElementById("Submenu").style.left = "0";
}

function hideSubMenu() {
  document.getElementById("Submenu").style.left = "-100%";
  gamePlay.pause = false;
  if (curPage == 'game') {
    playBGM();
    gamePlay.last_animation_time = 0;
    requestAnimationFrame(tick);
  }
}
  
function ExitApp() {
  pauseBGM();
  soundSettings.sound = "off";
  soundSettings.bgm = "off";
  Android.exitApp();
}

function BgmOnOff() {
  var el = document.getElementById("bgmOnOff");
  //console.log(el.innerHTML);
  if (el.innerHTML == "Background Music: Off") {
    el.innerHTML = "Background Music: On";
    soundSettings.bgm = "on";
  } else {
    el.innerHTML = "Background Music: Off";
    soundSettings.bgm = "off";
  }
}

function soundEffectOnOff() {
  var el = document.getElementById("soundEffectOnOff");
  //console.log(el.innerHTML);
  if (el.innerHTML == "Sound Effect: Off") {
    el.innerHTML = "Sound Effect: On";
    soundSettings.sound = "on";
  } else {
    el.innerHTML = "Sound Effect: Off";
    soundSettings.sound = "off";
  }
}

function goToStage(_stage) {
  document.getElementById('StageMap').style.left='-100%';
  gamePlay.setStage(_stage);
  pageChange('game');
}

function openStageMap() {
  let maxStage = 10;
  try {
    if (!localStorage.getItem(stageStoreName))
      localStorage.setItem(stageStoreName, 0);
    maxStage = Number(localStorage.getItem(stageStoreName)) + 1;
  } catch(err) {}
  for(let i = 1; i <= maxStage; i++) {
    document.getElementById('btnL' + i).disabled = false;
  }
  document.getElementById('StageMap').style.left='0';
}

function OpenUserResult() {
  document.getElementById("user_result").style.width = "100%";
}

function  CloseUserResult() {
  document.getElementById("user_result").style.width = "0%";
  setTimeout(function() {
    pageChange('menu');
    document.location.href = "index.html";
  }, 500);
}
