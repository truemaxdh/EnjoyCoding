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


function playBGM() {
  try {
    if (soundSettings.bgm == 'on') {
      var bgm = document.getElementById( 'bgm' );
      bgm.volume = 0.5;
      bgm.play();   
    } 
  } catch(e) {
    toast(e.message);    
  }
}

function pauseBGM() {
  document.getElementById( 'bgm' ).pause();
}

// Sound Setting
var soundSettings = {
  bgm : 'on',
  sound : 'on'
}

function test() {
  with(new AudioContext)
	  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,
		 6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,9,9,9,9,10,10,10,10,10,10,10,10,10,10,10,10,10,
		 11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,13,13,13,13,13,13,13,13,13,13,13,
		 14,14,14,14,14,14,14,14,14,14,14,14,14,15,15,15,15,15,15,15,15,15,15,15,15,16,16,16,16,16,16,16,16,16,16,16,16,
		 17,17,17,17,17,17,17,17,17,17,17,17,17,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,
		 20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,22,22,22,23]
			.map((v,i)=>{
				with(createOscillator())v&&start(
					e=[7,8,9,10,11,12,13,14,15,16,17,18,19,26,27,28,29,30,31,43,44,45,46,47,48,49,50,51,56,65,7,8,9,10,11,12,13,14,15,16,17,18,19,24,25,26,
						 27,28,29,30,31,37,38,42,43,51,56,57,64,65,12,13,24,25,26,27,31,38,51,56,57,62,63,12,13,23,24,25,38,50,51,56,57,61,62,12,13,23,24,38,
						 48,49,50,56,57,60,12,13,23,24,38,45,46,47,48,56,57,59,12,13,23,24,38,44,45,46,47,48,56,57,58,12,13,23,24,25,26,27,28,29,30,38,48,49,
						 56,57,12,13,23,24,25,26,27,28,29,30,31,38,49,50,56,57,12,13,30,31,32,38,50,51,56,57,58,7,8,12,13,31,32,38,51,56,57,58,59,60,7,8,12,
						 13,31,32,38,51,56,57,60,61,7,8,12,13,31,32,38,51,56,57,62,63,7,8,9,12,13,31,32,38,51,56,57,64,65,7,8,9,10,11,12,13,31,32,38,51,56,
						 57,65,66,7,8,9,10,11,12,13,31,32,38,49,50,51,56,57,66,67,8,9,10,11,12,22,23,24,25,26,27,28,29,30,31,32,37,38,44,45,46,47,48,49,56,
						 57,67,22,23,24,25,26,27,28,29,30,37,38,56,57,67,68,56,57,68,68][i]/5,connect(destination),frequency.value=988/1.06**v)+stop(e+.2)})
}

const audioContext = new AudioContext();
const G = audioContext.createGain();
let lastSoundTime = 0;
function speedSound(speed) {
	if ((gamePlay.last_animation_time - lastSoundTime) < 500) return;
	lastSoundTime = gamePlay.last_animation_time;
	const now = audioContext.currentTime;
	const freq = speed * 2;
	//with(new AudioContext)
	//with(G=createGain())
	with(audioContext)
	with(G)
	//for(i in D=[speed * 2])
	with(createOscillator())
	//if(D[i])
	connect(G),
	G.connect(destination),
	start(now),
	frequency.setValueAtTime(440*1.06**(13-freq),now),
	gain.setValueAtTime(1,now),
	//gain.setTargetAtTime(.0001,i*.5+.49,.005),
	stop(now + .5)
}
