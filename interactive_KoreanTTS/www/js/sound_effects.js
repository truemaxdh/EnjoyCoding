// Sound Play
const voiceLinks = [
  '가',
  'https://dicmedia.korean.go.kr/multimedia/multimedia_files/convert/20120221/31083/SND000019786.mp3',
  '나',
  'https://dicmedia.korean.go.kr/multimedia/multimedia_files/convert/20160913/20000/16000/318550/SND000327904.mp3',
  '다',
  'https://dicmedia.korean.go.kr/multimedia/multimedia_files/convert/20120214/26426/SND000015129.mp3',
  '라',
  'https://dicmedia.korean.go.kr/multimedia/multimedia_files/convert/20160913/40000/39000/343855/SND000353209.mp3',
  '마',
  'https://dicmedia.korean.go.kr/multimedia/multimedia_files/convert/20160913/60000/51000/310095/SND000319449.mp3',
  '바',
  'https://dicmedia.korean.go.kr/multimedia/multimedia_files/convert/20160913/20000/20000/312870/SND000322224.mp3',
  '사',
  'https://dicmedia.korean.go.kr/multimedia/multimedia_files/convert/20160913/30000/29000/309787/SND000319141.mp3',
  '아',
  'https://dicmedia.korean.go.kr/multimedia/multimedia_files/convert/20160913/30000/21000/295063/SND000304417.mp3',
  '자',
  'https://dicmedia.korean.go.kr/multimedia/multimedia_files/convert/20160913/50000/49000/325762/SND000335116.mp3',
  '차',
  'https://dicmedia.korean.go.kr/multimedia/multimedia_files/convert/20160913/50000/50000/304456/SND000313810.mp3',
  '카',
  'https://dicmedia.korean.go.kr/multimedia/multimedia_files/convert/20120506/75771/SND000064474.mp3',
  '타',
  'https://dicmedia.korean.go.kr/multimedia/multimedia_files/convert/20160913/10000/01000/333647/SND000343001.mp3',
  '파',
  'https://dicmedia.korean.go.kr/multimedia/multimedia_files/convert/20160913/40000/38000/327246/SND000336600.mp3',
  '하',
  'https://dicmedia.korean.go.kr/multimedia/multimedia_files/convert/20160913/20000/18000/338085/SND000347439.mp3'
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
        if (item == str) {
          const soundID = i / 2;
          sounds[soundID].currentTime = 0;
          sounds[soundID].play();
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
