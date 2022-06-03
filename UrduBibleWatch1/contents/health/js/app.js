/**
 * 
 */


var isFullScreen = false,
allChaptersTextArray = [],
chapterTitleList = {},
hymnsJsonData,
chapterData,

selectedSectionIndex,
selectedChapterIndex,
paragraphIndex = 0,
settingsData,
chapterFilename,
description = document.getElementById("downloadBibleStatus"),
descriptionNoConnection = document.getElementById("downloadBibleStatusNoConnection"),
descriptionDownloadFail = document.getElementById("downloadHymnStatusFail"),
musicListJson,
hymnsByTopics,
allSongsList = [],
songList,
totalSongs,
elementList,
chapterTitleEl = document.getElementById("ChapterTitle"),
listTitle = document.getElementById("listTitle"),
songLyricsDiv = document.getElementById("songLyrics"),
musicListDiv =  document.getElementById("MusicList"),
tableOfContentsButton = document.querySelector(".tableOfContentsButton"),
sortByButton = document.querySelector(".tableOfContentsButton"),
backButton = document.querySelector(".backButton"),
exitButton = document.querySelector(".exitButton"),

sections = document.querySelectorAll(".section"),
updateButton = document.querySelector(".updateButton"),

majorVersion;

function saveLastViewedParagraph(chapterFilename, selectedSectionIndex, selectedChapterIndex, chapterTitle, paragraphIndex)
{

	console.log("selectedSectionIndex: " + selectedSectionIndex);
	console.log("selectedChapterIndex: " + selectedChapterIndex);
	var jsonObj = {"chapterFilename": chapterFilename, "sectionIndex": selectedSectionIndex, "chapterIndex": selectedChapterIndex, "chapterTitle": chapterTitle, "paragraphIndex": paragraphIndex};
	console.log("saveLastViewedParagraph: " + JSON.stringify(jsonObj));
	settingsData_CRUD.saveToPreferences("ministryofhealing_lastViewedParagraph", jsonObj);
}
function getLastViewedParagraph(key){
	
	//var jsonObj = {"chapterFilename": chapterFilename, "paragraphIndex": paragraphIndex};
	var jsonObj = JSON.parse(tizen.preference.getValue(key));
	return jsonObj;
}
function nextParagraph(){
	  console.log("nextParagraph");
	  if (paragraphIndex<chapterData.length-1){
		  paragraphIndex = paragraphIndex + 1;
		  var htmlText = chapterData[paragraphIndex];
		  songLyricsDiv.innerHTML = "";
		  songLyricsDiv.innerHTML = htmlText;//+JSON.stringify(verses);
		  songLyricsDiv.style.paddingBottom = "50%";	
		  songLyricsMaximize.innerHTML = "";
		  songLyricsMaximize.innerHTML = htmlText;//+JSON.stringify(verses);	
		  var percent = (paragraphIndex / (chapterData.length-1)) * 100;
		  console.log("percent: " + percent);
		  progress.setProgress(percent, "readingProgressBar");
		  progress.setProgress(percent, "readingProgressBar2");
		  saveLastViewedParagraph(chapterFilename, selectedSectionIndex, selectedChapterIndex, chapterTitle, paragraphIndex);
	  }

}
function prevParagraph(){
	  if (paragraphIndex>0){
		  paragraphIndex = paragraphIndex - 1;
		  var htmlText = chapterData[paragraphIndex];
		  songLyricsDiv.innerHTML = "";
		  songLyricsDiv.innerHTML = htmlText;//+JSON.stringify(verses);
		  songLyricsDiv.style.paddingBottom = "50%";	
		  songLyricsMaximize.innerHTML = "";
		  songLyricsMaximize.innerHTML = htmlText;//+JSON.stringify(verses);	
		  var percent = (paragraphIndex / (chapterData.length-1)) * 100;
		  console.log("percent: " + percent);

		  progress.setProgress(percent, "readingProgressBar");
		  progress.setProgress(percent, "readingProgressBar2");
		  saveLastViewedParagraph(chapterFilename, selectedSectionIndex, selectedChapterIndex, chapterTitle, paragraphIndex);
	  }

}


