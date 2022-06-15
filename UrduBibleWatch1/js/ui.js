
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
	
	this.hideAlertNotification = function(){
		  var element = document.getElementById("page_AlertNotificationPage");
		  element.remove();
		  console.log("hide alert notification");
		  
	};
	this.showAlertNotification = function(message, callback){
	   	var divContainer = document.createElement("DIV");
	   	divContainer.id = "page_AlertNotificationPage";
	   	
	   	divContainer.className = "pageAlertNotification";
      var divInner = document.createElement("DIV");
      divInner.style.width = "100%";
      divInner.style.height = "100%";
      var div_fullScreenVerseContainerAlertNotification = document.createElement("DIV");
      div_fullScreenVerseContainerAlertNotification.className = "noFlash fullScreenVerseContainerAlertNotification  hideScrollBarTrack";
      div_alertmessageNotificationText = document.createElement("DIV");
      div_alertmessageNotificationText.className = "noFlash fullScreenVerseTextAlertNotification  hideScrollBarTrack";
      div_alertmessageNotificationText.innerHTML = message;
	   	var divButton = document.createElement("BUTTON");
	   	divButton.innerHTML = "&#10003;";
	   	divButton.id = "alertNotificationIDOkButton";
	   	
	   	var closeWindow = function(){
	   		ui.hideAlertNotification();
	   		if (callback!=null){
		   		callback();
	   		}

	   	};
	   	divButton.addEventListener("click", closeWindow);
	   	//this.addCircularScrollBar(divContainer);
      div_fullScreenVerseContainerAlertNotification.appendChild(div_alertmessageNotificationText);
      divInner.appendChild(div_fullScreenVerseContainerAlertNotification);
      divContainer.appendChild(divInner);
	   	divContainer.appendChild(divButton);
      document.body.appendChild(divContainer);
	   	
	   	
	};

	this.showInputSliderPage = function(message, defaultValue, saveSliderValueCallback){

	   	var divContainer = document.createElement("DIV");
	   	divContainer.id = "page_AlertNotificationPage";
	   	
	   	divContainer.className = "pageAlertNotification";
    var divInner = document.createElement("DIV");
    divInner.style.width = "100%";
    divInner.style.height = "100%";
    var div_fullScreenVerseContainerAlertNotification = document.createElement("DIV");
    div_fullScreenVerseContainerAlertNotification.className = "noFlash fullScreenVerseContainerAlertNotification  hideScrollBarTrack";
    div_alertmessageNotificationText = document.createElement("DIV");
    div_alertmessageNotificationText.className = "noFlash fullScreenVerseTextAlertNotification  hideScrollBarTrack";
    
    var title = document.createElement("DIV");
    title.innerHTML = message;   
    title.style = "padding-bottom: 30%; font-size: 30px;";

    title.id = message.replace(/ /g, "") + "value";
    var plusButton = document.createElement("DIV");
    plusButton.innerHTML = "+";
    plusButton.className = "centeredText sliderButton";
    plusButton.id = "plusButtonId";
    plusButton.style = "font-size: 50px; left: 80%; width: 60px; height:60px;";
    var minusButton = document.createElement("DIV");
    minusButton.innerHTML = "-";     
    minusButton.id = "minusButtonId";
    minusButton.className = "centeredText sliderButton";
    minusButton.style = "font-size: 50px; left: 20%; width: 60px; height:60px;";

    var currentSliderValue = document.createElement("DIV");
    console.log("defaultValue:" + defaultValue);
    currentSliderValue.innerHTML = defaultValue;   

    
    currentSliderValue.id = "currentSliderValue";
    currentSliderValue.className = "centeredText";
    currentSliderValue.style = "font-size: 40px;";
    div_alertmessageNotificationText.appendChild(title);
    div_alertmessageNotificationText.appendChild(minusButton);
    div_alertmessageNotificationText.appendChild(currentSliderValue);
    div_alertmessageNotificationText.appendChild(plusButton);
    
	  var divButton = document.createElement("BUTTON");
	  divButton.innerHTML = "&#10003;";
	  divButton.id = "alertNotificationIDOkButton";
	  

	   	//this.addCircularScrollBar(divContainer);

	  var increaseSliderValue = function(){
	   	  if (parseInt(currentSliderValue.innerHTML)<100){
      	  currentSliderValue.innerHTML = parseInt(currentSliderValue.innerHTML) + 1; 
      	  var percentValue = parseInt(currentSliderValue.innerHTML) - 1;
      	  if (parseInt(currentSliderValue.innerHTML)==100){
      		  percentValue = 100;
      	  }
      	  var percent = (percentValue/100) * 100;

		      progress.setProgress(percent, "progressInputSlider");		
		      saveSliderValueCallback(currentSliderValue.innerHTML);

		      //tizen.preference.getValue(preferenceValue, currentSliderValue.innerHTML);

  	  }		  
	  };
	  
	  var decreaseSliderValue = function(){
  	  if (parseInt(currentSliderValue.innerHTML)>1){
    	    currentSliderValue.innerHTML = parseInt(currentSliderValue.innerHTML) - 1;
      	    var percentValue = parseInt(currentSliderValue.innerHTML) - 1;
    	    var percent = (percentValue/100) * 100;
	        progress.setProgress(percent, "progressInputSlider");		
		   // tizen.preference.getValue(preferenceValue, currentSliderValue.innerHTML );
		      saveSliderValueCallback(currentSliderValue.innerHTML);


    	  }		  
	  };
	  var rotaryEventHandler = function(e) {
		    if (e.detail.direction === 'CW') {

		    	console.log("CW");
		    	increaseSliderValue();
		    } else if (e.detail.direction === 'CCW') {

		    	console.log("CCW");
		    	decreaseSliderValue();


		    	}
		};
    plusButton.addEventListener("click", increaseSliderValue );
    minusButton.addEventListener("click", decreaseSliderValue);
    document.addEventListener('rotarydetent', rotaryEventHandler, false);
	  var closeSliderWindow  = function(){
	      document.removeEventListener('rotarydetent', rotaryEventHandler);
	      ui.hideAlertNotification();

	  };
	  divButton.addEventListener("click", closeSliderWindow);
    var progressCircleContainer = document.createElement("DIV");
    progressCircleContainer.className = "progressCircleContainer progressCircleContainerDownloadingPage";
    progressCircleContainer.style = "z-index: -10;";
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('viewBox', '-100 -100 200 200');
    var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    circle.setAttribute("class", "progressIndicator");
    circle.setAttributeNS(null, 'id', "progressInputSlider");

    circle.setAttribute('r', 100);
    circle.setAttributeNS(null, 'transform', "rotate(-90)");

    svg.appendChild(circle);
    progressCircleContainer.appendChild(svg);
    var progressCircleContainer2 = document.createElement("DIV");
    progressCircleContainer2.className = "progressCircleContainer progressCircleContainerDownloadingPage";
    progressCircleContainer2.style = "z-index: -11;";
    var svg2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg2.setAttribute('viewBox', '-100 -100 200 200');
    var circle2 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    circle2.setAttribute('r', 100);
    circle2.setAttributeNS(null, 'transform', "rotate(-90)");
    circle2.setAttribute("class", "progressIndicatorTrack");


    svg2.appendChild(circle2);
    progressCircleContainer2.appendChild(svg2);

    divContainer.appendChild(progressCircleContainer);
    divContainer.appendChild(progressCircleContainer2);      
	  div_fullScreenVerseContainerAlertNotification.appendChild(div_alertmessageNotificationText);
    divInner.appendChild(div_fullScreenVerseContainerAlertNotification);
    divContainer.appendChild(divInner);
	  divContainer.appendChild(divButton);
    document.body.appendChild(divContainer);

	  var percentValue = parseInt(currentSliderValue.innerHTML) - 1;
	  if (parseInt(currentSliderValue.innerHTML)==100){
		  percentValue = 100;
	  }
	  var percent = (percentValue/100) * 100;
    progress.setProgress(percent, "progressInputSlider");		
	

    
	   	
	   	
	};	
return this;
}());

