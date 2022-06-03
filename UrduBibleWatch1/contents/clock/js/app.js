var clocks = ["clock1", "clock2", "clock3"];
var pageID = "Clock";
var currentClockIndex = 0;

if (tizen.preference.exists("clockIndex")){
	currentClockIndex = parseInt(tizen.preference.getValue("clockIndex"));
}else{
	tizen.preference.setValue("clockIndex", currentClockIndex );
}


function loadClock (){
	var clockToDisplay = clocks[currentClockIndex];
	var clockCssFilename = "./css/"+clockToDisplay + ".css";
	var clockJsFilename = "./js/"+clockToDisplay + ".js";
	console.log("clockCssFilename: " + clockCssFilename);
	console.log("clockJsFilename: " + clockJsFilename);
	
	var FILE_URL = clockJsFilename;

	var loadClockCallBack = function(str){
		console.log("loadClockCallBack: " + str);
		for (var x=0; x< clocks.length; x++){
			var clockToHide = clocks[x];
			console.log("clockToHide: " + clockToHide);
			document.getElementById(clockToHide).style.display = "none";		
		}
		console.log("clockToDisplay: " + clockToDisplay);

		document.getElementById(clockToDisplay).style.display = "block";		
		console.log("clockToDisplay: " + clockToDisplay);

		clock.init();
	};
	var loadCSSCallback = function(str){
		console.log(str);
		filesystem.loadJSApplication(FILE_URL, clockToDisplay,  false, loadClockCallBack);	

	};
	
	filesystem.loadCSS(clockCssFilename, loadCSSCallback);	

}


loadClock();
tizen.preference.setValue("fromOptionsPage", false);

