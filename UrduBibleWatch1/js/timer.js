var timer = function(){

	this.start = function(setCurrentID, updateProgressBar){
		timerInterval = setInterval(function(){
			setCurrentID();
			updateProgressBar();
		}, 1000);
	};
	
	this.stop = function(){
		//console.log("timer stop");
		clearInterval(timerInterval);
	};
	
	this.destroy = function(){
		this.stop();
		timerInterval = null;
	};
	
	this.getSeconds = function(){

			var now = new Date();
			//document.getElementById("mainPageDateDisplay").innerHTML = dayDateMonthString + "<br>" + timeString;
			var seconds = now.getSeconds();//(now.getSeconds() / 60) * 100;	
			return seconds;
	};
}