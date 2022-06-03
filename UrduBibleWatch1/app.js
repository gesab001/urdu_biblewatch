/**
 * 
 */

window.onload = function(){

	function launchAppPage(message) {
		console.log("launchAppPage :" + message);
		
		if (message==="Add Verse"){
			console.log("stay here");
			document.getElementById("mainPage").click();
		}else if (message.indexOf("readVerse_")!=-1){
			console.log("launch favorites page");
			favoriteVerseIndex = parseInt(message.split("_")[1]);
			tizen.preference.setValue("favoriteVerseIndex", favoriteVerseIndex);
			tizen.preference.setValue("launchFavoriteFromWidget", true);
			window.location.href = "./contents/favorites/index.html";
		}else{
			tizen.preference.setValue("launchFavoriteFromWidget", false);
			document.getElementById("mainPage").click();
		}

	}
	var reqAppControl;
	reqAppControl = tizen.application.getCurrentApplication().getRequestedAppControl();

 	if (reqAppControl && reqAppControl.appControl.operation) {
	    launchAppPage(reqAppControl.appControl.operation);
	}else{
		document.getElementById("mainPage").click();		
	}

};
