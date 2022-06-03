var searchButton = document.querySelector(".searchButton"),
    searchInputText = document.querySelector(".searchInputText"),
    searchSection = document.getElementById("searchSection"),
    goButtonSearch = document.getElementById("goButtonSearch"),
    hymnSearchInputField = document.querySelector(".hymnSearchInputField"),
    settingOptionDivs = document.querySelectorAll(".settingOption");

function getChapterTitle(filename){
	//console.log(Object.keys(chapterTitleList));
    //console.log("getChapterTitle for "+ filename);
    //console.log(chapterTitleList[filename]["chapterTitle"]);
	return chapterTitleList[filename]["chapterTitle"];
}
var search_hymns = (function(){

	this.hideSearchPage = function(){
		ui.hideSections(settingOptionDivs);
		ui.showSection(settingOptionDivs, 0);

	};

	this.showSearchPage = function(){
		ui.hideSections(settingOptionDivs);
		ui.showSection(settingOptionDivs, 1);
		listTitle.innerHTML = "Search Hymn";
	};
	
    this.inputTextFocus = function(e) {
    	console.log("inputTextFocus");
        searchInputText.value = "";

        if(majorVersion===2){
    		hymnSearchInputField.style.top = "40%";

        }

		

    };
    this.inputTextBlur = function(e) {
    	console.log("inputTextBlur");
		hymnSearchInputField.style.top = "50%";

    }; 
    
    function showFoundParagraph(event){

  	  var jsonObj = JSON.parse(event.target.id);
  	  paragraphIndex = jsonObj["paragraphIndex"] ;

        var path = "wgt-private/ministryofhealing";
        chapterFilename = jsonObj["filename"];
        chapterTitle = jsonObj["chapterTitle"];
        chapterTitleEl.innerHTML = chapterTitle;
        console.log("chapterFilename: " + chapterFilename );
        console.log("paragraphIndex: " + paragraphIndex );
        
        
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
		  saveLastViewedParagraph(chapterFilename, chapterTitle, paragraphIndex);
  		  //hymn_app_favorites.initFavoriteIcon();
        };
        filesystem.getJsonData(path, chapterFilename, callback);
  	
  	

  }
    this.getSearchResults = function(){

   
    	var showListOfSongs = function(songList){
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
    					listmaker.addListenersToItemList2(elementList, showFoundParagraph);
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
    		  this.hideSearchPage();
    	};
    	
       	var callbackGetJsonData = function(response){
       		var hymnsJsonData = JSON.parse(response);
            var keyword = searchInputText.value;
        	const asArray = hymnsJsonData;
           	const results = asArray.filter(getMatchingSongObj);
           	var songList = [];
        	function getMatchingSongObj(item) {
        	   	  //console.log("getMatchingSongObj");	
        	      return item["text"].toLowerCase().indexOf(keyword.toLowerCase())!=-1;
        	}
           	for (var x=0; x<results.length; x++){
           	 var jsonItem = results[x];
           	 var filename = jsonItem["filename"];
           	 var chapterTitle = getChapterTitle(filename);
           	 var key = JSON.stringify({"filename": filename , "chapterTitle": chapterTitle, "paragraphIndex": jsonItem["paragraphIndex"]}); 
           	 var title = results[x]["text"].substring(0, 20) + "...";
             var jsonObj = {"label": title, "id": key};
		     songList.push(jsonObj);
           	}
           	console.log(songList);  

           	showListOfSongs(songList);
       	};
       	filesystem.getJsonData("wgt-private/ministryofhealing", "ministryofhealing_allParagraphs.json", callbackGetJsonData); 

    };
	return this;
})();
search_hymns.hideSearchPage();
searchInputText.addEventListener('focus', search_hymns.inputTextFocus, true);
searchInputText.addEventListener('blur', search_hymns.inputTextBlur, true);

searchButton.addEventListener("click", search_hymns.showSearchPage);
goButtonSearch.addEventListener("click", search_hymns.getSearchResults);