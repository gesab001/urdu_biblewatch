//HOME PAGE JAVASCRIPT

var page,
pageID = "SettingsPage",
biblesListPage,
clockButton,
sections,
settingOptionElements,
galleryButton,
isFullScreen = false,
downloadSlowHelpButton,
cancelDownloadButton,
downloadId,
virtualroot, 
downloadFolder,
downloadFilename,

bibleVersionsList,
bibleList,
alphabetList,
languageLanguageList,
listenersList,
versionList,
elementList,

selectedLetter,
selectedLanguage,

languagesListButton,
updateBiblesListButton,
backButton,
backgroundButton,
textToSpeechButton,

currentView,
settingsData,

book,
bookData,
currentID,

virtualroot,
folder,
filename,
source,
destination,

description = document.getElementById("downloadBibleStatus"),
descriptionNoConnection = document.getElementById("downloadBibleStatusNoConnection"),
descriptionDownloadFail = document.getElementById("downloadBibleStatusFail"),

selectedVersion,
numberOfLanguages;


function translatePage(){
	//TRANSLATIONS
	console.log("translation test");
	var TRANSLATIONS = LANG_JSON_DATA["TRANSLATIONS"]["SETTINGS_PAGE"];
	var settingsPageTitle = document.getElementById("settingsPageTitle");
	settingsPageTitle.innerHTML = TRANSLATIONS["settings"];
	
	var choose_background = document.getElementById("choose_background");
	choose_background.innerHTML = TRANSLATIONS["choose_background"];	
	
	var textToSpeech = document.getElementById("textToSpeech");
	textToSpeech.innerHTML = TRANSLATIONS["textToSpeech"];	

	var labelOn = document.getElementById("labelOn");
	labelOn.innerHTML = TRANSLATIONS["on"];	
	
	var ttsoff = document.getElementById("labelOff");
	labelOff.innerHTML = TRANSLATIONS["off"];	
}

function init(){

	bindEvents();
	translatePage();
	

}

function openDownloadPopup (){
	ui.hideSections(sections);
	ui.showSection(sections, 1);
}
function closeDownloadPopup (){
	ui.hideSections(sections);
	ui.showSection(sections, 0);
	setActivePage(page.id);

}

function saveSettings(){
	
	
	var callback = function(jsonObj){
	    var settingsData = jsonObj;
	    settingsData["bibleversion"] = selectedVersion;
	    settingsData_CRUD.update(settingsData);
	    window.location.href = "../bibleminute/index.html";
	};
	settingsData_CRUD.get(callback);
}
function initDownload(virtualroot, folder, filename, selectedFileToDownload, downloadType, callback){
	var confirmToDownload;
	
	

	var onStartCallBack = function(id){
		downloadId = id;
		openDownloadPopup();
	};
	var onCanceledCallBack = function(){
        if (downloadType==="update"){
    		alert("Update canceled.");

        }else{
    		alert("Download canceled.");
        }
		closeDownloadPopup();        	

	};
	var onCompletedCallback = function(fullPath){
        downloadId = null;
		closeDownloadPopup();

        if (downloadType==="update"){
    		alert("Update complete.");
    		window.location.reload();

        }else{
    		alert("Download complete.");
    		saveSettings();
        }
		
	};
	var onFailedCallback = function(error){
        if (downloadType==="update"){
    		alert("Update failed.");

        }else{
    		alert("Download failed.\n" + error);
       	
        }
		closeDownloadPopup();
	
	};

	var downloadfile = function(){
		var source = 'https://raw.githubusercontent.com/gesab001/bibles/main/' + filename;
		var destination = virtualroot + "/" + folder;
		if (folder==null){
			destination = virtualroot;
		}
		download.startDownload(source, destination, onStartCallBack, onCanceledCallBack, onCompletedCallback, onFailedCallback);
		openDownloadPopup();	
	};
	var onCheckFileExists = function(fileExists){
		if(fileExists){
			if(downloadType==="update"){
				confirmToDownload = confirm("Are you sure\nyou want to\nupdate\n"+selectedFileToDownload+"?");
			}else{
				confirmToDownload = confirm(selectedFileToDownload.toUpperCase() + "\nalready\ndownloaded.\nDownload\nagain?");
				
			}
			if (confirmToDownload){		
			   filesystem.deleteFile(virtualroot, folder, filename, downloadfile );   
			}
		}else{
			if(downloadType==="update"){
				confirmToDownload = confirm("Are you sure\nyou want to\nupdate\n"+selectedFileToDownload+"?");
			}else{
			confirmToDownload = confirm("Download\n" + selectedFileToDownload.toUpperCase() + "?");
			}
			if (confirmToDownload){
				downloadfile();
			}
		}

	};
	var checkFileExists = function(){
		filesystem.fileExists(virtualroot, folder, filename, onCheckFileExists);		
	};
	if (folder!=null){
		filesystem.createFolder(virtualroot, folder, checkFileExists);
		
	}else{
		checkFileExists();
	}
	
}
function downloadSelectedVersion(selectedBibleToDownload){
	selectedVersion = selectedBibleToDownload;
	virtualroot = "wgt-private";
	var folder = "zipbibles";
	downloadFolder = folder;
	var filename = selectedBibleToDownload+".zip";
	downloadFilename  = filename;
	var downloadType = "download";
	var fullVersionName = document.getElementById(selectedBibleToDownload).innerHTML;
	var selectedFileToDownload = fullVersionName + "\n("+ selectedBibleToDownload+")";
	
	var onDownloadSuccess = function(){
		
	};
	initDownload(virtualroot, folder, filename, selectedFileToDownload, downloadType, onDownloadSuccess);
}

