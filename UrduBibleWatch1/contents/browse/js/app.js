//BROWSE PAGE JAVASCRIPT

var page,
    bookListDiv,
	chapterListDiv,
	verseListDiv,
    clockButton,
    sections,
    minFullScreenSections,
    arrows,
    prevVerseButton,
    nextVerseButton,
    bibleverse,
    bibleverse2,
    fontResizeButton,
    maximizeButton,   
    switchVersionButton,
    bibleVersionList = [],
    upperCaseBibleVersionList,
    references,
    settingsData,
    book,
    bookLocale,
    chapter,
    verse,
    bookData,
    totalVerses,
    currentID,
    referenceIndex,
    isFullScreen,
    
    version, //= settingsData["bibleversion"];
    pathToZipFile, //= "wgt-package/kjv.zip";
    pathToBible,
    fileToExtract, //= stringMaker.getFileToExtract(version, book);
    filename, //stringMaker.getBookJsonFilename("Song of Songs");
    
    //SPECIFIC COMPONENTS
    favoritesButton,
	selectBookButton, 
	selectBookButtonLabel,
	selectChapterButton,
	selectVerseButton,
	goButton,
	saveBookmarkButton,
	input,

	totalChapters,
	booksChaptersAndVerses,
	localeLanguage = "en-us",
	bibleBookTitlesInDifferentLanguages;

function showMainPage(){
	ui.hideSections(sections);
	ui.showSection(sections, 0);	
	setActivePage(page.id);	
}



function setBookTitleMarquee(bookTitle){

	if (bookTitle.length>13) {
	    selectBookButton.className = "browse-item-book-marquee";
	}else{
		 selectBookButton.className = "browse-item-book-noMarquee";
	}	
}
function setLocalizedBooks(jsondata){
	console.log('setLocalizedBooks');
	bibleBookTitlesInDifferentLanguages = jsondata;
	bible.setSelectedBook(selectBookButtonLabel, book, bibleBookTitlesInDifferentLanguages);
	setBookTitleMarquee(selectBookButtonLabel.innerHTML);

}
function showBooks(){
	 tizen.preference.setValue("activePage", "popup");	
	ui.hideSections(sections);
	ui.showSection(sections, 1);	

	bookListDiv.innerHTML = "";
	var booksArray = Object.keys(booksChaptersAndVerses);
	for (var x=0; x<booksArray.length; x++){
		var bookEl = document.createElement("DIV");
		bookEl.className = "browse-setting-item";

        var bookKeyOriginal = booksArray[x];
		var bookKey = bookKeyOriginal.replace(/\s/g, "-");
	    bible.setSelectedBook(bookEl, bookKey, bibleBookTitlesInDifferentLanguages);

		
		bookEl.id = booksArray[x];
		bookListDiv.appendChild(bookEl);
		if (booksArray[x]=="Revelation"){
			bookEl.style.marginBottom = "70%";
		}
		bookEl.addEventListener("click", function(){			
			book = this.id;
			try{
			    bible.setSelectedBook(selectBookButtonLabel, book, bibleBookTitlesInDifferentLanguages);
				chapter = 1;
				verse = 1;
				selectChapterButton.innerHTML = chapter;
				selectVerseButton.innerHTML = verse;
				totalVerses = booksChaptersAndVerses[book]["chapter"][chapter]["totalVerses"];
				totalChapters = booksChaptersAndVerses[ this.id]["totalchapters"];
				showMainPage();	
				document.getElementById("Title").innerHTML = verse + "/" + totalVerses;

			}catch(e){
				console.log(e.message);
			}


		});
	}		
			
}

