



window.onload = function() {
	console.log("onload");
	var favoritesList,
	favoriteVerseIndex = 0,
	wordofgod = document.getElementById("wordofgod") ;
	prevVerseButton = document.getElementById("prevVerse") ;
	nextVerseButton = document.getElementById("nextVerse") ;

	function updateFavoritesPage(){
		console.log("updateFavoritesPage");

	  	var reference = favoritesList[favoriteVerseIndex]; //{"book": bookname, "chapter": c, "verse": v,  "totalVerses": Object.keys(verses).length};
		var book = reference[0];
		var chapter = reference[1];
		var verse = reference[2];
		console.log("reference bible text: " + book);
		var text = book + " " + chapter + ":" + verse;
		//var version = settingsData["bibleversion"];
		//var title = "Favorite Verses" + "<br>" + (favoriteVerseIndex+1) + " of " + favoritesList.length;
		//document.getElementById("favoritesTitle").innerHTML = title;
		//document.getElementById("switchVersionFavoritesButton").innerHTML = version.toUpperCase();
		//getBibleVerse(version, book, chapter, verse, "bibleFavoritesVerse_FavoritesPage");	
		//updateProgressBarFavorites();		
		wordofgod.textContent = text;
	}
	function loadContent(){




	    //var referenceEl = document.getElementById('reference');
		console.log("init favorite verses");
	    if (tizen.preference.exists("favoriteVerses")){
	    	console.log("you have favorites");

	    	favoritesList = JSON.parse(tizen.preference.getValue("favoriteVerses"));
	    	updateFavoritesPage();
	    	wordofgod.addEventListener('click', readVerse);
	    	prevVerseButton.style.display = "block";
	    	nextVerseButton.style.display = "block";
	    	
			
	    }else{
	    	console.log("you have no favorites");
			wordofgod.textContent = "You have no favorite verses.";
			wordofgod.removeEventListener('click', readVerse);
	    	prevVerseButton.style.display = "none";
	    	nextVerseButton.style.display = "none";
	    }

	    ///contentEl.textContent =  word;	
		
	}
	/**
	 * Runs news application.
	 * When news category is clicked, the parent news application is
	 * launched to display the news article.
	 * @param {String} title: title of the application
	 * @private
	 */

	function launchApp(message) {
	  console.log("launchApp");

		  var app = window.tizen.application.getCurrentApplication();
		  var appId = app.appInfo.id.substring(0, (app.appInfo.id.lastIndexOf('.')) );
		  var appControl = new window.tizen.ApplicationControl(message, null, null, null, null, null);
		  window.tizen.application.launchAppControl(appControl, appId,
		      function() {
		          console.log("launch application control succeed");

		      },
		      function(e) {
		          console.log("launch application control failed. reason: " + e.message);

		      },
		      null);
	  

	}
	
	function readVerse(e){
		console.log("readVerse: " + favoriteVerseIndex.toString());
		
        launchApp("readVerse_" + favoriteVerseIndex.toString());

	}
	
	function nextVerse(){

		if (favoriteVerseIndex<favoritesList.length-1){
			favoriteVerseIndex+= 1;
		}
		console.log("nextVerse: " + favoriteVerseIndex );
		updateFavoritesPage();
		
	}
	function prevVerse(){
		if (favoriteVerseIndex>0){
			favoriteVerseIndex-= 1;
		}	
		console.log("prevVerse: " + favoriteVerseIndex );

		updateFavoritesPage();
	}	
	
	function addVerse(e){
		console.log("addVerse: " + e.target.textContent);

        launchApp(e.target.textContent);		
	}

    function handleVisibilityChange() {
        if (document.visibilityState === "visible") {
	    	wordofgod.removeEventListener('click', readVerse);
        	loadContent();

        }else{
        	
	    	wordofgod.removeEventListener('click', readVerse);
	    	loadContent();

        }
    }
	loadContent();
	prevVerseButton.addEventListener('click', prevVerse);
	nextVerseButton.addEventListener('click', nextVerse);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    document.getElementById("add").addEventListener('click', addVerse);
    //add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });
};