function updateBibleList(){
	virtualroot = "wgt-private";
	var folder = null;
	downloadFolder = folder;
	var filename = "bibles.json";
	var fileToUpdate = "Bible List";
	downloadFilename  = filename;
	var downloadType = "update";
	
	var onUpdateSuccess = function(){
		console.log("success update");
		bible.getBibleVersionsList(initList);

	};
	initDownload(virtualroot, null, filename, fileToUpdate , downloadType, onUpdateSuccess);
}

function getFullNameVersionsFromALanguage(json){
	var result = [];
	for (version in json){
		var fullname = json[version]["fullName"];
		var label = fullname;
		var id = version;
		var jsonObj = {"label": label, "id": id};
		result.push(jsonObj);
	}
	return result;
}

function createBibleVersionsList(language){
    currentView = "createBibleVersionsList";
	selectedLanguage = language;
	biblesList.removeChild(elementList);

	var versionListFromALanguage = bibleVersionsList["items"][selectedLanguage];
	var fullNameVersionsList = getFullNameVersionsFromALanguage(versionListFromALanguage);
    

	
	
	var addButtonListeners = function(){
		listmaker.addListenersToItemList(elementList, downloadSelectedVersion);
	};
	var loadButtonList = function(doc){
		elementList = doc;
		bibleList.appendChild(elementList);
		addButtonListeners();
	};

	var createButtonList = function(){

		listmaker.createButtonList(fullNameVersionsList, loadButtonList);
	};
	createButtonList();
}
function createLanguageList(letter){
    currentView = "createLanguageList";
	backButton.style.display = "block";
	selectedLetter = letter;
	biblesList.removeChild(elementList);

	var languageList = [];

	for (x in languages){
		var firstLetter = languages[x].substring(0,1).toUpperCase();
		if (firstLetter==selectedLetter){
			var label = languages[x];
			var id = languages[x];
			var jsonObj = {"label": label, "id": id};
			languageList.push(jsonObj);
		}
	}
	
	
	var addButtonListeners = function(){
		listmaker.addListenersToItemList(elementList, createBibleVersionsList);
	};
	var loadButtonList = function(doc){
		elementList = doc;
		bibleList.appendChild(elementList);
		addButtonListeners();
	};

	var createButtonList = function(){

		listmaker.createButtonList(languageList, loadButtonList);
	};
	createButtonList();

}
function createAlphabetList(){
	var sections = settingOptionElements;
	ui.hideSections(sections);
	ui.showSection(sections, 0);
	
    currentView = "createAlphabetList";
	backButton.style.display = "none";
	if (bibleList.children.length>0){
		biblesList.removeChild(elementList);
	}

	
	var addButtonListeners = function(){
		listmaker.addListenersToItemList(elementList, createLanguageList);
	};
	var loadButtonList = function(doc){
		elementList = doc;
		bibleList.appendChild(elementList);
		addButtonListeners();
		ui.showElement(page);

	};

	var createButtonList = function(){

		listmaker.createButtonList(alphabetList, loadButtonList);
	};
	createButtonList();
}

function initList(jsonObj){
	ui.hideElement(page);
	bibleVersionsList = jsonObj;
	languages = Object.keys(bibleVersionsList["items"]);
	numberOfLanguages = languages.length;


	var setAlphabetList = function(json){
		alphabetList = json;
		createAlphabetList();
	};
	listmaker.createAlphabet(languages, setAlphabetList);
}

function goBackToPreviousBibleList(){


	if (currentView==="createLanguageList"){
		createAlphabetList();
	}
	if (currentView==="createBibleVersionsList"){
		createLanguageList(selectedLetter);
	}
}
function alertPopupSlowDownload(){
	alert("disconnect bluetooth\nand\nconnect to wifi");
	
}
function cancelDownload(){
	 try{
		 tizen.download.cancel(downloadId);		 
	 }catch(e){
		 console.log(e.message);
	 }

	 closeDownloadPopup();
	 
	 var onSuccessCallback = function(){
		console.log("downloaded file deleted");
	 };
	 filesystem.deleteFile(virtualroot, downloadFolder, downloadFilename, onSuccessCallback);   

}

