var tryAgainDownloadButton = document.querySelector(".tryAgain");
var tryAgainDownloadButton2 = document.querySelector(".tryAgain2");


function tryAgainDownload_Handler(){
	confirmDownloadGo();

}
tryAgainDownloadButton.addEventListener("click", tryAgainDownload_Handler);
tryAgainDownloadButton2.addEventListener("click", tryAgainDownload_Handler);