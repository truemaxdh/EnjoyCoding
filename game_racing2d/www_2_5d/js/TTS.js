let TTS = {
    engVoice: null,
    pitch: 1,
    rate: 1,
    lastSpeechTime: 0,
    speechInterval: 900,
    init: function() {
        const voices = window.speechSynthesis.getVoices();
        voices.some(vo=>{
            if (vo.lang.indexOf("en_US") >= 0 || vo.lang.indexOf("en-US") >= 0) {
                this.engVoice = vo;
                return true;
            } else return false;
        });
        if (this.engVoice == null) alert('voice not found');
        else alert(this.engVoice.lang);
    },
    speech: function(txt) {
        if ((this.lastSpeechTime + this.speechInterval) > gamePlay.last_animation_time)
            return;
        console.log('speech: ' + txt);
        this.lastSpeechTime = gamePlay.last_animation_time;
        //if (this.speeching) return;
        if(!window.speechSynthesis) {
            alert("음성 재생을 지원하지 않는 브라우저입니다. 크롬, 파이어폭스 등의 최신 브라우저를 이용하세요");
            return;
        }

        this.speeching = true;
        let utterThis = new SpeechSynthesisUtterance(txt);
        // utterThis.onend = function (event) {
        //     //console.log('speech end', event);
        //     TTS.speeching = false;
        // };
    
        // utterThis.onerror = function(event) {
        //     //console.log('speech error', event);
        //     TTS.speeching = false;
        // };

        utterThis.voice = this.engVoice;
        utterThis.lang = this.engVoice.lang;
        utterThis.pitch = this.pitch;
        utterThis.rate = this.rate;

        window.speechSynthesis.speak(utterThis);
        //console.log('speech start');
    }
}

TTS.init();
if (window.speechSynthesis.onvoiceschanged !== undefined) {
     window.speechSynthesis.onvoiceschanged = function() {TTS.init()};
}