function backgroundButton_handler(){
	var sections = settingOptionElements;
	ui.hideSections(sections);
	ui.showSection(sections, 1);


}
function showTTSSetting(){
	var sections = settingOptionElements;
	ui.hideSections(sections);
	ui.showSection(sections, 2);	
}
function tts_eventHandler(event){
	console.log("input id: " + event.target.value);
	tizen.preference.setValue("tts_settings", event.target.value);
}
/*
function showBackgroundSourceOptions(){
	ui.hideSections(sections);
	ui.showSection(sections, 2);	
	setActivePage("popup");

}
*/
rotaryEventHandler = function(e) {
    if (e.detail.direction === 'CW') {

    	console.log("CW");
    } else if (e.detail.direction === 'CCW') {

    	console.log("CCW");

    	}
};

function tryAgainDownload(){
	console.log("try again download");
	//networkInfo = {"networkType": 'CONNECTED'};
	downloadSelectedVersion(selectedVersion);

}

function bindEvents(){
   
	page = document.getElementById("SettingsPage");
	
	biblesListPage = document.getElementById("biblesListPage");
	
	//galleryButton  = document.querySelector(".galleryButton");
	//galleryButton.addEventListener("click", showBackgroundSourceOptions);
	
	bibleList = document.getElementById("biblesList");
	languagesListButton = document.querySelector(".languagesListButton");
	languagesListButton.addEventListener("click", createAlphabetList);
	
	updateBiblesListButton = document.querySelector(".updateBiblesListButton");
	updateBiblesListButton.addEventListener("click", updateBibleList);

	backgroundButton = document.querySelector(".backgroundButton");
	backgroundButton.addEventListener("click", backgroundButton_handler);
	
	downloadSlowHelpButton = document.getElementById("downloadSlowHelp");
	downloadSlowHelpButton.addEventListener("click", alertPopupSlowDownload);
	
	cancelDownloadButton = document.getElementById("cancelDownloadButton");
	cancelDownloadButton.addEventListener("click", cancelDownload);
	
	backButton = document.getElementById("backButton");
	backButton.addEventListener("click", goBackToPreviousBibleList);

	textToSpeechButton = document.querySelector(".textToSpeechButton");
	textToSpeechButton.addEventListener("click", showTTSSetting);

	 var ttsradiobuttons = document.querySelectorAll(".radioTypeButton");
	 for (var x=0; x<ttsradiobuttons.length; x++){
			var el = ttsradiobuttons[x];
			var input = el.querySelector("input");
			input.addEventListener("change", tts_eventHandler);		
	 }
	 if(tizen.preference.exists("tts_settings")){
			isTTS = tizen.preference.getValue("tts_settings");
			if(isTTS==="on"){
				ttsradiobuttons[0].querySelector("input").checked = true;
				
			}else{
				ttsradiobuttons[1].querySelector("input").checked = true;
			}
		}
	sections = document.querySelectorAll(".settingsContent");	
	settingOptionElements = document.querySelectorAll(".settingOption");
	
	setActivePage(page.id);
	addPopup(sections);

	ui.hideSections(sections);
	ui.showSection(sections, 0);
	
	//bible.getBibleVersionsList(initList);
	ui.addCircularScrollBar(biblesListPage);
	
	var tryAgainDownloadButton = document.querySelectorAll(".tryAgain");

	tryAgainDownloadButton[0].addEventListener("click", tryAgainDownload);	
	tryAgainDownloadButton[1].addEventListener("click", tryAgainDownload);	
	backgroundButton.click();
	tizen.preference.setValue("fromOptionsPage", false);
	


}


function unBindEvents(){
	
	//galleryButton.removeEventListener("click", showBackgroundSourceOptions);
	//galleryButton  = null;
	
	backgroundButton.removeEventListener("click", backgroundButton_handler);
	backgroundButton = null;
	
	backButton.removeEventListener("click", goBackToPreviousBibleList);
    backButton = null;
	
	languagesListButton.removeEventListener("click", createAlphabetList);
	languagesListButton = null;

	downloadSlowHelpButton.removeEventListener("click", alertPopupSlowDownload);
	downloadSlowHelpButton = null;

	updateBiblesListButton.removeEventListener("click", updateBibleList);
	updateBiblesListButton = null;

	page = null;
	biblesListPage = null;
	sections = null;
	settingOptionElements = null;


	


	
}
window.onload = function(){
    init();


};

window.onunload = function(){
	

	unBindEvents();
}

