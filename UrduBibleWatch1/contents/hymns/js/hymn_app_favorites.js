var  deleteMusicButton = document.querySelector(".deleteMusicButton"), 
  addToFavoritesButton = document.querySelector(".addToFavoritesButton"),
  deleteFromFavoritesButton = document.querySelector(".deleteFromFavoritesButton"),
  favoritesListButton = document.querySelector(".favoritesListButton");
  

var hymn_app_favorites = (function(){

	  this.getFavoriteSongsList = function (){
		     var preferenceKey = "favoriteHymns";
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
		  var hymnObj = hymnsJsonData[songfilename];
		  var title = hymnObj["title"];
		  
		  var label = title;
	      var preferenceKey = "favoriteHymns";
	      var key = title;
	      var value = songfilename;

	      var callback = function(){
	       
	      setAddRemoveFavoriteIcon(songfilename);

	      };
	      console.log("add to favorites: {" + key + ": " + value);
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
	  
	  this.showFavoritesList = function(){
		  listTitle.innerHTML = "Favorite Hymns";
	      var preferenceKey = "favoriteHymns";
		  var favoritesList = favorites.get(preferenceKey);
		  console.log(JSON.stringify(favoritesList));
		  var songs = Object.keys(favoritesList);
		  var songList = [];
		  for (var x=0; x<songs.length; x++){
			  var title = songs[x];
			  var hymnKey = favoritesList[title];
			  var jsonObj = {"label": title, "id": hymnKey };
			  songList.push(jsonObj);
		  }
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
		  
	  };
	  

	return this;
	
}());

addToFavoritesButton.addEventListener("click", hymn_app_favorites.addToFavorites);
deleteFromFavoritesButton.addEventListener("click", hymn_app_favorites.deleteSongFromFavorites);
favoritesListButton.addEventListener("click", hymn_app_favorites.showFavoritesList);

