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

var soundSettings = {
  bgm : 'off',
  sound : 'off'
}
