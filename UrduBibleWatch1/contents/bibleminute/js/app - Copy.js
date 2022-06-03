var bookData;
var references;
var version = "kjv";
var book = "1_Chronicles";
var chapter = "1";
var verse = "1";
var totalVerses = 31102;
var goToBrowseButton;

function readBibleVerse(){
	var currentID = getCurrentID(totalVerses);
	console.log("currentID: " + currentID);
	console.log(bookData["book"][chapter]["chapter"][verse]["verse"]);
	var reference = book + " " + chapter + ":" + verse;
	var wordOfGod = bookData["book"][chapter]["chapter"][verse]["verse"];
    document.getElementById("bibleverse").innerHTML =  "<span style='color: yellow;'>"+reference + "</span><br>"+wordOfGod ;
    document.getElementById("bibleverse2").innerHTML =  "<span style='color: yellow;'>"+reference + "</span><br>"+wordOfGod ;
}

function getBookChapterVerse(currentID){

	function getBook(currentID, callback){
		
		book = "Genesis";
		for (bookItem in references){
			//console.log(bookItem);
			var start = references[bookItem]["start"];
			var end = references[bookItem]["end"];
			//console.log("start: " + start);
			//console.log("end: " + end);
			if (currentID>=start && currentID<= end){
				book = bookItem;
				break;
			}
		}
		console.log("book match found: " + book);
		callback(book, currentID);
	}
	function getChapter(book, currentID){
		chapter = "1";
		chapters = references[book]["chapter"];
		for (chapterItem in chapters){
			//console.log(chapterItem);
			var start = chapters[chapterItem]["startID"];
			var end = chapters[chapterItem]["lastID"];
			//console.log("start: " + start);
			//console.log("end: " + end);
			if (currentID>=start && currentID<= end){
				chapter = chapterItem;
				
				break;
			}			
		}
		getVerse(book, chapter, currentID);
		
	}
	function getVerse(book, chapter, currentID){
		verse = "1";
		var startID = references[book]["chapter"][chapter]["startID"];
		var lastID = references[book]["chapter"][chapter]["lastID"];
		console.log("startID: " + startID);
		console.log("lastID: " + lastID);
		verse = currentID - startID + 1;
		verse = verse.toString();
		console.log(book + " " + chapter + " " + verse);

		loadSelectedBook();
		
	}
	function loadSelectedBook(){
		if (tizen.preference.exists(book)){
			console.log(book + " exists in preferences");

			bookData = JSON.parse(tizen.preference.getValue(book));
			readBibleVerse();
		}else{
			console.log(book + " doesn't exist in preferences");

			loadJS("../../zipbibles/"+version+"/"+book+".js", false, saveBookToPreferences);
		}
	}
	getBook(currentID, getChapter);
}
function saveBookToPreferences(){
	tizen.preference.setValue(book, JSON.stringify(bookData));
	readBibleVerse();
}
function saveReferencesToPreferences(){
	console.log("saveReferencesToPreferences");
	tizen.preference.setValue("references", JSON.stringify(references));
	console.log(getCurrentID(totalVerses));
	var currentID = getCurrentID(totalVerses);
	getBookChapterVerse(currentID);


}




function getCurrentID (totalVerses) {

    var numberOfVerses = totalVerses;
    var date1 = new Date();
    var date2 = new Date(2018, 5, 23, 14, 45, 0, 0);
    var difference = date1.getTime() - date2.getTime();
    var minutesDifference = Math.floor(difference/1000/60)+1;
    var x =  minutesDifference % totalVerses || 0;
    return x;
}
function  loadJS(FILE_URL, async, callback) {
  var scriptEle = document.createElement("script");

  scriptEle.setAttribute("src", FILE_URL);
  scriptEle.setAttribute("type", "text/javascript");
  scriptEle.setAttribute("async", async);

  document.body.appendChild(scriptEle);

  var onload = function(){
	  console.log("script loaded");
	  callback();

  };
  var onerror = function(ev){
	    console.log("Error on loading file", ev);
  };
  // success event 
  scriptEle.addEventListener("load", onload);
   // error event
  scriptEle.addEventListener("error", onerror);
}


function saveBookToPreferences(){
	tizen.preference.setValue(book, JSON.stringify(bookData));
	readBibleVerse();
}

if (tizen.preference.exists("references")){
	console.log("references exists in preferences");

	references = JSON.parse(tizen.preference.getValue("references"));
	var currentID = getCurrentID(totalVerses);
	getBookChapterVerse(currentID);
}else{
	console.log("references doesn't exist in preferences");

	loadJS("../../references4.js", false, saveReferencesToPreferences);
}

function handleVisibilityChange(){
    if (document.visibilityState === "visible") {
    	var currentID = getCurrentID(totalVerses);
    	getBookChapterVerse(currentID);
    }
}
document.addEventListener('visibilitychange', handleVisibilityChange);

function goToBrowsePage(){
    var browseSettings = {};
    browseSettings["book"] = book;
    browseSettings["chapter"] = chapter;
    browseSettings["verse"] = verse;
    settingsData_CRUD.saveToPreferences("browseSettingsBrowsePage", browseSettings);
    window.location.href = "../browse/index.html";
}
goToBrowseButton = document.querySelector(".goToBrowseButton");
goToBrowseButton.addEventListener("click", goToBrowsePage);


