

var progress = (function(){
	
	this.updateProgressBarManual = function(currentValue, total) {
	    var percent = (currentValue / total) * 100;
	    progress.setProgress(percent, "progressBar");
	};
	this.setProgress = function(percent, elementId)
	{
		//console.log("setProgress percent: " + percent);
		//console.log("setProgress elementId: " + elementId);
		// Pointer to the <circle> element
	  var progress = document.getElementById(elementId);
	  // Get the length of the circumference of the circle
	  var circumference = progress.r.baseVal.value * 2 * Math.PI;
	  // How long our stroke dash has to be to cover <percent> of the circumference?
	  var dashLength = percent * circumference / 100;
	  // Set the "stroke-dasharray" property of the cicle
	  progress.style.strokeDasharray = dashLength + ' ' + circumference;
	  //console.log("progress.style.strokeDasharray: " + dashLength + ' ' + circumference);
	};
	return this;
}());