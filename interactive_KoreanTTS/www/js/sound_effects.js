// Sound Play
const voiceLinks = [
  '가','voice/ga.mp3',
  '나','voice/na.mp3',
  '다','voice/da.mp3',
  '라','voice/la.mp3',
  '마','voice/ma.mp3',
  '바','voice/ba.mp3',
  '사','voice/sa.mp3',
  '아','voice/aa.mp3',
  '자','voice/ja.mp3',
  '차','voice/cha.mp3',
  '카','voice/ka.mp3',
  '타','voice/ta.mp3',
  '파','voice/pa.mp3',
  '하','voice/ha.mp3'
];
let sounds = []; // sounds
voiceLinks.forEach((item, i)=> {
  if (i % 2 != 0) {
    var audio = new Audio();
    audio.src = voiceLinks[i];
    audio.preload = "auto";
    audio.volume = 0.5;
    audio.playbackRate = 1.5;
    sounds.push(audio);
  }  
});
  
function playSound(soundID)
{
  if (soundSettings.sound == "on") {
    try {
      voiceLinks.forEach((item, i)=>{
        if (item == soundID) {
          const idx = i / 2;
          sounds[idx].currentTime = 0;
          sounds[idx].play();
        }
    });
      
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
