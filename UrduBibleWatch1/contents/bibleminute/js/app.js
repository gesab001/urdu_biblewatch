//HOME PAGE JAVASCRIPT

//GENERAL COMPONENTS
var page,
    pageID,
    clockButton,
    sections,
    arrows,
    prevVerseButton,
    nextVerseButton,
    switchVersionButton,
    bibleVersionList = [],
    upperCaseBibleVersionList,
    bibleverse,
    bibleverse2,
    fontResizeButton,
    maximizeButton,
    references,
    settingsData,
    bibleBookTitlesInDifferentLanguages,
    bookLocale,
    book,
    chapter,
    verse,
    wordOfGod,
    bookData,
    totalVerses,
    currentID,
    referenceIndex,
    isFullScreen = false,

    version, //= settingsData["bibleversion"];
    pathToZipFile, //= "wgt-package/kjv.zip";
    pathToBible,
    fileToExtract, //= stringMaker.getFileToExtract(version, book);
    filename, //stringMaker.getBookJsonFilename("Song of Songs");
    
    //BIBLE MINUTE COMPONENTS
    moreOptionsContainer,
    goToBrowseButton,
    backButton,
    favoritesButton,
    timer,
    timerInterval;

function setCurrentID() {
    var newID = bible.getCurrentID(totalVerses);
    if (newID != currentID) {
        currentID = newID;
        bible.getReferenceMinute(currentID);
        getMinuteTitle(currentID, totalVerses);
    }
}

function getMinuteTitle(currentID, totalVerses) {
    var title = currentID + LANG_JSON_DATA["TRANSLATIONS"]["COMMON"]["of"] + totalVerses;
    bible.setTitle(title);

}

function updateProgressBar() {
    var percent = (timer.getSeconds() / 60) * 100;
    progress.setProgress(percent, "progressBar");
}

function startTimer() {

    timer.start(setCurrentID, updateProgressBar);

}

function loadAllReferences(str) {
    references = JSON.parse(str);
    totalVerses = 31102;
    currentID = bible.getCurrentID(totalVerses);
    bible.getReferenceMinute(currentID);
    getMinuteTitle(currentID, totalVerses);
    setCurrentID();
    startTimer();

}

function setBookData() {
    bible.getTheWordOfGod();
}

function getBookFromZipFile(pathToZipFile, fileToExtract) {
    archive.getFileFromZip(pathToZipFile, fileToExtract, getBookData);
}

function getBookData() {
    version = settingsData["bibleversion"];
    pathToZipFile = "wgt-package/kjv.zip";
    fileToExtract = stringMaker.getFileToExtract(version, book);
    pathToBible = "../../zipbibles/"+LANG_JSON_DATA["DEFAULT_BIBLE"];
    filename = stringMaker.getBookJsFilename(book);
    if (version != LANG_JSON_DATA["DEFAULT_BIBLE"]) {
        //pathToZipFile = stringMaker.getPathToZipFile(version);
        //pathToBible = stringMaker.getPathToBible(version);
        pathToBible = "../../zipbibles/"+version;

    }   
    

    
    var initBookLocale = function(response){
    	bookLocale = response;
 
        var readAsJson = function() {


                setBookData();
            
        };
        //filesystem.getJsonData(pathToBible, filename, readAsJson);
        var FILE_URL = pathToBible + "/" + filename;
        filesystem.loadJS(FILE_URL, "bookData", false, readAsJson);
    };
    if (book==="Song of Solomon"){
    	var onCallback = function(){
    	    localization.getLocalizedBook(book, initBookLocale);
    	}
        bible.checkForBookOfSolomon(onCallback);
    }else{
        localization.getLocalizedBook(book, initBookLocale);
    }

}


