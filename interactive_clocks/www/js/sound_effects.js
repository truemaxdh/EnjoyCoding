// Sound Play
var sounds = []; // sounds
var cnt = 0;
// for (var i = 0; i < 5; i++) {
//   for (var j = 0; j < 4; j++) {
//     var audio = new Audio();
//     audio.src = 'sound/fire' + j + '.mp3';
//     audio.preload = "auto";
//     audio.volume = 0.3;
//     sounds.push(audio);
//   }
// }
  
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
var bgmPaths = []; // BGM Paths

// Shuffle
for (var i = 0; i < bgmPaths.length; i++) {
  var rnd0 = parseInt(Math.random() * bgmPaths.length);
  var rnd1 = parseInt(Math.random() * bgmPaths.length);
  [bgmPaths[rnd0], bgmPaths[rnd1]] = [bgmPaths[rnd1], bgmPaths[rnd0]];
}

var bgms = new Audio(bgmPaths[curBgmId]);

// Continuous playback
bgms.onended = function() {
  try {
    if (++curBgmId >= bgmPaths.length)
      curBgmId = 0;
    bgms.src = bgmPaths[curBgmId];
    bgms.oncanplaythrough = function() {
      playBGM();    
    }
  } catch(e) {
    toast(e.message);    
  }
}


function playBGM() {
  try {
    bgms.play();
  } catch(e) {
    toast(e.message);    
  }
}

function pauseBGM() {
  bgms.pause();
}

// Sound Setting
var soundSettings = {
  bgm : 'off',
  sound : 'off'
}
