var tryAgainDownloadButton = document.querySelector(".tryAgain");
var tryAgainDownloadButton2 = document.querySelector(".tryAgain2");


function tryAgainDownload_Handler(){
	  var callbackSuccessDownload = function(response){
		  
	       console.log("callbackSuccessDownload: " + callbackSuccessDownload);  
	       loadAlphabetList();
		   maximizeScreen.initFullScreen();

     };
	  var source = "https://raw.githubusercontent.com/gesab001/hymns/master/src/assets/hymns-youtube.json";
	  downloadMusicFile(source, callbackSuccessDownload);
}
tryAgainDownloadButton.addEventListener("click", tryAgainDownload_Handler);
tryAgainDownloadButton2.addEventListener("click", tryAgainDownload_Handler);