function showSong(event){

	
	  console.log("filename: " + event.target.id);
      var id = JSON.parse(event.target.id);
      var path = "wgt-private/ministryofhealing";
      chapterFilename = id.chapterFilename;
      chapterTitle = id.chapterTitle;
      chapterTitleEl.innerHTML = chapterTitle;
      
      
      
      var callback = function(str){
    	  chapterData = JSON.parse(str);
    	  var htmlText = chapterData[paragraphIndex];
		  songLyricsDiv.innerHTML = "";
		  songLyricsDiv.innerHTML = htmlText;//+JSON.stringify(verses);
		  songLyricsDiv.style.paddingBottom = "50%";
		  //checkIfSongIsAvailable(callback);
		  //progress.setProgress(0, "songProgressBar");
		  ui.hideSections(sections);
		  ui.showSection(sections, 1);
		  setActivePage("popup");
		  saveLastViewedParagraph(chapterFilename, selectedSectionIndex, selectedChapterIndex, chapterTitle, paragraphIndex);
		  //hymn_app_favorites.initFavoriteIcon();
      };
      filesystem.getJsonData(path, chapterFilename, callback);
	
	

}

function createSongList(id){
	  console.log("Id: " + id);
	  
	  var callback_getHymnsTitleArray = function(songList){
			if (musicListDiv.children.length>0){
				musicListDiv.removeChild(elementList);
			}

			
			var addButtonListeners = function(){
				listmaker.addListenersToItemList2(elementList, showSong);
			};
			var loadButtonList = function(doc){
				elementList = doc;
				musicListDiv.appendChild(elementList);
				addButtonListeners();
				//ui.showElement(page);

			};

			var createButtonList = function(){

				listmaker.createButtonList(songList, loadButtonList);
			};
			createButtonList();	  
	  }
	  getHymnsTitleArray(id, callback_getHymnsTitleArray);

}
function loadAlphabetList(){
 	    listTitle.innerHTML = "Ministry of Healing";
		ui.hideSections(sections);
		ui.showSection(sections, 0);
		setActivePage("HealthPage");
		var alphabetList;

		var callback_getHymnsAlphabetArray = function(response){
			alphabetList = response;
			if (musicListDiv.children.length>0){
				musicListDiv.removeChild(elementList);
			}

			
			var addButtonListeners = function(){
				listmaker.addListenersToItemList(elementList, createSongList);
			};
			var loadButtonList = function(doc){
				elementList = doc;
				musicListDiv.appendChild(elementList);
				addButtonListeners();
				//ui.showElement(page);

			};

			var createButtonList = function(){

				listmaker.createButtonList(alphabetList, loadButtonList);
			};
			createButtonList();

		}
		getHymnsAlphabetArray(callback_getHymnsAlphabetArray);

	}

