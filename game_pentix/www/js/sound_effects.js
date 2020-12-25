function playSound(soundID)
{
  try {
    if (soundSettings.sound == 'on')
      document.getElementById( 'clearsound' ).play();
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
