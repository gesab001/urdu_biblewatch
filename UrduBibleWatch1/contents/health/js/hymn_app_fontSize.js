fontResizeButton = document.querySelector(".fontResizeButton");


var hymn_app_fontSize = (function(){
	
	
	  this.initFontSize = function(){
			settingsData = JSON.parse(tizen.preference.getValue("settingsData")); 
			console.log(settingsData);
			ui.updateFontSize2("songLyrics");
			ui.updateFontSize2("songLyrics2");
			
	  };
	  
	  this.changeFontSize = function(){
		  ui.changeFontSize2("songLyrics");
		  ui.changeFontSize2("songLyrics2");

	  }
	return this;
	
}());

fontResizeButton.addEventListener("click", hymn_app_fontSize.changeFontSize);

hymn_app_fontSize.initFontSize();