function showChapters(){
	 tizen.preference.setValue("activePage", "popup");	
	


	chapterListDiv.innerHTML = "";
	if (totalChapters!=null){
		ui.hideSections(sections);
		ui.showSection(sections, 2);	

		for (var x=0; x<totalChapters; x++){
			var chapterNumber = x + 1;
			var chapEl = document.createElement("DIV");
			chapEl.className = "browse-setting-item";
			chapEl.innerHTML = chapterNumber;
			chapEl.id = chapterNumber;
			chapterListDiv.appendChild(chapEl);
			if (chapterNumber==totalChapters){
				chapEl.style.marginBottom = "70%";
			}
			chapEl.addEventListener("click", function(){
	
				chapter = this.id;
				totalVerses = booksChaptersAndVerses[book]["chapter"][chapter]["totalVerses"];
				selectChapterButton.innerHTML = chapter;
				verse = 1;
				selectVerseButton.innerHTML = verse;
				showMainPage();
				document.getElementById("Title").innerHTML = verse + "/" + totalVerses;


			});
		}
		
	}

}
function showVerses(){
	if (totalVerses!=null){
		 tizen.preference.setValue("activePage", "popup");	

		ui.hideSections(sections);
		ui.showSection(sections, 3);	

		
		verseListDiv.innerHTML = "";

		

		for (var x=0; x<totalVerses; x++){
			var verseNumber = x + 1;
			var verseEl = document.createElement("DIV");
			verseEl.className = "browse-setting-item";
			verseEl.innerHTML = verseNumber;
			verseEl.id = verseNumber;
			verseListDiv.appendChild(verseEl);
			if (verseNumber==totalVerses){
				verseEl.style.marginBottom = "70%";
			}
			verseEl.addEventListener("click", function(){

				verse = this.id;
				selectVerseButton.innerHTML = verse;
				//var version = settingsData["bibleversion"];
				//getBibleVerse(version, selectedBook, chapter, verse, "bibleBrowseVerse");

				document.getElementById("Title").innerHTML = verse + "/" + totalVerses;

				showMainPage();


			});
		}
		
	}

}

function setFullScreen() {
    isFullScreen = settingsData["fullScreen"];
    console.log("isFullScreen: " + isFullScreen);
    if (isFullScreen) {
        ui.fullScreen();
    	hideSections(sections);
    	showSection(sections, 4);
    	ui.showArrows(arrows);	
    	setActivePage("popup");
    }else{
    	hideSections(sections);
    	showSection(sections, 4);
    	ui.showArrows(arrows);	
    	setActivePage("popup");
    }
    
}

function setBookLocale(){
	
	var getLocalizedBookCallBack = function(translatedBookTitle){
		bookLocale = translatedBookTitle;
    	bible.initBibleView();

	};
	localization.getLocalizedBook(book, getLocalizedBookCallBack);
}

