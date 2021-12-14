const TTS = {
  voices: [],
  voice: null,
  lang: "ko-KR",
  initialized : false,
  init : ()=>{
    TTS.voices = window.speechSynthesis.getVoices();
    for(let i = 0; i < TTS.voices.length ; i++) {
      if(TTS.voices[i].lang.indexOf(TTS.lang) >= 0 || 
        TTS.voices[i].lang.indexOf(TTS.lang.replace('-', '_')) >= 0) 
      {
        this.voice = TTS.voices[i];
      }
    }
  },
  speech : (text)=>{
    if(!window.speechSynthesis) {
      alert("음성 재생을 지원하지 않는 브라우저입니다. 크롬, 파이어폭스 등의 최신 브라우저를 이용하세요");
      return;
    }

    if (TTS.voice == null) {
      TTS.init();
      if (TTS.voice == null) {
        return;
      }
    }
    
    let utterThis = new SpeechSynthesisUtterance(text);
    utterThis.onend = function (event) {
      //console.log('end');
    };
    utterThis.onerror = function(event) {
      //console.log('error', event);
    };

    utterThis.voice = TTS.voice;

    utterThis.lang = TTS.lang;
    utterThis.pitch = 1;
    utterThis.rate = 1; //속도
    window.speechSynthesis.speak(utterThis);
  }
};