function downloadFile(source, callbackSuccessDownload){
	   function openDownloadPopup (){
			ui.hideSections(sections);
			ui.showSection(sections, 3);
			setActivePage("popup");
			document.getElementById("downloadingTitle").style.display = "block";
			document.getElementById("downloadHymnStatusFail").style.display = "none";
			document.getElementById("downloadBibleStatus").style.display = "block";
			document.getElementById("downloadBibleStatusNoConnection").style.display = "none";
	   }
		function closeDownloadPopup (){
			ui.hideSections(sections);
			ui.showSection(sections, 0);
			setActivePage("HealthPage");
		}
		var onStartCallBack = function(id){
			downloadId = id;
			openDownloadPopup();
		};
		var onCanceledCallBack = function(){

	    		alert("Download canceled.");
	        
			closeDownloadPopup();        	

		};
		var onCompletedCallback = function(fullPath){
	        downloadId = null;
			closeDownloadPopup();
	        alert("Download complete."); 	
	        callbackSuccessDownload();
		};
		var onFailedCallback = function(error){
				console.log(error);
				
				if (error==="no internet"){
		    		alert("You are not\nconnected\nto the\ninternet.\nDownload failed.");


				}else{
		    		alert("Download failed.\nTry again.");



				}
				document.getElementById("downloadingTitle").style.display = "none";
				document.getElementById("downloadHymnStatusFail").style.display = "block";
				document.getElementById("downloadBibleStatus").style.display = "none";
				document.getElementById("downloadBibleStatusNoConnection").style.display = "none";
				ui.hideSections(sections);
				ui.showSection(sections, 3);
				setActivePage("HealthPage");
	        
		
		};
	
	    var destination = "wgt-private";
	    console.log("destination: " + destination);

	    download.startDownload(source, destination, onStartCallBack, onCanceledCallBack, onCompletedCallback, onFailedCallback);
	    //openDownloadPopup();
	    //onFailedCallback("error");
}
function updateMusicList(){
	  
	  
	  var updateFile = function(){
		  console.log("update file");
		    var source = "https://raw.githubusercontent.com/gesab001/music/main/musiclist2.json";  
          var callbackSuccessDownload = function(){
  	        window.location.reload();
          };
		    downloadMusicFile(source, callbackSuccessDownload);
	  };
	  
	  var deleteFile = function(){
		  console.log("delete file");
		  filesystem.deleteFile("wgt-private", "hymns", "hymns-youtube.json", updateFile);
	  };
	  
	  var checkMusicFileExists = function(){
		  
		  var callbackMusicFileExists = function(response){
			  if (response){
				  deleteFile();
			  }else{
				  updateFile();
			  }
		  } 
		  filesystem.fileExists("wgt-private", "hymns", "hymns-youtube.json", callbackMusicFileExists);
	  };

	  var checkIfMusicFolderInPrivateExists = function(){
		  
		  var callbackDirectoryExists = function(response){
			  console.log("music folder exists: " + response);
			  if (response){
				  checkMusicFileExists();
			  }else{
				  filesystem.createFolder("wgt-private", "hymns", updateFile);
			  }
		  };		  
		  filesystem.directoryExists("wgt-private/music", callbackDirectoryExists);
	  };
	  checkIfMusicFolderInPrivateExists();
}



function createMusicFolder(){
	  var callback = function(){
		console.log("music folder created");  
	  };
	  filesystem.createFolder("wgt-private", "hymns", callback);
}

function getHymnsTitleArray(filter, callback){

	  var compareObjects = function(object1, object2, key) {
		  const obj1 = object1[key].toUpperCase();
		  const obj2 = object2[key].toUpperCase();

		  if (obj1 < obj2) {
		    return -1;
		  }
		  if (obj1 > obj2) {
		    return 1;
		  }
		  return 0;
		};
		
	  var callbackGetJsonData = function(jsonStr){
		 var hymnsJsonData = JSON.parse(jsonStr);
       var songList = [];
		 var hymnsKeys = Object.keys(hymnsJsonData);
		 for (key in hymnsJsonData){
			 var title = hymnsJsonData[key]["title"];
			 title = title.replace("‘", "");
			 title = title.replace("'", "");
			 var letter = title.substring(0,1).toUpperCase();
			 if (letter===filter){
				 var jsonObj = {"label": title, "id": key};
				 songList.push(jsonObj);
			 }
		 }
		 songList.sort(function (title1, title2)  {
			  return compareObjects(title1, title2, 'label');
			});
		 callback(songList);
	  };
	  filesystem.getJsonData("wgt-private/hymns/", "hymns-youtube.json", callbackGetJsonData); 
	  
}

function getHymnsAlphabetArray(callback){
	  
	  var callbackGetJsonData = function(jsonStr){
		 hymnsJsonData = JSON.parse(jsonStr);
       var hymnTitles = [];
		 var hymnsKeys = Object.keys(hymnsJsonData);
		 for (key in hymnsJsonData){
			 var title = hymnsJsonData[key]["title"];
			 title = title.replace("‘", "");
			 title = title.replace("'", "");
			 hymnTitles.push(title);
		 }
		 console.log(hymnTitles[0]);
		 
		 var callbackAlphabetList = function(response){
			console.log(JSON.stringify(response)); 
			callback(response);
		 };
		 listmaker.createAlphabet(hymnTitles, callbackAlphabetList);
		 
	  };
	  filesystem.getJsonData("wgt-private/hymns/", "hymns-youtube.json", callbackGetJsonData); 
	  
}

