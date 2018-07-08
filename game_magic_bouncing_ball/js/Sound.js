
// Sound Play
var sounds = []; // sounds
	sounds[0] = new Audio('media/brick.wav');
	sounds[0].volume = 0.5;
	sounds[1] = new Audio('media/divide.wav');
	sounds[1].volume = 0.5;
	sounds[2] = new Audio('media/laser.wav');
	sounds[2].volume = 0.5;
	sounds[3] = new Audio('media/button-1.wav');
	sounds[3].volume = 0.5;
	sounds[4] = new Audio('media/button-2.wav');
	sounds[4].volume = 0.5;
	sounds[5] = new Audio('media/button-3.wav');
	sounds[5].volume = 0.5;
	sounds[6] = new Audio('media/button-4.wav');
	sounds[6].volume = 0.5;
	sounds[7] = new Audio('media/button-5.wav');
	sounds[7].volume = 0.5;
	sounds[8] = new Audio('media/button-6.wav');
	sounds[8].volume = 0.5;
	sounds[9] = new Audio('media/button-8.wav');
	sounds[9].volume = 0.5;
function playSound(soundID)
{
	sounds[soundID].currentTime = 0;
	sounds[soundID].play();
}
	   
function playPause() {
  var myVideo = document.getElementsByTagName('audio')[0];
  if (myVideo.paused)
	myVideo.play();
  else
	myVideo.pause();
}   