function browseView() {
   
    bible.getBrowseTitle();
    bible.getVerseReferencesInAChapter(book, chapter, bible.loadBrowseReferences);
}
function setSettingsData(jsonObj) {
    settingsData = jsonObj;
    version = settingsData["bibleversion"];
    bible.setVersionButtonText();
    pathToZipFile = "wgt-package/kjv.zip";
    pathToBible = "wgt-private/kjv";
    if (version != "kjv") {
        pathToZipFile = stringMaker.getPathToZipFile(version);
        pathToBible = stringMaker.getPathToBible(version);

   }   
    ui.updateFontSize();
    if(tizen.preference.exists("browseSettingsBrowsePage")){
    	console.log("browseSettingsBrowsePage: eixsts");
        var browseSettings = JSON.parse(tizen.preference.getValue("browseSettingsBrowsePage"));
        book = browseSettings["book"];
        chapter = browseSettings["chapter"].toString();
    	totalVerses = booksChaptersAndVerses[book]["chapter"][chapter]["totalVerses"];

        verse = browseSettings["verse"];
    	selectChapterButton.innerHTML = chapter;
    	selectVerseButton.innerHTML = verse;
    	currentID = verse -1;

        fileToExtract = stringMaker.getFileToExtract(version, book);
        filename = stringMaker.getBookJsonFilename(book);
       

    
        var initFromBrowseSettings = function(jsondata){
        	console.log('setLocalizedBooks');
        	bibleBookTitlesInDifferentLanguages = jsondata;

            var selectedBook = book.replace(/ /g, "-");
    		var getDeviceLocaleLanguageCallBack = function(locale){
    			console.log("locale language: " + locale.language);
    			

    	        if (book==="Song of Solomon"){
    	        	var onCallback = function(){
    	        		setBookLocale();
    	        	}
    	            bible.checkForBookOfSolomon(onCallback);
    	        }else{
    	        	setBookLocale();
    	        }  
	    	    bible.setSelectedBook(selectBookButtonLabel, book, bibleBookTitlesInDifferentLanguages);
	    	    if (tizen.preference.exists("fromOptionsPage")){
	    	    	var isTrue = tizen.preference.getValue("fromOptionsPage");
	    	    	if(isTrue){
	    	    	 	localization.getLocalizedBibleBooks2(setLocalizedBooks);   
	    	          	selectChapterButton.innerHTML = chapter;
	    	        	selectVerseButton.innerHTML = verse;
	    	        	currentID = verse -1;
	    	        	totalVerses = booksChaptersAndVerses[book]["chapter"][chapter]["totalVerses"];
	    	        	totalChapters = booksChaptersAndVerses[book]["totalchapters"];
	    	        	document.getElementById("Title").innerHTML = verse + "/" + totalVerses;

	    	        	ui.hideSections(sections);
	    	        	ui.showSection(sections, 0);
	    	        	setActivePage(page.id);   	
	    	    	}else{
	    	    	    setFullScreen();

	    	    	}
	    	    }

    		};
    		
    		localization.getDeviceLocaleLanguage(getDeviceLocaleLanguageCallBack);



        };
    	localization.getLocalizedBibleBooks2(initFromBrowseSettings); 

    }else{
    	book = "Genesis";
    	chapter = 1;
    	verse = 1;
    	localization.getLocalizedBibleBooks2(setLocalizedBooks);   
      	selectChapterButton.innerHTML = chapter;
    	selectVerseButton.innerHTML = verse;
    	currentID = verse -1;
    	totalVerses = booksChaptersAndVerses[book]["chapter"][chapter]["totalVerses"];
    	totalChapters = booksChaptersAndVerses[book]["totalchapters"];
    	ui.hideSections(sections);
    	ui.showSection(sections, 0);
    	setActivePage(page.id);   	
    }
	document.getElementById("Title").innerHTML = verse + "/" + totalVerses;





}

function getSettingsData() {
    settingsData_CRUD.get(setSettingsData);
}
function readWordOfGod(){
	/*references = [];
	for (var x=1; x<=totalChapters; x++){
		var bookReference = book;
	    var chapterReference = chapter;
	    var verseReference = x;
	    var reference = [bookReference, chapterReference, verseReference];
	    references.push(reference);
	}
	var string = JSON.stringify(references);
	browseSettings = {"book": book, "chapter": chapter, "verse": verse};
	*/
	//var settingsData = JSON.parse(tizen.preference.getValue("settingsData"));
	//settingsData["bibleViewType"] = "biblebrowse";
	//settingsData_CRUD.saveToPreferences("settingsData", settingsData);
	//settingsData_CRUD.saveToPreferences("browseSettings", browseSettings);
	currentID = verse -1;
	ui.hideSections(sections);
	ui.showSection(sections, 4);
	 tizen.preference.setValue("activePage", "popup");	
	ui.showArrows(arrows);	
    console.log("book: " + book);
    
    version = settingsData["bibleversion"];

    pathToZipFile = "wgt-package/kjv.zip";
    pathToBible = "wgt-private/kjv";
    fileToExtract = stringMaker.getFileToExtract(version, book);
    filename = stringMaker.getBookJsonFilename(book);
   
    if (version != "kjv") {
         pathToZipFile = stringMaker.getPathToZipFile(version);
         pathToBible = stringMaker.getPathToBible(version);

    }
    if (book==="Song of Solomon"){
    	var onCallback = function(){
    		   bible.initBibleView();
    	}
        bible.checkForBookOfSolomon(onCallback);
    }else{
	   bible.initBibleView();
    }
	document.getElementById("Title").innerHTML = verse + "/" + totalVerses;

	
	
	
}
function load_BooksChaptersAndVerses(){
	booksChaptersAndVerses = totalChaptersAndVerses;
	getSettingsData();
}


