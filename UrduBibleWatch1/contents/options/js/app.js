//OPTIONS PAGE JAVASCRIPT
var pageID = "OptionsPage";


	
window.onload = function(){
	tizen.preference.setValue("fromOptionsPage", true);
	var page = document.getElementById("OptionsPage"),
	imageButtons = document.querySelectorAll(".imageButton"),
	dotIndicators = document.querySelectorAll(".dotIndicator");
	setActivePage(page.id);
	swipe2.initSwipe2();
	
    var currentIndexGlobal =0;
	var sections = page.querySelectorAll(".content");
	
	var pageIndicator = page.querySelector(".pageIndicatorMenu");
	var ul = pageIndicator.querySelector("UL");
	var dots = ul.querySelectorAll("LI");
	console.log("menuPage");
    console.log("LI tags: " + dots.length);
    
    var hideSection = function(index){
    	console.log("hideSection: " + index);

    	sections[index].style.display = "none";
    };
    
    var showSection =  function(index){
    	console.log("showSection: " + index);
    	sections[index].style.display = "block";
    }
    
	var updateIndicator =  function(currentIndex, nextIndex){

        dots[currentIndex].className = "";
        dots[nextIndex].className = "current";		
	};
	var updateContent = function(currentIndex, nextIndex){
        //hideSection(currentIndex);
        //showSection(nextIndex);
        ui.hideSections(sections);
        ui.showSection(sections, nextIndex);
	};
    var nextContent = function(currentIndex) {
    	if(currentIndex!=2){
            var nextIndex = currentIndex + 1;
            currentIndexGlobal = nextIndex;
            console.log("nextContent: " + nextIndex);
            updateContent(currentIndex, nextIndex );
            updateIndicator(currentIndex, nextIndex);   		
    	}


    };

    var prevContent = function(currentIndex) {
    	
    	if(currentIndex!=0){
            var nextIndex = currentIndex - 1;
            currentIndexGlobal = nextIndex;
            console.log("prevContent: " + nextIndex);
            updateContent(currentIndex, nextIndex );
            updateIndicator(currentIndex, nextIndex);   		
    	}


    };
    
    function onSwipeLeft(){
    	currentIndex = parseInt(this.id);
    	console.log("currentIndex: " + currentIndex);
    	nextContent(currentIndex);
 	
    }
    function onSwipeRight(){
    	currentIndex = parseInt(this.id);
    	console.log("currentIndex: " + currentIndex);
    	prevContent(currentIndex);
 	
    }

	function rotaryEventHandler(e) {
	    if (e.detail.direction === 'CW') {

	    	console.log("CW");
	    	nextContent(currentIndexGlobal);
	    } else if (e.detail.direction === 'CCW') {

	    	console.log("CCW");
	    	prevContent(currentIndexGlobal);

	    	}
	}
	function onImageButtonSwipeLeft(){
    	nextContent(currentIndexGlobal);

	}
	function onImageButtonSwipeRight(){
    	prevContent(currentIndexGlobal);

	}	
	
	function dotIndicator_Handler(){
	  	nextIndex = parseInt(this.id);
        currentIndex = currentIndexGlobal;
        currentIndexGlobal = nextIndex;
        console.log("nextContent: " + nextIndex);
    	console.log("currentIndex: " + currentIndex);

        updateContent(currentIndex, nextIndex );
        updateIndicator(currentIndex, nextIndex);  
        }
	
	var bindEvents = function (){
		console.log("bindEvents");
		/* HIDE THIS FOR NOW UNTIL ALL PAGES ARE DEVELOPED
		console.log(sections.length);
		for (var x=0; x<sections.length; x++){
			
			var content = sections[x];
			content.id = x;
			content.addEventListener('swipeleft', onSwipeLeft);
			content.addEventListener('swiperight', onSwipeRight);
		}
		for (var x=0; x<sections.length; x++){
			
			sections[x].style.display = "none";

		}		
		sections[0].style.display = "block";
		
	    document.addEventListener('rotarydetent', rotaryEventHandler, false);
		for (var x=0; x<imageButtons.length; x++){
			
			imageButtons[x].addEventListener('swipeleft', onImageButtonSwipeLeft);
			imageButtons[x].addEventListener('swiperight', onImageButtonSwipeRight);
		}
		
		for (var x=0; x<dotIndicators.length; x++){
			
			var dotIndicator = dotIndicators[x];
			dotIndicator.id = x;
			dotIndicator.addEventListener('click', dotIndicator_Handler);
			console.log("dotIndicator");
		}
        */
	    

	};
	
	bindEvents();
};
