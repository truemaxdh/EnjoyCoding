// Sound Play
var sounds = []; // sounds
var cnt = 0;
for (var i = 0; i < 5; i++) {
  for (var j = 0; j < 4; j++) {
    sounds[cnt] = new Audio('sound/fire' + j + '.mp3');
    sounds[cnt++].volume = 0.3;
  }
}
  
function playSound(soundID)
{
  if (soundSettings.sound == "on") {
    try {
      sounds[soundID].currentTime = 0;
      sounds[soundID].play();
    } catch(err) {
      console.log(err);
    }
  }
}

// BGM Play
var curBgmId = 0;
var bgms = [new Audio('sound/recollection.mp3'), new Audio('sound/LightOfNight.mp3')]; // BGMs
for (var i = 0; i < bgms.length; i++) {
  bgms[i].onended = function() {
    if (++curBgmId >= bgms.length)
      curBgmId = 0;
    bgms[curBgmId].currentTime = 0;
    bgms[curBgmId].play();
  }
}

function playBGM() {
  bgms[curBgmId].play();
}

function pauseBGM() {
  bgms[curBgmId].pause();
}

// Sound Setting
var soundSettings = {
  bgm : 'off',
  sound : 'off'
}
