
var ui = (function(){
	
	this.setFullScreen = function() {
	    isFullScreen = settingsData["fullScreen"];
	    if (isFullScreen) {
	        this.fullScreen();
	    }
	};

	this.setupGeneralComponents = function(){
	    this.addBibleVerseDiv();
	    this.showNavigation();
	    this.showToolBar();
	    this.setUpClockIcons();	
	    this.initBackgound();


	};

	this.removeGeneralComponents = function(){
	    clockButton.removeEventListener("click", ui.openClock);
	    clockButton = null;
	    
	    fontResizeButton.removeEventListener("click", ui.changeFontSize);
	    fontResizeButton = null;
	    
	    prevVerseButton.removeEventListener("click", bible.prevVerse);
	    prevVerseButton = null;

	    nextVerseButton.removeEventListener("click", bible.nextVerse);
	    nextVerseButton = null;

	    bibleverse = null;
	    bibleverse2 = null;
	    
	    maximizeButton.removeEventListener("click", this.fullScreen);
	    maximizeButton = null;
	    
	    page = null;
	    references = null;
	    settingsData = null;
	    book = null;
	    chapter = null;
	    verse = null;
	    bookData = null;
	    totalVerses = null;
	    currentID = null;

	};
	
	this.fullScreen = function(){
		ui.hideElement(document.getElementById("minScreen"));
		ui.showElement(document.getElementById("fullScreen"));
		tizen.preference.setValue("activePage", "popup");	
		isFullScreen = true;
		settingsData["fullScreen"] = isFullScreen;
	};
	
	this.minScreen = function(){
		ui.showElement(document.getElementById("minScreen"));
		ui.hideElement(document.getElementById("fullScreen"));
		tizen.preference.setValue("activePage", "popup");	
		isFullScreen = false;
		settingsData["fullScreen"] = isFullScreen;
		if(pageID==="page_FavoritesPage"){
			tizen.preference.setValue("activePage", "page_FavoritesPage");	
		}

	};

	this.initAddtoFavoriteButtons = function(){
		addToFavoritesButton = document.querySelector(".addToFavoritesButton");
		addToFavoritesButton.addEventListener("click", bible.addVerseToFavorites );
				
	};
	this.removeAddtoFavoriteButtons = function(){
		addToFavoritesButton.removeEventListener("click", bible.addVerseToFavorites );
		addToFavoritesButton = null;
				
	};
	this.showNavigation = function(){
		arrows = document.querySelectorAll(".arrow");	
		prevVerseButton = document.getElementById("prevVerse");
		prevVerseButton.addEventListener("click", bible.prevVerse);
		
		nextVerseButton = document.getElementById("nextVerse");
		nextVerseButton.addEventListener("click", bible.nextVerse);
		
	};
	
	this.openClock  = function(){
		settingsData["fullScreen"] = true;
		console.log("fullScreen: " + settingsData["fullScreen"]);
		console.log("window.location.href: " + window.location.href);
		tizen.preference.setValue("goBackToThisFromClock", window.location.href);
		settingsData_CRUD.update(settingsData);
        window.location.href = "../clock/index.html";

	};
	this.setUpClockIcons = function(){
		clockButton = document.querySelector(".clockIcon");
		clockButton.addEventListener("click", this.openClock);

	};
	this.setUpBibleIcons = function(){
	    bibleIcon = document.querySelector(".bibleIconTouchArea");
	    bibleIcon.addEventListener("click", goBack);
	};
	this.removeBibleIcons = function(){
	    bibleIcon.removeEventListener("click", goBack);
	    bibleIcon = null;
	};
	this.addBibleVerseDiv = function(){
	    bibleverse = document.getElementById("bibleverse");
	    bibleverse2 = document.getElementById("bibleverse2");

	};

	this.bookmarkThisButton = function(){
		
		bookmarkThisButton = document.querySelector(".bookmarkThisButton");
		bookmarkThisButton.addEventListener("click", bible.bookmarkThisButtonHandler);

				
	};

	this.removeBrowseButton = function(){
		bookmarkThisButton.removeEventListener("click", bible.bookmarkThisButtonHandler);
		bookmarkThisButton = null;

				
	};
	this.showToolBar = function(){

		fontResizeButton = document.querySelector(".fontResizeButton");
		fontResizeButton.addEventListener("click", this.changeFontSize);

		maximizeButton = document.querySelector(".maximizeButton");
		maximizeButton.addEventListener("click", this.fullScreen);
	};
	
	this.updateFontSize = function(){
		var fontSize = settingsData["fontSize"];
	    this.setFontSize("bibleverse", fontSize);
	    this.setFontSize("bibleverse2", fontSize);	
	};
	this.changeFontSize = function(){
		settingsData["fontSize"] = settingsData["fontSize"]  + 2;
		if (settingsData["fontSize"]>40){
			settingsData["fontSize"] = 14;
		}
	    updateFontSize();
		settingsData_CRUD.update(settingsData);
	};
	this.hideElement = function(element){
		element.style.display = "none";
	};
	
	this.showElement = function(element){
		element.style.display = "block";
	};
	
	this.hideArrows = function(elements){
		for (var x = 0; x<elements.length; x++ ){
			var element = elements[x];
			this.hideElement(element);
		}		
	};
	this.showArrows = function(elements){
		for (var x = 0; x<elements.length; x++ ){
			var element = elements[x];
			this.showElement(element);
		}		
	};	
	
	this.showSection = function(elements, index){
		var element = elements[index];
		this.showElement(element);
	
	};
	this.hideSection = function(elements, index){
		var element = elements[index];
		this.hideElement(element);
	
	};
	this.hideSections = function(elements){
		for (var x = 0; x<elements.length; x++ ){
			var element = elements[x];
			this.hideElement(element);
		}	
	
	};
	
	this.setFontSize = function(element, fontSize){
		console.log("setFontSize: " + fontSize);
		document.getElementById(element).style.fontSize = fontSize + "px";
	};
	
	this.updateBackgroundColor = function(element, color){
		console.log("color: " + color);
		element.style.backgroundColor = "rgba("+color+")";
		console.log("updateBackgroundColor");
	};

	this.updateBackgroundImage = function(element, imageURI){
		element.style.backgroundImage = "url("+imageURI+")";
		console.log("updateBackgroundImage");
	};
	
	this.getBackgroundColor = function(element){
		return element.style.backgroundColor;
	};
	
	this.initBackgound = function(){
		//document.getElementById("backgroundImage").style.backgroundColor = "rgba(31,64,159,255)";
        console.log("initBackground");
	/*	var imageURI;// = backgroundSettings["imageURI"];
		imageURI = "../../background_images/animals/1/1_animals0.jpg";
		console.log("imageURI" + imageURI);
		var element = document.getElementById("backgroundImage");
		this.updateBackgroundImage(element, imageURI);	
		*/
		if(tizen.preference.exists("backgroundSettings")){
			var backgroundSettings = JSON.parse(tizen.preference.getValue("backgroundSettings"));
			console.log(backgroundSettings);
			var backgroundType = backgroundSettings["backgroundType"];
			if (backgroundType==="color"){
				var colorObj = backgroundSettings["backgroundColor"];
				var rgba = colorObj[0] + "," + colorObj[1] + "," + colorObj[2] + "," + colorObj[3];
				var element = document.body;
				this.updateBackgroundColor(element, rgba);
				
			}else{
				var imageURI = backgroundSettings["imageURI"];
				console.log("imageURI" + imageURI);
				var element = document.getElementById("backgroundImage");
				this.updateBackgroundImage(element, imageURI);				
			}
		}
	};
	this.addCircularScrollBar = function(element){
		if(element) {
		   element.setAttribute("tizen-circular-scrollbar", "");
		}
	}
return this;
}());

