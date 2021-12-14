const TTS = {
  voices: [],
  voice: null,
  lang: "ko-KR",
  initialized : false,
  utterance : null,
  init : ()=>{
    TTS.voices = window.speechSynthesis.getVoices();
    //console.log(TTS.voices);
    for(let i = 0; i < TTS.voices.length ; i++) {
      if(TTS.voices[i].lang.indexOf(TTS.lang) >= 0 || 
        TTS.voices[i].lang.indexOf(TTS.lang.replace('-', '_')) >= 0) 
      {
        TTS.voice = TTS.voices[i];
      }
    }
    TTS.utterance = new SpeechSynthesisUtterance();
    TTS.utterance.onend = function (event) {
      //console.log('end');
    };
    TTS.utterance.onerror = function(event) {
      //console.log('error', event);
    };

    TTS.utterance.voice = TTS.voice;

    TTS.utterance.lang = TTS.lang;
    TTS.utterance.pitch = 1;
    TTS.utterance.rate = 1; //속도
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
    TTS.utterance.text = text;
    
    window.speechSynthesis.speak(TTS.utterance);
  }
};