function setBookLocale(){
	
	var getLocalizedBookCallBack = function(translatedBookTitle){
		bookLocale = translatedBookTitle;
		browseView();

	};
	localization.getLocalizedBook(book, getLocalizedBookCallBack);
}
function setSettingsData(jsonObj) {
    settingsData = jsonObj;
    isFullScreen = settingsData["fullScreen"];
    if (isFullScreen){
    	ui.fullScreen();
    }
    bible.setVersionButtonText();
    ui.updateFontSize();
    var bibleViewType = settingsData["bibleViewType"];
    console.log("bibleViewType: " + bibleViewType);
    console.log("settingsData[bibleversion]: " + settingsData["bibleversion"]);

    if (bibleViewType === "bibleminute") {
        bible.getAllReferences(loadAllReferences);

    }
    if (bibleViewType === "biblebrowse") {
	    var browseSettings = JSON.parse(tizen.preference.getValue("browseSettings"));
	    console.log(JSON.stringify(browseSettings));
	    book = browseSettings["book"];
	    chapter = browseSettings["chapter"].toString();
	    verse = browseSettings["verse"];
	    console.log("verse: " + verse);


	    var setBookData = function(str) {
	        bookData = JSON.parse(str);
		    setBookLocale();

	    };

	    var getBookFromZipFile = function(pathToZipFile, fileToExtract) {
	        archive.getFileFromZip(pathToZipFile, fileToExtract, getBookData);
	    };
	    
    	var getBookData = function() {
    	    version = settingsData["bibleversion"];
    	    pathToZipFile = "wgt-package/kjv.zip";
    	    fileToExtract = stringMaker.getFileToExtract(version, book);
    	    pathToBible = "wgt-private/kjv";
    	    filename = stringMaker.getBookJsonFilename(book);
    	    if (version != LANG_JSON_DATA["DEFAULT_BIBLE"]) {
    	        pathToZipFile = stringMaker.getPathToZipFile(version);
    	        pathToBible = stringMaker.getPathToBible(version);
    	    }   
    	    
    	    
    	    var initBookLocale = function(response){
    	    	bookLocale = response;
    	 
    	        var readAsJson = function(str) {

    	            if (str === "error") {
    	                getBookFromZipFile(pathToZipFile, fileToExtract);
    	            } else {
    	                setBookData(str);
    	            }
    	        };
    	        filesystem.getJsonData(pathToBible, filename, readAsJson);
    	    };
    	    if (book==="Song of Solomon"){
    	    	var onCallback = function(){
    	    	    localization.getLocalizedBook(book, initBookLocale);
    	    	}
    	        bible.checkForBookOfSolomon(onCallback);
    	    }else{
    	        localization.getLocalizedBook(book, initBookLocale);
    	    }

    	};
    	
	    if (bookData==null){
	    	console.log("bookData is null");
	    	getBookData();

	    }else{
		    setBookLocale();

	    }
    }

}

function getSettingsData() {
    settingsData_CRUD.get(setSettingsData);
}






function changeBibleViewTypeSetting(bibleViewType) {
    var data = JSON.parse(tizen.preference.getValue("settingsData"));
    data["bibleViewType"] = bibleViewType;
    settingsData_CRUD.saveToPreferences("settingsData", data);
    settingsData = data;
}

function goToBrowsePage(){
    var browseSettings = {};
    browseSettings["book"] = book;
    browseSettings["chapter"] = chapter;
    browseSettings["verse"] = verse;
    settingsData_CRUD.saveToPreferences("browseSettingsBrowsePage", browseSettings);
    tizen.preference.setValue("backToMinutePage", true);
	tizen.preference.setValue("fromOptionsPage", false);

    window.location.href = "../browse/index.html";
}

function browseView() {
    timer.stop();
    changeBibleViewTypeSetting("biblebrowse");
    enableArrowButtons();
    ui.hideElement(goToBrowseButton);
    ui.hideElement(moreOptionsContainer);
    ui.showElement(backButton);

    bible.getBrowseTitle();
    
    var getVerseReferencesInAChapterCallBack = function(referencesData){
    	bible.loadBrowseReferences(referencesData);
    }
    bible.getVerseReferencesInAChapter(book, chapter, getVerseReferencesInAChapterCallBack);
    document.addEventListener('rotarydetent', rotaryHandler, false);

}