function saveSettingsDataBeforeClosingPage(){
    var browseSettings = {
	        "book": book,
	        "chapter": chapter,
	        "verse": verse
	    };
	    this.saveToPreferences("browseSettingsBrowsePage", browseSettings);

	    if (document.getElementById("minScreen").style.display === "block") {
	        settingsData["fullScreen"] = false;
	    }
        settingsData_CRUD.update(settingsData);
}

function rotaryHandler(e) {
    if (e.detail.direction === 'CW') {

    	bible.nextVerse();
    } else if (e.detail.direction === 'CCW') {

    	bible.prevVerse();
    	}
}
function setupSpecificComponents(){
	page = document.getElementById("BrowsePage");
    pageID = page.id;
	sections = document.querySelectorAll(".browseContent");	

	addPopup(sections);
    
	ui.hideArrows(arrows);	
	
	input = document.querySelector(".bookmarkTitleInputText");
	
	goButton = document.querySelector(".goButton");	
	goButton.addEventListener("click", readWordOfGod);	

	saveBookmarkButton = document.getElementById("goButtonBookmark");
	saveBookmarkButton.addEventListener("click", bible.saveBookmark);

	selectBookButton =   document.getElementById("browseSelectBook");	
	selectBookButton.addEventListener("click", showBooks);
	selectBookButtonLabel =  document.getElementById("browseSelectBookLabel");	
	
	selectChapterButton = document.getElementById("browseSelectChapter");
	selectChapterButton.addEventListener("click", showChapters);
	
	selectVerseButton = document.getElementById("browseSelectVerse");
	selectVerseButton.addEventListener("click", showVerses);
	
	
	ui.bookmarkThisButton();
    ui.initAddtoFavoriteButtons();
    
    minFullScreenSections = document.querySelectorAll(".section");
	
	bookListDiv = document.getElementById("booksList");
	chapterListDiv = document.getElementById("chapterList");
	verseListDiv = document.getElementById("verseList");
    ui.addCircularScrollBar(bookListDiv);
    ui.addCircularScrollBar(chapterListDiv);
    ui.addCircularScrollBar(verseListDiv);
	//filesystem.getJsonData("wgt-package", "totalChaptersAndVerses.json", load_BooksChaptersAndVerses);
	var FILE_URL = "../../totalChaptersAndVerses.js";
	filesystem.loadJS(FILE_URL, "totalChaptersAndVerses", false, load_BooksChaptersAndVerses );

	
    document.addEventListener('rotarydetent', rotaryHandler, false);


}

function removeSpecificComponents(){
	page = null;
	pageID = null;
	sections = null;
	booksChaptersAndVerses = null;	

	goButton.removeEventListener("click", readWordOfGod);	
	goButton = null;

	input = null;
	saveBookmarkButton.removeEventListener("click", bible.saveBookmark);
	saveBookmarkButton = null;
	
	selectBookButton.removeEventListener("click", showBooks);
	selectBookButton = null;
	selectBookButtonLabel = null;
	selectChapterButton.removeEventListener("click", showChapters);
	selectChapterButton = null;
	
	selectVerseButton.removeEventListener("click", showVerses);
	selectVerseButton = null;

	totalChapters = null,
	localeLanguage = null,
	bibleBookTitlesInDifferentLanguages = null;
		
    ui.removeAddtoFavoriteButtons();

	bookListDiv = null;
}

