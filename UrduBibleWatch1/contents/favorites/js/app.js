var book, chapter, verse, pages, screenSections,
isFullScreen,
pageID = "page_FavoritesPage",
settingsData,
bookData = {"kjv": null},
switchVersionButton,
bibleVersionList = [],
upperCaseBibleVersionList;

window.onload = function() {
    settingsData = {
            "bibleversion": "kjv",
            "background": "black"
        };
    

	var TRANSLATIONS = LANG_JSON_DATA["TRANSLATIONS"]["FAVORITEVERSES_PAGE"];
    var screenSections = document.querySelectorAll(".section");
    pages = document.querySelectorAll(".page");
    
    var favoritesList = null;
    var prevSlideShowFavoritesVerse = document.getElementById("prevSlideShowFavoritesVerse");
    var nextSlideShowFavoritesVerse = document.getElementById("nextSlideShowFavoritesVerse");
    var favoriteVerseIndex = 0;
    if (tizen.preference.exists("favoriteVerseIndex")){
    	favoriteVerseIndex = tizen.preference.getValue("favoriteVerseIndex");
    }
    var selectedBibleToDownload;
    var references = null;
    var currentID;
    var bibles = null;
    var bibleBookTitlesInDifferentLanguages = null;
    var pageId,
        localeLanguage,
        fontSize,
        planVerseCount = 0,
        virtualrootDownload = "wgt-private",
        bibleDownloadfolder = "zipbibles";
    
    function getCurrentFavoriteVerse() {
        var reference = favoritesList[favoriteVerseIndex]; //{"book": bookname, "chapter": c, "verse": v,  "totalVerses": Object.keys(verses).length};

        return reference;
    }

    function getBibleVerse (version, book, chapter, verse, elementID) {
        //console.log("getBibleVerse");
        //var version = "kjv";
        var filename = book.replace(/\s/g, "_") + ".js";
        console.log(version + '/' + filename);
        //var chapter = "1";
        //var verse = "1";

        var updateDisplay = function() {
            var wordOfGod = bookData["book"][chapter]["chapter"][verse]["verse"];
            if (wordOfGod == "") {
			   wordOfGod = LANG_JSON_DATA["TRANSLATIONS"]["COMMON"]["verseNotExist"];
            }
            if (wordOfGod === "verse doesn't exist in this bible version") {
 			   wordOfGod = LANG_JSON_DATA["TRANSLATIONS"]["COMMON"]["verseNotExist"];
             }
            
            var reference = book + " " + chapter + ":" + verse;

            if (book==="Song of Songs"){
            	reference = "Song of Solomon" + " " + chapter + ":" + verse;
	            }
            if(LANG_JSON_DATA["VERSIONLANGUAGE"][settingsData["bibleversion"]]!=="english"){
            	var languageCode = LANG_JSON_DATA["VERSIONLANGUAGE"][settingsData["bibleversion"]];

            	var bookKey = book.replace(/ /g, "-");
	            if (book==="Song of Songs"){
	               bookKey = "Song-of-Solomon";	
	            }
	            var bookLocale;
	            console.log("languageCode: " + languageCode);
	            console.log("bookKey: " + bookKey);
	            console.log("bibleBookTitlesInDifferentLanguages: " + bibleBookTitlesInDifferentLanguages);

	            try{
	            	bookLocale = bibleBookTitlesInDifferentLanguages[bookKey][languageCode];
	                reference = bookLocale + " " + chapter + ":" + verse;

	            }catch(e){
	            	console.log(e);
	            }

                  	
            }

            document.getElementById(elementID).innerHTML = "<span style='color: yellow;'>" + reference + "</span><br>" + wordOfGod;
            document.getElementById(elementID+"2").innerHTML = "<span style='color: yellow;'>" + reference + "</span><br>" + wordOfGod;


            document.getElementById(elementID).style.fontSize = fontSize + "px";
            document.getElementById(elementID+"2").style.fontSize = fontSize + "px";
            tts.play(wordOfGod);

            console.log("fontSize of " + elementID + ": " + document.getElementById(elementID).style.fontSize); 

        };
        var getBook = function() {
            // console.log("get book: " + version);
            var readAsJson = function(str) {
                //	console.log("success reading " + filename);
            	if(str==="error"){
             	   if (book === "Song of Solomon") {
                       console.log("book is Song of Solomon, change to Song of Songs");
                       var bookchange = "Song of Songs";
                       getBibleVerse(version, bookchange, chapter, verse, elementID);
                   }           		
            	}else{
                    updateDisplay();

            	}



            }
            bookData = {};
            FILE_URL = "../../zipbibles/"+version + "/" + filename ;
            filesystem.loadJS(FILE_URL, "bookData", false, readAsJson);
            var getJsonData = function() {
                var onSuccess = function(dir) {
                    //	  console.log("on sucess: " );
                    var file_obj = dir.resolve(filename);
                    file_obj.readAsText(readAsJson, null, 'UTF-8');
                }

                var onError = function(e) {
                    console.log(e);
                }
                try {
                    var path = "wgt-private/" + version;
                   //tizen.filesystem.resolve("wgt-private/" + version, onSuccess, onError, "r");

                } catch (e) {
                    console.log(e);
                }

            };
            var extractSuccessCallback = function() {
                console.log('File extracted');
                getJsonData();
            }

            var extractErrorCallback = function(error) {
                //  console.log('extract error: ' + error.message);
                getJsonData();
            };

            var getEntrySuccess = function(entry) {
                //	console.log(entry);
                entry.extract('wgt-private', extractSuccessCallback, extractErrorCallback);
            }

            var getEntryError = function(error) {
                console.log(error);
                if (book === "Song of Solomon") {
                    console.log("book is Song of Solomon, change to Song of Songs");
                    var bookchange = "Song of Songs";
                    getBibleVerse(version, bookchange, chapter, verse, elementID);
                }

            }
            var openZipFileSuccess = function(archive) {
                //	console.log(archive);
                //  console.log('ArchiveFile mode: ' + archive.mode);
                myArchive = archive;
                //myArchive.getEntries(listSuccess);


                archive.getEntryByName(version + '/' + filename, getEntrySuccess, getEntryError);

            };

            var openZipFileError = function(error) {
                console.log("error: " + error);
            }
            if (version == "kjv") {
                var zipFilePath = "wgt-package/kjv.zip";
               //tizen.archive.open(zipFilePath, 'r', openZipFileSuccess, openZipFileError);

            } else {
                var zipFilePath = virtualrootDownload + "/" + bibleDownloadfolder + "/" + version + ".zip";
               //tizen.archive.open(zipFilePath, 'r', openZipFileSuccess, openZipFileError);

            }
            

        };


        var bibleVerseLoader = function() {

            try {
                //   console.log(bookData[version][book]["book"][chapter]["chapter"][verse]["verse"]);
                updateDisplay();

            } catch (e) {
                //  console.log(e.message);
                getBook();
            }
        };
    /*    var loadBibleBooksInDifferentLanguages = function() {
            var path = "wgt-package";
            var filename = "booksOfTheBibleInDifferentLanguages.json";
            var readAsJson = function(str) {
                jsonObj = JSON.parse(str);
                bibleBookTitlesInDifferentLanguages = jsonObj;
                bibleVerseLoader();
                console.log("readAsJson: " + jsonObj["Genesis"]["as-in"]);
            }
            FILE_URL = "../../booksOfTheBibleInDifferentLanguages.js";
            filesystem.loadJS(FILE_URL)
            filesystem.getJsonData(path, filename, readAsJson);
        };*/
        var onLocaleSuccessCallback = function(locale) {
            ////console.log('The locale language is ' + JSON.stringify(locale.language));
            localeLanguage = locale.language;
            console.log("localeLanguage: " + localeLanguage);
            if (bibleBookTitlesInDifferentLanguages == null) {
            	var callbackloadBibleBooksInDifferentLanguages = function(){
            		bibleBookTitlesInDifferentLanguages = booksOfTheBibleInDifferentLanguagesJS;
                    bibleVerseLoader();

            	}
                localization.loadBibleBooksInDifferentLanguages(callbackloadBibleBooksInDifferentLanguages);

            } else {
                bibleVerseLoader();

            }

        };


        var getLocalLanguageSetting = function() {
            tizen.systeminfo.getPropertyValue('LOCALE', onLocaleSuccessCallback);
            //tizen.systeminfo.getPropertyValueArray("LOCALE", successArrayCB);
        };
        getLocalLanguageSetting();
    }
    function updateFavoritesPage() {
        var reference = favoritesList[favoriteVerseIndex]; //{"book": bookname, "chapter": c, "verse": v,  "totalVerses": Object.keys(verses).length};
        book = reference[0];
        chapter = reference[1];
        verse = reference[2];

        var version = settingsData["bibleversion"];
        var title = LANG_JSON_DATA["TRANSLATIONS"]["FAVORITEVERSES_PAGE"]["title"] + "<br>" + (favoriteVerseIndex + 1) + LANG_JSON_DATA["TRANSLATIONS"]["COMMON"]["of"] + favoritesList.length;
        document.getElementById("favoritesTitle").innerHTML = title;
        //document.getElementById("switchVersionFavoritesButton").innerHTML = version.toUpperCase();
        getBibleVerse(version, book, chapter, verse, "bibleFavoritesVerse_FavoritesPage");
        //getBibleVerse(version, book, chapter, verse, "bibleFavoritesVerse_FavoritesPage2");

        updateProgressBarFavorites();
		tizen.preference.setValue("favoriteVerseIndex", favoriteVerseIndex);

    }
    prevSlideShowFavoritesVerse.addEventListener("click", function() {
        console.log("prevSlideShowFavoritesVerse button");

        if (favoriteVerseIndex > 0) {
            favoriteVerseIndex -= 1;
            updateFavoritesPage();

        }

    });

    nextSlideShowFavoritesVerse.addEventListener("click", function() {
        console.log("nextSlideShowFavoritesVerse button");


        if (favoriteVerseIndex < favoritesList.length - 1) {
            favoriteVerseIndex += 1;
            updateFavoritesPage();

        }

    });
    
    function rotaryHandler(e) {
        if (e.detail.direction === 'CW') {

        	nextSlideShowFavoritesVerse.click();
        } else if (e.detail.direction === 'CCW') {

        	prevSlideShowFavoritesVerse.click();
        	}
    }
    var updateProgressBarFavorites = function() {
        var totalFavoriteVerses = favoritesList.length;
        var percent = ((favoriteVerseIndex + 1) / totalFavoriteVerses) * 100;
        console.log("percent favorites : " + percent);
        progress.setProgress(percent, "progressFavorites");
    };

    function refreshFavoritesAfterVersionChange() {
        console.log("searchResultsDisplay button");
        updateFavoritesPage();
    }

    function listener_favoritesPage() {
        console.log("favorites page");


        if (favoritesList != null) {

            updateFavoritesPage();
        } else {
            try {
                favoritesList = JSON.parse(tizen.preference.getValue("favoriteVerses"));
            } catch (e) {
                console.log(e.message);
                favoritesList = null;
            }
            if (favoritesList != null) {
    
                updateFavoritesPage();
            } else {
                var title = LANG_JSON_DATA["TRANSLATIONS"]["FAVORITEVERSES_PAGE"]["title"];
                document.getElementById("favoritesTitle").innerHTML = title;
                document.getElementById("bibleFavoritesVerse_FavoritesPage").innerHTML = LANG_JSON_DATA["TRANSLATIONS"]["FAVORITEVERSES_PAGE"]["noFavoriteVerses"];



            }

        }

    }
    

    document.addEventListener('rotarydetent', rotaryHandler, false);
    
	function changeFontSize(){
		console.log("change font size");
		settingsData["fontSize"] = settingsData["fontSize"]  + 2;
		if (settingsData["fontSize"]>40){
			settingsData["fontSize"] = 14;
		}
	    ui.setFontSize("bibleFavoritesVerse_FavoritesPage", settingsData["fontSize"]);	
	    ui.setFontSize("bibleFavoritesVerse_FavoritesPage2", settingsData["fontSize"]);	

	    settingsData_CRUD.update(settingsData);
	}

	document.querySelector(".fontResizeButton").addEventListener("click", changeFontSize);

	
	function goToBrowsePage(){
		console.log("book: " + book);
		if (favoritesList!=null){
	        var browseSettings = {};
	        browseSettings["book"] = book;
	        browseSettings["chapter"] = chapter;
	        browseSettings["verse"] = verse;
	        settingsData_CRUD.saveToPreferences("browseSettingsBrowsePage", browseSettings);
	        tizen.preference.setValue("backToFavoritesPage", true);
	    	tizen.preference.setValue("fromOptionsPage", false);

		    window.location.href = "../browse/index.html";			
		}
}
document.querySelector(".goToBrowseButton").addEventListener("click", goToBrowsePage);


function deleteItem(){
  	var reference = favoritesList[favoriteVerseIndex]; //{"book": bookname, "chapter": c, "verse": v,  "totalVerses": Object.keys(verses).length};
	var book = reference[0];
	var chapter = reference[1];
	var verse = reference[2];
	var textToDelete = book + " " + chapter + ":" + verse;
	confirmDelete = confirm(TRANSLATIONS["confirmDelete"].replace("[***]", textToDelete));// "Are you sure you want to delete "+textToDelete+"?");
	if (confirmDelete){
		console.log(confirmDelete);
		favoritesList.splice(favoriteVerseIndex, 1);
		console.log("total favorites list: " + favoritesList.length);
		if(favoritesList.length==0){
			favoritesList=null;
			tizen.preference.remove('favoriteVerses');
			listener_favoritesPage();
			
		}
		else {
			if(favoriteVerseIndex!=0){
				favoriteVerseIndex -= 1;
			}
			updateFavoritesPage();
    		tizen.preference.setValue("favoriteVerses", JSON.stringify(favoritesList));
    		//alert(TRANSLATIONS["deletedSuccess"].replace("[***]", textToDelete));//textToDelete+"\nhas been deleted.");
		}			
	}
}

addPopup(pages);
function setFullScreen(){
	console.log("setFullScreen");
	ui.hideSections(screenSections);
	ui.showSection(screenSections, 1);
    setActivePage("popup");	
    isFullScreen = true;
    settingsData["fullScreen"] = isFullScreen;
}

document.querySelector(".maximizeButton").addEventListener("click", setFullScreen);

document.getElementById("deleteButtonFavorites").addEventListener("click", deleteItem);

function openClock(){
	settingsData["fullScreen"] = true;
	console.log("fullScreen: " + settingsData["fullScreen"]);
	console.log("window.location.href: " + window.location.href);
	tizen.preference.setValue("goBackToThisFromClock", window.location.href);
	settingsData_CRUD.update(settingsData);
    window.location.href = "../clock/index.html";

}
document.querySelector(".clockIcon").addEventListener("click", openClock);

function setSettingsData(jsonObj) {
    settingsData = jsonObj;
    bible.setVersionButtonText();
    isFullScreen = settingsData["fullScreen"];
    listener_favoritesPage();
    if (isFullScreen){
    	setFullScreen();
    }
    ui.setFontSize("bibleFavoritesVerse_FavoritesPage", settingsData["fontSize"]);	
    ui.setFontSize("bibleFavoritesVerse_FavoritesPage2", settingsData["fontSize"]);	
}

function bibleChangeVersionShortcut(){
	if (bibleVersionList.length>1){
		 bible.changeBibleVersion();
		 var version = settingsData["bibleversion"];
		 bookData = {version: {}};
		 bible.setVersionButtonText();
		 updateFavoritesPage();

		
	}else{
		updateFavoritesPage();
	}
}
switchVersionButton = document.querySelector(".switchVersionButton");
switchVersionButton.addEventListener("click", bible.switchVersionHandler);
bible.getListOfBibleVersions();
var normalScreenVerseText = document.querySelector(".normalScreenVerseText");
var fullScreenVerseText = document.querySelector(".fullScreenVerseText");

normalScreenVerseText.addEventListener("click", bibleChangeVersionShortcut );
fullScreenVerseText.addEventListener("click", bibleChangeVersionShortcut);

function callbackSwipeEvent(direction){
	if (direction==="left"){
		nextSlideShowFavoritesVerse.click();
	}else{
		prevSlideShowFavoritesVerse.click();
	}
}
swipeEvent(normalScreenVerseText, callbackSwipeEvent);
swipeEvent(fullScreenVerseText, callbackSwipeEvent);


settingsData_CRUD.get(setSettingsData);
ui.initBackgound();

arrows = document.querySelectorAll(".arrow");	
ui.showArrows(arrows);	

};


window.onunload = function() {
    if (document.getElementById("minScreen").style.display === "block") {
        settingsData["fullScreen"] = false;
    }
    settingsData_CRUD.update(settingsData);
    tts.cancel();
}
