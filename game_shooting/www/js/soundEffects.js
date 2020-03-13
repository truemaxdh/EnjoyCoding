// Sound Play
var sounds = []; // sounds
sounds[0] = new Audio('sound/coin1.mp3');
sounds[0].volume = 1;
sounds[1] = new Audio('sound/coin2.mp3');
sounds[1].volume = 1;
sounds[2] = new Audio('sound/coin3.mp3');
sounds[2].volume = 1;
	
function playSound(soundID)
{
	sounds[soundID].currentTime = 0;
	sounds[soundID].play();
}
