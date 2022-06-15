var clocks = ["clock", "clock1", "clock2"];
var popupList = [];
var  goBack = function() {
	//var windowLocationHref = tizen.preference.getValue("goBackToThisFromClock");
	//window.location.href = windowLocationHref;
	var event = {"keyName": "back" };
	onHardwareKeysTap(event);

};

var  goBackFromHistory = function() {
	
    if(tizen.preference.exists("launchFavoriteFromWidget")){
    	if (tizen.preference.getValue("launchFavoriteFromWidget")){
			tizen.preference.setValue("launchFavoriteFromWidget", false);

    		window.location.href = "../bibleminute/index.html";
    	}else{
			tizen.preference.setValue("launchFavoriteFromWidget", false);

        	window.history.back();

    	}
    }else{
		tizen.preference.setValue("launchFavoriteFromWidget", false);

    	window.history.back();

    }

};
var backToTheBible = function(){
	window.location.href = "../../index.html";
};

var showAnotherClock = function(direction){
	console.log(window.location.pathname);
	var platformVersion = filesystem.getMajorPlatformVersion();
	var patharray = window.location.pathname.split("/");
	console.log("patharray: " + patharray);
	var currentClockName = patharray[2];
	if(platformVersion===2){
		currentClockName = patharray[8];
	}
	console.log("currentClockName: "+currentClockName);
	var indexOfClock = clocks.indexOf(currentClockName);
	var nextClockIndex;
	if(direction==="left"){
		   nextClockIndex = indexOfClock + 1;
		   if (nextClockIndex>clocks.length-1){
				nextClockIndex = clocks.length-1;
		   }
	}else{
		   nextClockIndex = indexOfClock - 1;
		   if (nextClockIndex<1){
				nextClockIndex = "";
		   }	
	}

	console.log(clocks);
    var clockName = "clock"+nextClockIndex;
     window.location.href = "../"+clockName+"/index.html";
}

var exitApplication = function(){
	   var confirmExit = confirm("Exit BibleWatch2?");
	   if(confirmExit){
		   
		       tizen.application.getCurrentApplication().exit();		    			  		    			   
	   }
}

var addPopup = function(elements){
	popupList = elements;
};

var showPopup = function(){
	ui.hideSections(popupList);
	var pageID = popupList[0].parentElement.id;
	tizen.preference.setValue("activePage", pageID );
	console.log("showPopup: " + pageID);
	ui.showSection(popupList, 0);
	console.log("isFullScreen: " + isFullScreen);
	
};

function onHardwareKeysTap(event) {
	
    var keyName = event.keyName;
    page = tizen.preference.getValue("activePage");
    console.log("activePage: " + page);
    console.log("pageID: " + pageID);
    if (keyName === 'back') {
    	if (typeof(document.getElementById("page_AlertNotificationPage")) != 'undefined' && document.getElementById("page_AlertNotificationPage") != null){
    		ui.hideAlertNotification();
    	}else{
	    	if (tizen.preference.exists("backToSearchPage")){
	    		var isTrue = tizen.preference.getValue("backToSearchPage");
	    		if(isTrue){
	    			tizen.preference.setValue("backToSearchPage", false);
	    			 window.location.href = "../search/index.html";
	    		}
	    	}
	    	if (tizen.preference.exists("backToMinutePage")){
	    		var isTrue = tizen.preference.getValue("backToMinutePage");
	    		if(isTrue){
	    			tizen.preference.setValue("backToMinutePage", false);
	    			 window.location.href = "../bibleminute/index.html";
	    		}
	    	}
	    	if (tizen.preference.exists("backToFavoritesPage")){
	    		var isTrue = tizen.preference.getValue("backToFavoritesPage");
	    		if(isTrue){
	    			tizen.preference.setValue("backToFavoritesPage", false);
	    			 window.location.href = "../favorites/index.html";
	    		}
	    	}
	    	if (page==="page_ReadingPlanPage"){
	   		 window.location.href = "../options/index.html";
	       	}    
			if(page==="page_FavoritesPage"){
	   		   window.location.href = "../options/index.html";
	
			}  
	    	if (page==="BrowsePage"){
	    		 window.location.href = "../options/index.html";
	    	}
	    	if (pageID === "OptionsPage"){
	    		backToTheBible();
	    	}
	    	if(page==="ClockPage"){
	    		var windowLocationHref = tizen.preference.getValue("goBackToThisFromClock");
	    		window.location.href = windowLocationHref;
	    	}
	    	if(pageID==="SearchPage"){
	            window.location.href = "../options/index.html";
	    	}
	        if (page==="BibleMinutePage") { 
	            	//exitApplication();
	            	window.location.href = "../exitApplication/index.html";
	        }else if (page==="popup"){
	        	if(isFullScreen){
	              
	        		if(pageID==="BibleMinutePage"){
	        			isFullScreen = false;//settingsData["fullScreen"];
	        			settingsData["fullScreen"] = isFullScreen;
	        			settingsData_CRUD.update(settingsData);
	        			showPopup();
	        		}else{
	        			ui.minScreen();
	        			
	        			console.log("minimise screen");
	        			if(pageID==="page_ReadingPlanPage"){
	        				setActivePage("page_ReadingPlanPage");
	        			}
	        			if(pageID==="page_FavoritesPage"){
	        				setActivePage("page_FavoritesPage");
	        			}      			
	        		}
	
	        	}else{
	            	console.log("showPopup");
	                if (pageID==="page_SlideshowPage"){
	                	ui.hideSections(pages);
	                	ui.showSection(pages, 0);
	                	setActivePage("SearchPage");
	                	pageID = "SearchPage";
	                	console.log("pageID: " + pageID);
	      	
	                }
	                else{
	                	showPopup();       		
	
	                }
	        	}
	        }else{
	        	console.log("goBackFromHistory");
	        	goBackFromHistory();
	        }
    	}
    }
}

var setActivePage = function(pageID){
	tizen.preference.setValue("activePage", pageID);
};

//add eventListener for tizenhwkey
document.addEventListener('tizenhwkey', onHardwareKeysTap);