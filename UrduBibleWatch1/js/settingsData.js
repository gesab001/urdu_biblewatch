
var settingsData_CRUD = (function(){
    this.saveSettingsDataBeforeClosingPage = function() {
	    var browseSettings = {
	        "book": book,
	        "chapter": chapter,
	        "verse": verse
	    };
	    this.saveToPreferences("browseSettings", browseSettings);

	    if (document.getElementById("minScreen").style.display === "block") {
	        settingsData["fullScreen"] = false;
	    }
        this.update(settingsData);

	};

	this.save = function(settingsData){
		var string = JSON.stringify(settingsData);
		tizen.preference.setValue("settingsData", string);		
	};
	
	this.saveToPreferences = function(key, value){
		var string = JSON.stringify(value);
		tizen.preference.setValue(key, string);		
	};	

	this.update = function(settingsData){
		var string = JSON.stringify(settingsData);
		tizen.preference.setValue("settingsData", string);		

	};
	this.get = function(callback){
		var settingsData;
		if(tizen.preference.exists("settingsData")){
			settingsData = JSON.parse(tizen.preference.getValue("settingsData")); 
	   		callback(settingsData);
		}else{
		  
		   var loadSettingsData = function(jsonObj){
			   settingsData = jsonObj;
	   		   callback(settingsData);

		   };
           this.create(loadSettingsData);

		}
	};
	
	this.create = function(callback){
		var settingsData = {};
		settingsData["bibleversion"] = LANG_JSON_DATA["DEFAULT_BIBLE"];
		settingsData["duration"] = "everyminute";
		settingsData["bibleViewType"] = "bibleminute";
		settingsData["fontSize"] = 20;
		var string = JSON.stringify(settingsData);
		tizen.preference.setValue("settingsData", string);	
		callback(settingsData);

	};
	

	return this;
}());