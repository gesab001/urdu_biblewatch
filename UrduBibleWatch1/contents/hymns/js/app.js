/**
 * 
 */


var isFullScreen = false,
hymnsJsonData,
settingsData,
songFilename,
description = document.getElementById("downloadBibleStatus"),
descriptionNoConnection = document.getElementById("downloadBibleStatusNoConnection"),
descriptionDownloadFail = document.getElementById("downloadHymnStatusFail"),
musicListJson,
hymnsByTopics,
allSongsList = [],
songList,
totalSongs,
elementList,
songCountTitle = document.getElementById("SongCountTitle"),
listTitle = document.getElementById("listTitle"),
songLyricsDiv = document.getElementById("songLyrics"),
musicListDiv =  document.getElementById("MusicList"),
musicListButton = document.querySelector(".musicListButton"),
sortByButton = document.querySelector(".sortByButton"),

sections = document.querySelectorAll(".section"),
updateButton = document.querySelector(".updateButton"),

majorVersion;

function showSong(event){

	  console.log("filename: " + event.target.id);
      var id = event.target.id.replace("____", " ");
	  
	  var hymnKey = id;

	  var hymnObj = hymnsJsonData[hymnKey];
	  songfilename = hymnKey;
	  var totalSongs = Object.keys(hymnsJsonData).length;
	  var title = hymnObj["title"];
	  var number = hymnObj["number"];
	  var verses = hymnObj["verses"];
	  console.log("label: " + event.target.innerHTML);
	  //songIndex = getSongIndex(event.target.id);
	  songCountTitle.innerHTML = number + " of " + totalSongs;

	  var htmlText = title + "<br><br>";

	  for (v in verses){
		  var verseTitle = verses[v]["verse_title"];
		  htmlText = htmlText + verseTitle + "<br>";
		  console.log(htmlText);
		  var lines = verses[v]["lines"];
		  for (l in lines){
			  var lineText = lines[l];
			  htmlText = htmlText + lineText + "<br>";
			  
		  }
		  htmlText = htmlText + "<br><br>";
		  
	  }
	  songLyricsDiv.innerHTML = "";
	  songLyricsDiv.innerHTML = htmlText;//+JSON.stringify(verses);

	  //checkIfSongIsAvailable(callback);
	  //progress.setProgress(0, "songProgressBar");
	  ui.hideSections(sections);
	  ui.showSection(sections, 1);
	  setActivePage("popup");
	  hymn_app_favorites.initFavoriteIcon();

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
 	    listTitle.innerHTML = "Hymns By Title";
		ui.hideSections(sections);
		ui.showSection(sections, 0);
		setActivePage("HymnsPage");
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

function downloadMusicFile(source, callbackSuccessDownload){
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
			setActivePage("HymnsPage");
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
				setActivePage("HymnsPage");
	        
		
		};
	
	    var destination = "wgt-private/hymns";
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

function getHymnsTopicsArray(callback){
	  
	  var callbackGetJsonData = function(jsonStr){
		 hymnsJsonData = JSON.parse(jsonStr);
       var hymnTopics = [];
       var topicsToAdd = [];
       hymnsByTopics = {};
		 for (key in hymnsJsonData){
			 var topic = hymnsJsonData[key]["topic"][0];
			 var title =  hymnsJsonData[key]["title"];
			 if (topic in hymnsByTopics ){
				 var jsonObj = {};
				 jsonObj[key] = title;
				 hymnsByTopics[topic].push(jsonObj); 
			 }else{
				 hymnsByTopics[topic] = [];
				 var jsonObj = {};
				 jsonObj[key] = title;
				 hymnsByTopics[topic].push(jsonObj);
			 }
			 if(topicsToAdd.indexOf(topic)===-1){
				 topicsToAdd.push(topic);
			 }

		 }
		 topicsToAdd.sort();
		 
		 for (var x=0; x<topicsToAdd.length; x++){
	         var topic = topicsToAdd[x];
			 var label =  topic;
			 var id =  topic;
			 var jsonObj = {"label": label, "id": id };
			 console.log("jsonObj: " + JSON.stringify(jsonObj));
		     hymnTopics.push(jsonObj);
		 }		 
		 console.log(JSON.stringify(hymnTopics));

		 callback(hymnTopics);
	  };
	  filesystem.getJsonData("wgt-private/hymns/", "hymns-youtube.json", callbackGetJsonData); 
	  
}

function getSongsByTopic(){
	  var id = event.target.id;
	  console.log("getSongsByTopic id: " + id);
		 console.log(JSON.stringify(hymnsByTopics));

	  var hymnSongsList = hymnsByTopics[id];
	  console.log("hymnSongsList: " + JSON.stringify(hymnSongsList));
	  var songList = [];
	  console.log("Id: " + id);
	  for (var x=0; x<hymnSongsList.length; x++) {
		 var key = Object.keys(hymnSongsList[x])[0]; 
		 var title = hymnSongsList[x][key];
	     var jsonObj = {"label": title, "id": key};
	     songList.push(jsonObj);
		 
	 }
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
	 songList.sort(function (title1, title2)  {
		  return compareObjects(title1, title2, 'label');
		});
		 
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
	  callback_getHymnsTitleArray(songList);
}
function loadHymnTopicsList(){
	  listTitle.innerHTML = "Hymns by Topic";

	  var callback_getHymnsTopicsArray = function(songList){
			if (musicListDiv.children.length>0){
				musicListDiv.removeChild(elementList);
			}

			
			var addButtonListeners = function(){
				listmaker.addListenersToItemList2(elementList, getSongsByTopic);
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
	  
	  getHymnsTopicsArray(callback_getHymnsTopicsArray);
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
		
		setActivePage("HymnsPage");
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

function loadHymnResources(){
	  
	  var callbackFileExists = function(isFileExists){
		  console.log("callbackFileExists: " + isFileExists );  
		  if (isFileExists){
			  loadAlphabetList();
			  maximizeScreen.initFullScreen();

		  }else{
			  var confirmDownload = confirm("You \n have no hymns. \n Would you like \n to download \n one?");
			  if(confirmDownload){
				  var callbackSuccessDownload = function(response){
					  
				       console.log("callbackSuccessDownload: " + callbackSuccessDownload);  
				       loadAlphabetList();
					   maximizeScreen.initFullScreen();

			      };
				  var source = "https://raw.githubusercontent.com/gesab001/hymns/master/src/assets/hymns-youtube.json";
				  downloadMusicFile(source, callbackSuccessDownload);
			  }

		  }
	  };
	  filesystem.fileExists("wgt-private", "hymns", "hymns-youtube.json", callbackFileExists);
}
( function () {

 
  
  function bindEvents(){
	  createMusicFolder();
	  majorVersion = filesystem.getMajorPlatformVersion();
	  setActivePage("MusicPage");
	  progress.setProgress(0, "songProgressBar");
	  addPopup(sections);
	  musicListButton.addEventListener("click", loadAlphabetList);
	  updateButton.addEventListener("click", updateMusicList);
	  sortByButton.addEventListener("click", sortByButton_Handler);
  }
  
  function init(){
	  loadHymnResources();
	  bindEvents();
  }
  
  window.onload = function() {
	    init();
	};

  window.onunload = function() {
	  settingsData_CRUD.save(settingsData);
	};
} () );