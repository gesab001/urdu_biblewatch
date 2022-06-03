/**
 * 
 */

var menuPage = function(){
	var page = document.getElementById("page_OptionsPage");
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
        hideSection(currentIndex);
        showSection(nextIndex);
	};
    var nextContent = function(currentIndex) {
    	if(currentIndex!=2){
            var nextIndex = currentIndex + 1;
            
            console.log("nextContent: " + nextIndex);
            updateContent(currentIndex, nextIndex );
            updateIndicator(currentIndex, nextIndex);   		
    	}


    };

    var prevContent = function(currentIndex) {
    	
    	if(currentIndex!=0){
            var nextIndex = currentIndex - 1;

            console.log("prevContent: " + nextIndex);
            updateContent(currentIndex, nextIndex );
            updateIndicator(currentIndex, nextIndex);   		
    	}


    };
    
    var checkDirection = function(direction, currentIndex){
    	console.log("direction: " + direction);
    	if(direction==="left"){
    		nextContent(currentIndex);
    	}else{
    		prevContent(currentIndex);
    	}
    };
	var bindEvents = function (){
		console.log("bindEvents");
		console.log(sections.length);
		for (var x=0; x<sections.length; x++){
			
			var content = sections[x];
			swipe(content, checkDirection, x);
		}
		for (var x=0; x<sections.length; x++){
			
			sections[x].style.display = "none";

		}		
		sections[0].style.display = "block";
	};
	
	bindEvents();

}

menuPage();


