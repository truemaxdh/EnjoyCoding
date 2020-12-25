// Sound Play
var sounds = []; // sounds
sounds[0] = new Audio('sound/coin1.mp3');
sounds[0].volume = 0.4;
sounds[1] = new Audio('sound/coin2.mp3');
sounds[1].volume = 0.4;
sounds[2] = new Audio('sound/coin3.mp3');
sounds[2].volume = 0.4;
  
function playSound(soundID)
{
  try {
    if (soundSettings.sound == 'on') {
      sounds[soundID].currentTime = 0;
      sounds[soundID].play();
    }
  } catch(err) {}
}

function playBGM() {
  try {
    if (soundSettings.bgm == 'on')
      document.getElementById( 'bgm' ).play();   
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
