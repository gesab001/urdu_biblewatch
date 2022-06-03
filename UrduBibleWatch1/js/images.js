/**
 * 
 */

/**
 * 
 */

var images =(function() {

    this.updatePage = function(divEl, jsonData){
    	for (var x=0; x<jsonData["items"].length; x++){
    		var imageEl = document.createElement("IMG");
    		var url = jsonData["items"][x];
    		console.log("image url: " + url);
    		imageEl.src = url;
    		imageEl.id = "backgroundImage-"+x;
    		imageEl.className = "backgroundImages";
    		divEl.appendChild(imageEl);
    	}
    };
    
	
    return this;
}());