function getHymnsNumberArray(callback){
	  
	  var callbackGetJsonData = function(jsonStr){
		 hymnsJsonData = JSON.parse(jsonStr);
       var hymnNumbers = [];
		 var hymnsKeys = Object.keys(hymnsJsonData);
		 for (key in hymnsJsonData){
			 var title = hymnsJsonData[key]["title"];
			 var number = hymnsJsonData[key]["number"];
			 var label = number + " - " + title;
			 var id = key;
			 var jsonObj = {"label": label, "id": id };
			 hymnNumbers.push(jsonObj);
		 }
		 console.log(hymnNumbers[0]);
		 callback(hymnNumbers);
	  };
	  filesystem.getJsonData("wgt-private/hymns/", "hymns-youtube.json", callbackGetJsonData); 
	  
}

function loadNumberList(){
	  listTitle.innerHTML = "Hymns by Number";
	  var callback_getHymnsNumbersArray = function(songList){
			if (musicListDiv.children.length>0){
				musicListDiv.removeChild(elementList);
			}

			
			var addButtonListeners = function(){
				listmaker.addListenersToItemList2(elementList, showSong);
			};
			var loadButtonList = function(doc){
				elementList = doc;
				musicListDiv.appendChild(elementList);
				addButtonListeners();
			};

			var createButtonList = function(){

				listmaker.createButtonList(songList, loadButtonList);
			};
			createButtonList();	  
	  }
	  getHymnsNumberArray(callback_getHymnsNumbersArray);	  
}

function getSectionsTopicsArray(callback){

	  var callbackGetJsonData = function(){
		  
	   var	 tableofContents = hymnsJsonData["tableofContents"];
       var sectionTopics = [];
       var topicsToAdd = [];
       hymnsByTopics = {};
		 for (var x=0; x<tableofContents.length; x++){
	         var topic = tableofContents[x];
			 var label =  topic["sectionTitle"];
			 var id =  x;
			 var jsonObj = {"label": label, "id": id };
			 console.log("jsonObj: " + JSON.stringify(jsonObj));
		     sectionTopics.push(jsonObj);
		 }		 
		 console.log(JSON.stringify(sectionTopics));

		 callback(sectionTopics);
	  };
	  callbackGetJsonData(); 
	  
}

function showFavoriteParagraph(_jsonObj){
	  var jsonObj = JSON.parse(_jsonObj);
	  selectedSectionIndex = parseInt(jsonObj["sectionIndex"]);
	  selectedChapterIndex = 0; 
	  var event = {"target": {"id": JSON.stringify(jsonObj)}};
	  
	  showSong(event);
}
function showParagraph(event){
	paragraphIndex = 0;
	selectedChapterIndex = 0;
	console.log("selectedChapterIndex: " + selectedChapterIndex);
	showSong(event);
}
function showChapters(event){
	  var id = event.target.id;
      selectedSectionIndex = id;

	  console.log("getSongsByTopic id: " + id);
		// console.log(JSON.stringify(hymnsJsonData));
	  var chaptersList = hymnsJsonData["tableofContents"][id]["chapters"];
	  var sectionTitle = hymnsJsonData["tableofContents"][id]["sectionTitle"];
	  listTitle.innerHTML = sectionTitle;

	  var chapterListArray = [];
	  console.log("Id: " + id);
	  for (var x=0; x<chaptersList.length; x++) {
		 var item = chaptersList[x]; 
		 var chapterTitle = item["chapterTitle"];
		 var filename = item["url"].split("/")[4].split(".")[0] + ".json";
		 console.log(filename);
		 var id = JSON.stringify({"chapterTitle": chapterTitle, "chapterIndex": x, "chapterFilename": filename});
	     var jsonObj = {"label": chapterTitle, "id": id};
	     chapterListArray.push(jsonObj);
		 
	 }

	  var callback_getHymnsTitleArray = function(chapterListArray){
			if (musicListDiv.children.length>0){
				musicListDiv.removeChild(elementList);
			}

			
			var addButtonListeners = function(){
				listmaker.addListenersToItemList2(elementList, showParagraph);
			};
			var loadButtonList = function(doc){
				elementList = doc;
				musicListDiv.appendChild(elementList);
				addButtonListeners();
				//ui.showElement(page);

			};

			var createButtonList = function(){

				listmaker.createButtonList(chapterListArray, loadButtonList);
			};
			createButtonList();	  
	  }
	  callback_getHymnsTitleArray(chapterListArray);
}
function loadSectionsList(jsonStr){
	  hymnsJsonData = JSON.parse(jsonStr);
	  listTitle.innerHTML = "Ministry of Healing";

	  var callback_getHymnsTopicsArray = function(songList){
			if (musicListDiv.children.length>0){
				musicListDiv.removeChild(elementList);
			}

			
			var addButtonListeners = function(){
				listmaker.addListenersToItemList2(elementList, showChapters);
			};
			var loadButtonList = function(doc){
				elementList = doc;
				musicListDiv.appendChild(elementList);
				addButtonListeners();
				//ui.showElement(page);

			};

			var createButtonList = function(){

				listmaker.createButtonList(songList, loadButtonList);
			};
			createButtonList();	  
	  }	  
	  
	  getSectionsTopicsArray(callback_getHymnsTopicsArray);
}
function showSortedList(id){
	  var sortType = id;
	  console.log("sort type: " + sortType);
	  if (sortType==="Title"){
		  loadAlphabetList();
	  }
	  if (sortType==="Number"){
		  loadNumberList();
	  }
	  if (sortType==="Topic"){
		  loadHymnTopicsList();
	  }
}
function sortByButton_Handler(){
		ui.hideSections(sections);
		ui.showSection(sections, 0);
		search_hymns.hideSearchPage();
		
		setActivePage("HealthPage");
	    listTitle.innerHTML = "Sort";
		var alphabetList = [{"label": "Title", "id": "Title"},
		                    {"label": "Number", "id": "Number"},
							{"label": "Topic", "id": "Topic"}];

		if (musicListDiv.children.length>0){
			musicListDiv.removeChild(elementList);
		}

		
		var addButtonListeners = function(){
			listmaker.addListenersToItemList(elementList, showSortedList);
		};
		var loadButtonList = function(doc){
			elementList = doc;
			musicListDiv.appendChild(elementList);
			addButtonListeners();
			//ui.showElement(page);

		};

		var createButtonList = function(){

			listmaker.createButtonList(alphabetList, loadButtonList);
		};
		createButtonList();	  
}

