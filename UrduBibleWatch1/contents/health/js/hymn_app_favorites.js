var  deleteMusicButton = document.querySelector(".deleteMusicButton"), 
  addToFavoritesButton = document.querySelector(".addToFavoritesButton"),
  deleteFromFavoritesButton = document.querySelector(".deleteFromFavoritesButton"),
  favoritesListButton = document.querySelector(".favoritesListButton");
  

var hymn_app_favorites = (function(){

	  this.getFavoriteSongsList = function (){
		     var preferenceKey = "favoriteMinistryOfHealingQuotes";
			  var favoritesList = favorites.get(preferenceKey);
			  console.log(JSON.stringify(favoritesList));
			  return favoritesList;
	  };
	  this.setAddRemoveFavoriteIcon = function(songfilename){
		  var favoritesList = this.getFavoriteSongsList();
		  var hymnObj = hymnsJsonData[songfilename];
		  var title = hymnObj["title"];
		  console.log("setAddRemoveFavoriteIcon favoritesList: " + JSON.stringify(favoritesList));
		  console.log("setAddRemoveFavoriteIcon songfilename: " + title);
	      if (title in favoritesList ){
	    	  console.log("song exists in favorites");
	    	  ui.hideElement(addToFavoritesButton);
	    	  ui.showElement(deleteFromFavoritesButton);
	      }else{
	    	  ui.hideElement(deleteFromFavoritesButton);
	    	  ui.showElement(addToFavoritesButton);
	      }
	  };
	  
	  this.initFavoriteIcon = function(){
		  this.setAddRemoveFavoriteIcon(songfilename);
	  };
	
	  this.addToFavorites = function(){
		  //var hymnObj = hymnsJsonData[songfilename];
		  var title = songLyricsDiv.innerText.substring(0,20) + "...";
		  var chapterTitle = chapterTitleEl.innerHTML;
          var jsonObj = JSON.stringify({"label": title, "chapterFilename": chapterFilename , "chapterTitle": chapterTitle, "paragraphIndex": paragraphIndex}); 
		  var label = title;
	      var preferenceKey = "favoriteMinistryOfHealingQuotes";
	      var key = chapterFilename+paragraphIndex;
	      console.log("key: " + key);
	      var value = jsonObj;

	      var callback = function(){
	       
	      //setAddRemoveFavoriteIcon(songfilename);

	      };
	      console.log("add to favorites: {" + key + ": " + JSON.stringify(value));
	      favorites.add(label, preferenceKey, key, value, callback);
	      
			
	  };
	  this.deleteSongFromFavorites = function(){
	      var preferenceKey = "favoriteHymns";
		  var hymnObj = hymnsJsonData[songfilename];
		  var title = hymnObj["title"];
	      var itemToRemove = title;
	
	      var callback = function(){
	  
	          setAddRemoveFavoriteIcon(songfilename);
	      };
	      favorites.remove(preferenceKey, itemToRemove, callback);	  
	  };
	  
	  var showFavoriteParagraph = function(event){
		    paragraphIndex = JSON.parse(event.target.id).paragraphIndex;
		    console.log("paragraphIndex: " + paragraphIndex);
			showSong(event);
		    console.log(event.target.id);
	  };
	  this.showFavoritesList = function(){
		  listTitle.innerHTML = "Favorite Quotes";
	      var preferenceKey = "favoriteMinistryOfHealingQuotes";
		  var favoritesList = favorites.get(preferenceKey);
		  console.log(JSON.stringify(favoritesList));
		  var paragraphs = Object.keys(favoritesList);
		  var paragraphList = [];
		  for (var x=0; x<paragraphs.length; x++){
			  var key = paragraphs[x];
			  var paragraphObj = JSON.parse(favoritesList[key]);
              var title = paragraphObj["label"];			  
			  var jsonObj = {"label": title, "id": JSON.stringify(paragraphObj) };
			  paragraphList.push(jsonObj);
		  }
			if (musicListDiv.children.length>0){
				musicListDiv.removeChild(elementList);
			}

			
			var addButtonListeners = function(){
				listmaker.addListenersToItemList2(elementList, showFavoriteParagraph);
			};
			var loadButtonList = function(doc){
				elementList = doc;
				musicListDiv.appendChild(elementList);
				addButtonListeners();
				//ui.showElement(page);

			};

			var createButtonList = function(){

				listmaker.createButtonList(paragraphList, loadButtonList);
			};
			createButtonList();	  
		  
	  };
	  

	return this;
	
}());

addToFavoritesButton.addEventListener("click", hymn_app_favorites.addToFavorites);
deleteFromFavoritesButton.addEventListener("click", hymn_app_favorites.deleteSongFromFavorites);
favoritesListButton.addEventListener("click", hymn_app_favorites.showFavoritesList);

