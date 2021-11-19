// Sound Play
var sounds = []; // sounds
// sounds[0] = new Audio('sound/divide.wav');
// sounds[0].volume = 0.7;
// sounds[1] = new Audio('sound/divide.wav');
// sounds[1].volume = 0.7;
// sounds[2] = new Audio('sound/divide.wav');
// sounds[2].volume = 0.7;
	
function playSound(soundID)
{
  try {
    sounds[soundID].currentTime = 0;
    sounds[soundID].play();
  } catch(err) {}
}