function rotaryHandler(e) {
    if (e.detail.direction === 'CW') {

    	nextParagraph();
    } else if (e.detail.direction === 'CCW') {

    	prevParagraph();
    	}
}

function goBackToMenu(){
	  var jsonObj = getLastViewedParagraph("ministryofhealing_lastViewedParagraph");	
	  console.log(JSON.stringify(jsonObj));
	  selectedSectionIndex = parseInt(jsonObj["sectionIndex"]);
	  selectedChapterIndex = 0;
	  var event = {"target": {"id": selectedSectionIndex}};
	  showChapters(event);
	  console.log("event: " + 	JSON.stringify(event));
	  ui.hideSections(sections);
	  ui.showSection(sections, 0);	
	  setActivePage("HealthPage");
}
function showTableOfContentsSections(){
	console.log("showTableOfContents");
	var path = "wgt-private/ministryofhealing";
	var filename = "ministryofhealing3.json";
	
	var callback = function(str){
		var jsonObj = JSON.parse(str);
		var tableOfContents = jsonObj["tableofContents"];
		console.log(jsonObj["bookTitle"]);
		loadSectionsList(str);
		setChapterTitles(tableOfContents);
	};
	filesystem.getJsonData(path, filename, callback) ;
}
( function () {

 
  
  function bindEvents(){
	  swipe2.init();
	  songLyricsDiv.addEventListener("swipeleft", nextParagraph);
	  songLyricsDiv.addEventListener("swiperight", prevParagraph);

	  createMusicFolder();
	  majorVersion = filesystem.getMajorPlatformVersion();
	  setActivePage("MusicPage");
	  progress.setProgress(0, "readingProgressBar");
	  progress.setProgress(0, "readingProgressBar2");

	  addPopup(sections);
	  tableOfContentsButton.addEventListener("click", showTableOfContentsSections);
	  updateButton.addEventListener("click", updateMusicList);
	  sortByButton.addEventListener("click", sortByButton_Handler);
	  backButton.addEventListener("click", goBackToMenu);
	  document.addEventListener('rotarydetent', rotaryHandler, false);



  }
  
  function init(){
	  loadResources();
	  bindEvents();
  }
  
  window.onload = function() {
	    init();
	};

  window.onunload = function() {
	  settingsData_CRUD.save(settingsData);
	};
} () );