function bibleChangeVersionShortcut(){
	if (bibleVersionList.length>1){
		bible.changeBibleVersion();
		var setSettingsData = function(jsonObj){
		    settingsData = jsonObj;
		    version = settingsData["bibleversion"];
		    bible.setVersionButtonText();
		    pathToZipFile = "wgt-package/kjv.zip";
		    pathToBible = "wgt-private/kjv";
		    if (version != "kjv") {
		        pathToZipFile = stringMaker.getPathToZipFile(version);
		        pathToBible = stringMaker.getPathToBible(version);
		   }   
		    	currentID = verse -1;
		        fileToExtract = stringMaker.getFileToExtract(version, book);
		        filename = stringMaker.getBookJsonFilename(book);	
		       if (book==="Song of Solomon"){
		       	var onCallback = function(){
		       		   bible.initBibleView();
		       	}
		           bible.checkForBookOfSolomon(onCallback);
		       }else{
		   	       bible.initBibleView();
		       }
		};
		settingsData_CRUD.get(setSettingsData);
	}else{
			bible.getTheWordOfGod(); 
		
	}
}

function callbackSwipeEvent(direction){
	if (direction==="left"){
		bible.nextVerse();
		document.getElementById("Title").innerHTML = verse + "/" + totalVerses;

	}else{
		bible.prevVerse();
		document.getElementById("Title").innerHTML = verse + "/" + totalVerses;

	}
}

function bindEvents(){
    switchVersionButton = document.querySelector(".switchVersionButton");
    switchVersionButton.addEventListener("click", bible.switchVersionHandler);
    ui.setupGeneralComponents();
    setupSpecificComponents();
    bible.getListOfBibleVersions();
    var normalScreenVerseText = document.querySelector(".normalScreenVerseText");
    var fullScreenVerseText = document.querySelector(".fullScreenVerseText");
    ui.addCircularScrollBar
    normalScreenVerseText.addEventListener("click", bibleChangeVersionShortcut );
    fullScreenVerseText.addEventListener("click", bibleChangeVersionShortcut);


    swipeEvent(normalScreenVerseText, callbackSwipeEvent);
    swipeEvent(fullScreenVerseText, callbackSwipeEvent);
    
    document.getElementById("page_title_browse").innerHTML = LANG_JSON_DATA["TRANSLATIONS"]["BROWSE_PAGE"]["browse"];
    document.getElementById("gotext").innerHTML = LANG_JSON_DATA["TRANSLATIONS"]["BROWSE_PAGE"]["go"];

    document.getElementById("addBookmarkButtonText").innerHTML = LANG_JSON_DATA["TRANSLATIONS"]["COMMON"]["addBookmarkButton"];

    document.querySelector(".addBookMarkTitle").innerHTML = LANG_JSON_DATA["TRANSLATIONS"]["COMMON"]["enterBookmarkTitle"];
    document.getElementById("booksOfTheBible").innerHTML = LANG_JSON_DATA["TRANSLATIONS"]["BROWSE_PAGE"]["book"];
    document.getElementById("chaptersOfTheBible").innerHTML = LANG_JSON_DATA["TRANSLATIONS"]["BROWSE_PAGE"]["chapter"];
    document.getElementById("versesOfTheBible").innerHTML = LANG_JSON_DATA["TRANSLATIONS"]["BROWSE_PAGE"]["verse"];
   
    
}

rotaryEventHandler = function(e) {
    if (e.detail.direction === 'CW') {

    	console.log("CW");
    	bible.nextVerse();
    } else if (e.detail.direction === 'CCW') {

    	console.log("CCW");
    	bible.prevVerse();


    	}
};

function init(){
	bindEvents();	
}

function unbindEvents(){
	saveSettingsDataBeforeClosingPage();
	ui.removeGeneralComponents();
	removeSpecificComponents();
}

window.onload = function(){
	init();

};

window.onunload = function(){
    tts.cancel();
	unbindEvents();
}