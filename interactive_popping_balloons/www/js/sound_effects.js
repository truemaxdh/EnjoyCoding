// Sound Play
var sounds = []; // sounds
/*for (var i = 0; i < 5; i++) {
  for (var j = 0; j < 4; j++) {
    var audio = new Audio();
    audio.src = 'sound/fire' + j + '.mp3';
    audio.preload = "auto";
    audio.volume = 0.3;
    sounds.push(audio);
  }
}*/
  
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
