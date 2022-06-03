
var pageID= "ColorPage", 
colorWheelCanvas,
platformVersion,
colorWheelImage,
selectedColorDiv,
selectedColor,
ctx;

function showColorWheel(){
	  var c = colorWheelCanvas;
	  ctx = c.getContext("2d");
	  var img = colorWheelImage;
	  
	  //https://cdn.britannica.com/70/191970-050-1EC34EBE/Color-wheel-light-color-spectrum.jpg?q=60";
	  ctx.drawImage(img, 0, 0, 370, 370);
	  console.log("drawing image");
}




function setColor(color){
	selectedColor = color;
	//var backgroundImageDiv = document.getElementById("backgroundImage");
	//backgroundImageDiv.style.backgroundImage = "none";
	//backgroundImageDiv.style.backgroundColor = "rgba("+color+")";
	ui.showElement(selectedColorDiv);
	ui.updateBackgroundColor(selectedColorDiv, selectedColor);
}

function onTouchMove(event){
	color.getColor(event, ctx,setColor);
}

function onTouchStart(event){
	color.getColor(event, ctx, setColor);
}

function onTouchMoveVersion2(event){
	color.getColorVersion2(event, ctx,setColor);
}

function onTouchStartVersion2(event){
	color.getColorVersion2(event, ctx, setColor);
}

function saveColor(color){
	    console.log("saveColor: " + color);
		var jsonObj = {"backgroundType": "color", "backgroundColor": color};
		var string = JSON.stringify(jsonObj);
		tizen.preference.setValue("backgroundSettings", string);
		window.location.href = "../bibleminute/index.html";

}
function onTouchEnd(event){
	var confirmSave = confirm(LANG_JSON_DATA["TRANSLATIONS"]["COLOR_PAGE"]["confirmBackroundChange"]);
	if(confirmSave){
		saveColor(selectedColor);
	}
	
}

function bindEvents(){
	//platformVersion = filesystem.getMajorPlatformVersion();
	setActivePage("ColorPage");

	selectedColorDiv = document.getElementById("selectedColor");

	
	colorWheelCanvas = document.getElementById("colorWheelCanvas");
	colorWheelImage = document.getElementById("colorWheelImage");

	//if (platformVersion===2){
	//	colorWheelCanvas.addEventListener("touchmove", onTouchMoveVersion2);
	//	colorWheelCanvas.addEventListener("touchstart", onTouchStartVersion2);		
	//}else{
		colorWheelCanvas.addEventListener("touchmove", onTouchMove);
		colorWheelCanvas.addEventListener("touchstart", onTouchStart);
	//}

	colorWheelCanvas.addEventListener("touchend", onTouchEnd);
	
	showColorWheel();
}

function unBindEvents(){
	selectedColorDiv = null;
	colorWheelCanvas.removeEventListener("touchmove", onTouchMove);
	colorWheelCanvas.removeEventListener("touchstart", onTouchStart);	
	colorWheelCanvas.removeEventListener("touchend", onTouchEnd);

	colorWheelCanvas = null;
	colorWheelImage = null;
	
	ctx = null;
	selectedColor = null;
	

}

function init(){
	bindEvents();
	tizen.preference.setValue("fromOptionsPage", false);

}


window.onload = function(){
    init();


};

window.onunload = function(){
	

	unBindEvents();
}