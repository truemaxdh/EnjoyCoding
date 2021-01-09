// Sound Play
var sounds = {
  fire : {audio : new Audio('sound/fire.mp3'), volume : 0.8},
  hitMeteorite : {audio : new Audio('sound/hitMeteorite.mp3'), volume : 0.2},
  protection : {audio : new Audio('sound/protection.mp3'), volume : 0.4}
}
  
function playSound(sound)
{
  try {
    if (soundSettings.sound == 'on') {
      sound.audio.currentTime = 0;
      sound.audio.volume = sound.volume;
      sound.play();
    }
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
