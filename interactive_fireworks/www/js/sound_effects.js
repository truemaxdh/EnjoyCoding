// Sound Play
var sounds = []; // sounds
var cnt = 0;
for (var i = 0; i < 5; i++) {
  for (var j = 0; j < 4; j++) {
    //sounds[cnt] = new Audio('sound/fire' + j + '.mp3');
    //sounds[cnt++].volume = 0.3;
    var audio = new Audio();
    audio.src = 'sound/fire' + j + '.mp3';
    audio.preload = "auto";
    audio.volume = 0.3;
    sounds.push(audio);
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
var bgmPaths = [
  'sound/recollection.mp3', 
  'sound/LightOfNight.mp3', 
  'sound/LongLastingMemories.mp3',
  'sound/MemoriesAFewYearsAgo.mp3']; // BGM Paths

// Shuffle
for (var i = 0; i < bgmPaths.length; i++) {
  var rnd0 = parseInt(Math.random() * bgmPaths.length);
  var rnd1 = parseInt(Math.random() * bgmPaths.length);
  [bgmPaths[rnd0], bgmPaths[rnd1]] = [bgmPaths[rnd1], bgmPaths[rnd0]];
}

var bgms = [];
for (var i = 0; i < bgmPaths.length; i++) {
  var audio = new Audio();
  audio.src = bgmPaths[i];
  audio.preload = "auto";
  bgms.push(audio);
}


// Continuous playback
//for (var i = 0; i < bgms.length; i++) {
  //bgms[i].onended = function() {
  bgms[0].onended = function() {
    try {
      if (++curBgmId >= bgms.length)
        curBgmId = 0;
      /*toast("" + bgms[curBgmId].readyState);
      bgms[curBgmId].currentTime = 0;
      bgms[curBgmId].play();*/
      bgms[0].src = bgmPaths[curBgmId];
      bgms[0].oncanplaythrough = function() {
        playBGM();    
      }
    } catch(e) {
      toast(e.message);    
    }
  }
//}

function playBGM() {
  try {
    //bgms[curBgmId].play();
    bgms[0].play();
  } catch(e) {
    toast(e.message);    
  }
}

function pauseBGM() {
  //bgms[curBgmId].pause();
  bgms[0].pause();
}

// Sound Setting
var soundSettings = {
  bgm : 'off',
  sound : 'off'
}