function enableArrowButtons(){
    ui.showArrows(arrows);
	prevVerseButton.addEventListener("click", bible.prevVerse);
	nextVerseButton.addEventListener("click", bible.nextVerse);
}

function disableArrowButtons(){
    ui.hideArrows(arrows);
	prevVerseButton.removeEventListener("click", bible.prevVerse);
	nextVerseButton.removeEventListener("click", bible.nextVerse);
}

function minuteView() {
    var data = JSON.parse(tizen.preference.getValue("settingsData"));
    data["bibleViewType"] = "bibleminute";
    settingsData_CRUD.saveToPreferences("settingsData", settingsData);
    settingsData = data;
    bookData = null;

    ui.hideElement(backButton);
    disableArrowButtons();
    ui.showElement(goToBrowseButton);
    ui.showElement(moreOptionsContainer);
    bible.getAllReferences(loadAllReferences);
    document.removeEventListener('rotarydetent', rotaryHandler, false);

}

function setLocalizedBooks(jsondata){
	bibleBookTitlesInDifferentLanguages = jsondata;
    getSettingsData();


}

function setupSpecificComponents() {

    timer = new timer();
    page = document.getElementById("BibleMinutePage");
    pageID = page.id;
    sections = document.querySelectorAll(".section");
    addPopup(sections);
    setActivePage(page.id);
	localization.getLocalizedBibleBooks(setLocalizedBooks);    	

    goToBrowseButton = document.querySelector(".goToBrowseButton");
    goToBrowseButton.addEventListener("click", goToBrowsePage);

    backButton = document.querySelector(".backButton");
    backButton.addEventListener("click", minuteView);
    ui.initAddtoFavoriteButtons();
    moreOptionsContainer = document.querySelector(".moreOptionsContainer");
}

function removeSpecificComponents() {

    timer.destroy();
    interval = null;

    page = null;
    sections = null;

    goToBrowseButton.removeEventListener("click", browseView);
    goToBrowseButton = null;
    backButton.removeEventListener("click", minuteView);
    backButton = null;

    ui.removeAddtoFavoriteButtons();
    moreOptionsContainer = null;
}

function removeSpecificComponents() {

    ui.removeAddtoFavoriteButtons();

    timer.destroy();
    timer = null;

    sections = null;
    moreOptionsContainer = null;
}

function init() {
    bindEvents();
}

function rotaryHandler(e) {
    if (e.detail.direction === 'CW') {

    	bible.nextVerse();
    } else if (e.detail.direction === 'CCW') {

    	bible.prevVerse();
    	}
}


function bibleChangeVersionShortcut(){
	console.log("bibleChangeVersionShortcut: " + bibleVersionList.length );
	if (bibleVersionList.length>1){
		bible.changeBibleVersion();
		getSettingsData();	
	}else{
		bible.getTheWordOfGod(); 
	}
}

function bindEvents() {

    ui.setupGeneralComponents();
    disableArrowButtons();

    setupSpecificComponents();
    switchVersionButton = document.querySelector(".switchVersionButton");
    switchVersionButton.addEventListener("click", bible.switchVersionHandler);
  
    bible.getListOfBibleVersions();
    document.querySelector(".normalScreenVerseText").addEventListener("click", bibleChangeVersionShortcut );
    document.querySelector(".fullScreenVerseText").addEventListener("click", bibleChangeVersionShortcut);

	tizen.preference.setValue("fromOptionsPage", false);

}

function unBindEvents() {
    settingsData_CRUD.saveSettingsDataBeforeClosingPage();

    ui.removeGeneralComponents();
    removeSpecificComponents();


}

window.onload = function() {
    init();
};

window.onunload = function() {
    tts.cancel();
    unBindEvents();

    
}