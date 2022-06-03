var searchButton = document.querySelector(".searchButton"),
    searchInputText = document.querySelector(".searchInputText"),
    searchSection = document.getElementById("searchSection"),
    goButtonSearch = document.getElementById("goButtonSearch"),
    hymnSearchInputField = document.querySelector(".hymnSearchInputField"),
    settingOptionDivs = document.querySelectorAll(".settingOption");
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
    		  this.hideSearchPage();
    	};
    	
       	var callbackGetJsonData = function(response){
       		var hymnsJsonData = JSON.parse(response);
            var keyword = searchInputText.value;
        	const asArray = Object.keys(hymnsJsonData);
           	const results = asArray.filter(getMatchingSongObj);
           	var songList = [];
        	function getMatchingSongObj(item) {
        	   	  //console.log("getMatchingSongObj");	
        	      return item.toLowerCase().indexOf(keyword.toLowerCase())!=-1;
        	}
           	for (var x=0; x<results.length; x++){
           	 var key = results[x]; 
			 var title = hymnsJsonData[key]["title"];
		     var jsonObj = {"label": title, "id": key};
		     songList.push(jsonObj);
           	}
           	console.log(songList);  

           	showListOfSongs(songList);
       	};
       	filesystem.getJsonData("wgt-private/hymns/", "hymns-youtube.json", callbackGetJsonData); 

    };
	return this;
})();
search_hymns.hideSearchPage();
searchInputText.addEventListener('focus', search_hymns.inputTextFocus, true);
searchInputText.addEventListener('blur', search_hymns.inputTextBlur, true);

searchButton.addEventListener("click", search_hymns.showSearchPage);
goButtonSearch.addEventListener("click", search_hymns.getSearchResults);