var localeLanguage = undefined;
var languageTTS = 'en_US';
var voicesTTS = speechSynthesis.getVoices();
var synth = window.speechSynthesis;
var voice;
var speechRate;

function setSpeechRate(){
	var value = 10;
	if (tizen.preference.exists("speechratevalue")){
		value = parseInt(tizen.preference.getValue("speechratevalue"));
	}

	speechRate =  value / 10;
}
var isTTS = false;
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
    
    var setTTSLanguage = function(lang){
        for (var i = 0; i < voicesTTS.length; i++) {
            console.log("voices: " + voicesTTS[i].lang);
            //if (voicesTTS[i].lang === lang) {
            //  voice = voicesTTS[i];
            //  break;
           // }
          }
    	languageTTS = lang;
    };
    
    this.cancel = function(){
    	synth.cancel();
    };
	this.play = function (text){
		console.log("this.play isTTS: " + isTTS);
		console.log("text: " + text);

		var proceed = function(){
			 if(isTTS){
				 console.log("play this text: " + text);
				 this.cancel();
				 var speech = new SpeechSynthesisUtterance(text);
				 //speech.voice = voice;
				 speech.rate = speechRate;
				 synth.speak(speech);			 
			 }
		}
		var callback_localeLanguage = function(locale){
			localeLanguage = locale;
			console.log("localeLanguage: " + JSON.stringify(localeLanguage));
			languageTTS = localeLanguage;
			setTTSLanguage(languageTTS);
			if (speechRate==undefined){
				setSpeechRate();
				proceed();
			}else{
				proceed();

			}
		};
		if (localeLanguage==undefined){
			localization.getDeviceLocaleLanguage(callback_localeLanguage);
		}else{
			if (speechRate==undefined){
				setSpeechRate();
				proceed();
			}else{
				proceed();

			}
		}


	};
	
	return this;
})();


