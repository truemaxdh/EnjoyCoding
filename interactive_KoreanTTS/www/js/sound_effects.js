// Sound Play
const voiceLinks = [
  '가','sound/ga.mp3',
  '나','sound/na.mp3',
  '다','sound/da.mp3',
  '라','sound/la.mp3',
  '마','sound/ma.mp3',
  '바','sound/ba.mp3',
  '사','sound/sa.mp3',
  '아','sound/aa.mp3',
  '자','sound/ja.mp3',
  '차','sound/cha.mp3',
  '카','sound/ka.mp3',
  '타','sound/ta.mp3',
  '파','sound/pa.mp3',
  '하','sound/ha.mp3'
];
let sounds = []; // sounds
voiceLinks.forEach((item, i)=> {
  if (i % 2 != 0) {
    var audio = new Audio();
    audio.src = voiceLinks[i];
    audio.preload = "auto";
    audio.volume = 0.5;
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
