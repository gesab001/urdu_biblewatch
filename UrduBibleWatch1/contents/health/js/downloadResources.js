
function setChapterTitles(tableOfContents){
	for (var x=0; x< tableOfContents.length; x++){
		var section = tableOfContents[x];
		var chapters = section["chapters"];
		for (var c=0; c<chapters.length; c++){
			 var item = chapters[c];
			 var filename = item["url"].split("/")[4].split(".")[0] + ".json";
			 chapterTitleList[filename] = item;
		}
	}
	console.log(Object.keys(chapterTitleList));
}
function showTableOfContents(){
	console.log("showTableOfContents");
	var path = "wgt-private/ministryofhealing";
	var filename = "ministryofhealing3.json";
	
	var callback = function(str){
		var jsonObj = JSON.parse(str);
		var tableOfContents = jsonObj["tableofContents"];
		console.log(jsonObj["bookTitle"]);
		loadSectionsList(str);
		setChapterTitles(tableOfContents);
		  if (tizen.preference.exists("ministryofhealing_lastViewedParagraph")){
			  var jsonObj = getLastViewedParagraph("ministryofhealing_lastViewedParagraph");			  
			  var jsonObj = getLastViewedParagraph("ministryofhealing_lastViewedParagraph");	
			  console.log(JSON.stringify(jsonObj));
			  selectedSectionIndex = parseInt(jsonObj["sectionIndex"]);
			  paragraphIndex = parseInt(jsonObj["paragraphIndex"]);
			  selectedChapterIndex = 0; 
			  var event = {"target": {"id": JSON.stringify(jsonObj)}};
			  
			  showSong(event);
		  }
	};
	filesystem.getJsonData(path, filename, callback) ;
}
function confirmDownloadGo(){
	  var callbackExtractedFiles = function(response){
		  console.log("table of contents now available");
		  showTableOfContents();
	  };
	  var callbackSuccessDownload = function(response){
		  
	       console.log("callbackSuccessDownload: " + callbackSuccessDownload); 
	       var pathToZipFile = "wgt-private/ministryofhealing.zip";
	       archive.extractAllFiles(pathToZipFile, callbackExtractedFiles);
	       //loadAlphabetList();
		   //maximizeScreen.initFullScreen();

      };
	  var source = "https://github.com/gesab001/health/raw/main/moh/ministryofhealing.zip";
	  downloadFile(source, callbackSuccessDownload);	
}
function loadResources(){
	  
	  var callbackFileExists = function(isFileExists){
		  console.log("callbackFileExists: " + isFileExists );  
		  if (isFileExists){
			  showTableOfContents();
			  maximizeScreen.initFullScreen();

		  }else{
			  var confirmDownload = confirm("Would you like \n to download \n the Ministry of Healing?");
			  if(confirmDownload){
				  confirmDownloadGo();
			  }

		  }
	  };
	  filesystem.fileExists("wgt-private", "ministryofhealing", "ministryofhealing3.json", callbackFileExists);
}