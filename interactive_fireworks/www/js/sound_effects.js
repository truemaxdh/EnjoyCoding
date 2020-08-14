// Sound Play
var sounds = []; // sounds
for (var i = 0; i < 6; i++) {
  sounds[i] = new Audio('sound/fire' + i + '.mp3');
  sounds[i].volume = 0.7;
}
	
function playSound(soundID)
{
  console.log(soundSettings.sound);
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
