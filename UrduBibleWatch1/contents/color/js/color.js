var color =  (function() {
	

	this.getColor = function (event, ctx, callback){
		var x, y;
        if (event.touches.length >= 1) {
        	event.preventDefault(); /* Prevent default scroll action */
            console.log("event.touches offSetX: " + event.touches[0].clientX);
            console.log("event.touches offSetY: " + event.touches[0].clientY);
    	    x = event.touches[0].clientX;
    	    y = event.touches[0].clientY; 
        }else{
    	    x = event.offsetX;
    	    y = event.offsetY;        	
        }


	    var color = ctx.getImageData(x, y, 1, 1).data;
	    //alert("x coords: " + guessX + ", y coords:     " + guessY);	
	    console.log("color: " + color);
	    var colorObjectType = typeof color[0];
	    var normalArray = Array.prototype.slice.call(color);
	    console.log("colorObjectType: " + colorObjectType);
	    callback(normalArray);
	    


	};
	this.getColorVersion2 = function (event, ctx, callback){
		var x, y;
        if (event.touches.length >= 1) {
        	event.preventDefault(); /* Prevent default scroll action */
            console.log("event.touches offSetX: " + event.touches[0].clientX);
            console.log("event.touches offSetY: " + event.touches[0].clientY);
    	    x = event.touches[0].clientX;
    	    y = event.touches[0].clientY; 
        }else{
    	    x = event.offsetX;
    	    y = event.offsetY;        	
        }
	    var color = ctx.getImageData(x, y, 1, 1).data;
	    //alert("x coords: " + guessX + ", y coords:     " + guessY);	
	    var colorString = [color[0].toString(), color[1].toString(), color[2].toString(), color[3].toString()];
	    console.log("color: " + colorString);

	    callback(colorString);
	    
	};
	
    return this;
}());