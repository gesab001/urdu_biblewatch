var maximizeButton = document.querySelector(".maximizeButton"),
pageID = "HymnsPage",
clockButton = document.querySelector(".clockIcon"),
songLyricsMaximize = document.getElementById("songLyrics2");

var maximizeScreen = (function(){
	
	
	this.fullScreenHymn = function(){
		console.log("full screen");
		songLyricsMaximize.innerHTML = songLyricsDiv.innerHTML;
		ui.fullScreen();
	};
	
	this.showClock = function(){
		
		var key = "lastHymnPlayed";
		var value = {"target":{"id": songfilename}};
		settingsData_CRUD.saveToPreferences(key, value);
		
		ui.openClock();
	}

	this.initFullScreen = function(){
		isFullScreen = settingsData["fullScreen"];
		var lastHymnPlayed;
		var preferenceKey = "lastHymnPlayed";

		if(tizen.preference.exists(preferenceKey)){
			var eventObj = JSON.parse(tizen.preference.getValue(preferenceKey));
			console.log("lastHymnPlayed: " + eventObj.target.id);
			var callbackGetJsonData = function(jsonStr){
				 hymnsJsonData = JSON.parse(jsonStr);
				 showSong(eventObj);	
				 if(isFullScreen){
				    this.fullScreenHymn();
				 }
				 
			};
		    filesystem.getJsonData("wgt-private/hymns", "hymns-youtube.json", callbackGetJsonData);

		}
		console.log("isFullScreen: " + isFullScreen);


		
	};
	return this;
})();

maximizeButton.addEventListener("click", maximizeScreen.fullScreenHymn);
clockButton.addEventListener("click", maximizeScreen.showClock);
