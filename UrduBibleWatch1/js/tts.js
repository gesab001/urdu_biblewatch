var languageTTS = 'en_US';
var voicesTTS = speechSynthesis.getVoices();
var synth = window.speechSynthesis;
var voice;
var isTTS = "off";
if(tizen.preference.exists("tts_settings")){
	isTTS = tizen.preference.getValue("tts_settings");
}

var tts = (function(){

    this.getVoices = function(){
    	console.log("getVoices");
    	   var voices = synth.getVoices();
           voices.forEach(function(voice, i) {
             // Add all details to table
            
                 console.log("voice language: " + voice.lang); 
           });
    };
    
    this.setTTSLanguage = function(lang){
        for (var i = 0; i < voicesTTS.length; i++) {
            if (voicesTTS[i].lang === lang) {
              voice = voicesTTS[i];
              break;
            }
          }
    	languageTTS = lang;
    };
    
    this.cancel = function(){
    	synth.cancel();
    };
	this.play = function (text){
		console.log("this.play isTTS: " + isTTS);
		console.log("text: " + text);
		
		 if(isTTS==="on"){
			 console.log("play this text: " + text);
			 this.cancel();
			 var speech = new SpeechSynthesisUtterance(text);
			 //speech.voice = voice;
			 speech.rate = 1;
			 synth.speak(speech);			 
		 }

	};
	
	return this;
})();


