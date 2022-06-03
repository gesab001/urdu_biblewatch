var pageID = "page_DownloadedBiblesPages",
virtualrootDownload = "wgt-private",
bibleDownloadfolder = "zipbibles",
bibleListDiv = document.getElementById("downloadedBiblesList"),
bibleListDivEdit = document.getElementById("downloadedBiblesListEdit"),
downloadedBibleversionslist_listeners = [],
downloadedBibleversionslistDelete_listeners = [],
deletableVersions = [],
isRefreshAfterDelete = false,
selectedBibleToDownload,
settingsData,
versionToDelete;

window.onload = function() {

	function saveSettings(){
		settingsData_CRUD.update(settingsData);
		
	}
	function downloadedBibleVersion_eventHandler(event){
		console.log("input id: " + event.target.value);
		selectedBibleToDownload = event.target.value.split("_")[1].split(".")[0];
		console.log("selectedBibleToDownload " + selectedBibleToDownload);
		settingsData["bibleversion"] = selectedBibleToDownload;
	  	var version = settingsData["bibleversion"];
	  	saveSettings();	
		
		//console.log("isSwitchLanguageShortcut: " + isSwitchLanguageShortcut);
	}
	
	function deleteDownloadBibleButtonListener(){
		var zipfile, version, confirmDelete;
		if (this.id.indexOf("kjv")!=-1){
			alert("you cannot delete\nthe KJV bible");
			confirmDelete = false;
		}else{
		    zipfile = this.id.split("_")[2];
			version = zipfile.split(".")[0].toUpperCase();
			versionToDelete = version.toLowerCase();
			console.log("delete this bible: " + settingsData["bibleversion"].toUpperCase());
			console.log("delete this bible: " + version);
			
			/*if(version===settingsData["bibleversion"].toUpperCase()){
				alert(version + " version is \ncurrently in use.\nSwitch to another\n version before \ndeleting this one.")
			}else{*/
				confirmDelete = confirm("are you sure\nyou want to\ndelete\n" + version + "?");
				console.log("delete confirmation? " + confirmDelete);			
			//}

		}


		if (confirmDelete){
			
			var deleteBibleDirectory = function(){
				var onResolveError = function(e) {
					  console.log('Error!' + e.message);
					};

				var onResolveSuccess = function(dir) {
					  var onListFilesSuccess = function(files) {
						    files.forEach(function(file) {
						        console.log(file.name);
						        if (file.isDirectory && file.name==versionToDelete) {
						        	console.log("file.fullPath: " + file.fullPath);
						            dir.deleteDirectory(file.fullPath, onDeleteSuccess, onDeleteError); 
						        }
						    });
						  };
						  
						  dir.listFiles(onListFilesSuccess, onError);
				
				  };
				  

				var onDeleteSuccess = function() {
				    console.log('Deleted');
					isRefreshAfterDelete = true;
			      	settingsData["version"] = "kjv";
			      	var version = settingsData["version"];
			    	setCheckedRadioButton();
			      	saveSettings();			
					switchVersionButton_handler();		
				};
				
				var onDeleteError = function(e){
					console.log(e.message);
				};
				
				
				//tizen.filesystem.resolve('wgt-private', onResolveSuccess, onResolveError);				
			};
			var deleteBibleJsonFiles = function(){
				    console.log("deleteBibleJsonFiles");
					var onResolveError = function(e) {
						  console.log('Error!' + e.message);
						};

					var onResolveSuccess = function(dir) {
						  var onListFilesSuccess = function(files) {
							    files.forEach(function(file) {
							        console.log(file.name);
							        if (file.isDirectory && file.name.toLowerCase()===versionToDelete) {
							        	console.log("file.isDirectory match delete it");
							           dir.deleteDirectory(file.fullPath, true, onDeleteSuccess, onDeleteError);
							        }
							    });
							  };
							  
							  dir.listFiles(onListFilesSuccess, onError);
					
					  };
					  

					var onDeleteSuccess = function() {
					    console.log('Deleted');
					    //deleteBibleDirectory();
					  /*  var platformVersion = filesystem.getMajorPlatformVersion();
					    if (platformVeresion===2){
					    	
					    }*/
						isRefreshAfterDelete = true;
				      	settingsData["version"] = "kjv";
				      	var version = settingsData["version"];
				    	setCheckedRadioButton();
				      	saveSettings();			
						switchVersionButton_handler();
					};
					
					var onDeleteError = function(e){
						console.log(e.message);
					};
					
					
					//tizen.filesystem.resolve('wgt-private', onResolveSuccess, onResolveError);
			};
			var onDelete = function(){
				console.log("successfully deleted " + zipfile);
				deleteBibleJsonFiles();
			
			}
			var onDeleteError = function(e){
				console.log(e.message);
				console.log("failed to  delete " + zipfile);
			}
			var onSuccess = function (dir){
				 // console.log("on sucess: " );
				dir.deleteFile(virtualrootDownload+"/"+bibleDownloadfolder+"/"+zipfile, onDelete, onDeleteError);

			}
			
			var onError = function (e){
			     console.log(e);
		    }
			//tizen.filesystem.resolve(virtualrootDownload+"/"+bibleDownloadfolder, onSuccess);
		}
	}
	function setCheckedRadioButton(){
		 try{
			 var selectedVersion = settingsData["bibleversion"];
			 var checkedRadioButtonId = "downloaded_"+selectedVersion+".zip";
			 var checkedRadioButton = document.getElementById(checkedRadioButtonId);
			 checkedRadioButton.checked = true;			 
		 }catch(e){
			 console.log(e.message);
			 settingsData["bibleversion"] = "kjv";
			 var selectedVersion = settingsData["bibleversion"];
			 var checkedRadioButtonId = "downloaded_"+selectedVersion+".zip";
			 var checkedRadioButton = document.getElementById(checkedRadioButtonId);
			 if (checkedRadioButton!=null){
				 checkedRadioButton.checked = true;					 
			 }
			 
			selectedBibleToDownload = "kjv";
			console.log("selectedBibleToDownload " + selectedBibleToDownload);
			settingsData["bibleversion"] = selectedBibleToDownload;
		  	saveSettings();	
		 }

	}
	function editDownloadedBibles_Handler(){
		 var bibleListDiv = document.getElementById("downloadedBiblesList");
		 var bibleListDivEdit = document.getElementById("downloadedBiblesListEdit");
		if (bibleListDiv.style.display=="block"){
			 bibleListDiv.style.display = "none";
			 bibleListDivEdit.style.display = "block";
		}else{
			 bibleListDiv.style.display = "block";
			 bibleListDivEdit.style.display = "none";
		}

	}
	function switchVersionButton_handler(){
		console.log("switchVersionButton_handler");
		var getJsonData = function  () {
			var updatePage = function(files){
				
				 if (downloadedBibleversionslist_listeners.length>0){
					 for (var x=0; x<downloadedBibleversionslist_listeners.length; x++){
						 
						 var el = downloadedBibleversionslist_listeners[x];
					     el.removeEventListener("click", downloadedBibleVersion_eventHandler);		
					 }
					 downloadedBibleversionslist_listeners = [];
					 console.log("list of downloadedBibleversionslist_listeners: "+ downloadedBibleversionslist_listeners.length);
					 
				 }
				 if (downloadedBibleversionslistDelete_listeners.length>0){
					 for (var x=0; x<downloadedBibleversionslistDelete_listeners.length; x++){
						 
						 var el = downloadedBibleversionslistDelete_listeners[x];
					     el.removeEventListener("click", downloadedBibleVersion_eventHandler);		
					 }
					 downloadedBibleversionslistDelete_listeners = [];
					 console.log("list of downloadedBibleversionslistDelete_listeners: "+ downloadedBibleversionslistDelete_listeners.length);
					 
				 }
				 deletableVersions = [];
				 if(isRefreshAfterDelete){
					 bibleListDiv.style.display = "none";
					 bibleListDivEdit.style.display = "block";				 
				 }else{
					 bibleListDiv.style.display = "block";
					 bibleListDivEdit.style.display = "none";					 
				 }
				 


				 bibleListDivEdit.innerHTML = "";		 
				 bibleListDiv.innerHTML = "";
				 console.log
				  for (var x=0; x<files.length; x++){
					  if (files[x].indexOf("zip")!=-1){
						  var id = files[x];
						  var version = "downloaded_"+id;
						  var title = id.split(".")[0];  
						  //console.log("There are " + files[x].name + " in the selected folder");  
						  var newEl = document.createElement("DIV");
						  newEl.className = "download-bible-list-item";
						  var inputEl = document.createElement("INPUT");
						  inputEl.type = "radio";
						  inputEl.id =  version;
						  inputEl.name = "downloaded_language";
						  inputEl.value = version;
						  var labelEl = document.createElement("LABEL");
						  labelEl.htmlFor = version;
						  labelEl.innerHTML = title.toUpperCase() + " (" + LANG_JSON_DATA["FULLBIBLENAMES"][title]+")";
						  newEl.appendChild(inputEl);
						  newEl.appendChild(labelEl);
						  bibleListDiv.appendChild(newEl);	

					  }				  
				  }	
				  for (var x=0; x<files.length; x++){
					  if (files[x].indexOf("zip")!=-1){
						  var id = files[x];
						  var version = "downloaded_delete_"+id;
						  var title = id.split(".")[0];  

							  var newDelEl = document.createElement("DIV");
							  newDelEl.className = "delete-download-bible-list-item";
							  var delButtonText = document.createElement("DIV");
							  var delButtonIcon = document.createElement("DIV");
							  delButtonText.style.display = "inline";
							  delButtonText.float = "left";
							  delButtonIcon.style.display = "inline";
							  delButtonText.innerHTML =  title.toUpperCase();
							  delButtonIcon.id = version;
							  deletableVersions.push(version);
							  delButtonIcon.className = "trashDownloadedBibleButton";
							  delButtonIcon.addEventListener("click", deleteDownloadBibleButtonListener);
							  downloadedBibleversionslistDelete_listeners.push(delButtonIcon);
							  newDelEl.appendChild(delButtonText);
							  newDelEl.appendChild(delButtonIcon);
							  bibleListDivEdit.appendChild(newDelEl);		
					  }				  
				  }	
				  var downloadedBibleversionslist = document.querySelectorAll(".download-bible-list-item");
					 for (var x=0; x<downloadedBibleversionslist.length; x++){
							var el = downloadedBibleversionslist[x];
							var input = el.querySelector("input");
							input.addEventListener("change", downloadedBibleVersion_eventHandler);		
							downloadedBibleversionslist_listeners.push(input);
					 }
					 bibleListDiv.style.marginBottom = "50%";	
					 bibleListDivEdit.style.marginBottom = "50%";	

					 setCheckedRadioButton();
			}
			var onSuccessFiles = function(jsonObj){
				  console.log("There are " + jsonObj.length + " in the selected folder");
				  files = [];
				  for (var x=0; x<jsonObj.length; x++){
					  if(jsonObj[x].name.indexOf(".zip")!=-1){
						  files.push(jsonObj[x].name);					  
					  }
				  }
				  files.sort();
				  console.log("files: " + files);
				  if(files.length>1){
					  updatePage(files);				  
					  document.getElementById("downloadedBiblesSelectionTitle").style.display = "block";
					  document.getElementById("downloadedBiblesSelectionTitleOnlyOne").style.display = "none";
				  }else{
					  updatePage(files);				  
					  document.getElementById("downloadedBiblesSelectionTitle").style.display = "none";
					  document.getElementById("downloadedBiblesSelectionTitleOnlyOne").style.display = "block";
				  }
			};
			
			var onSuccessDir = function (dir){
			      dir.listFiles(onSuccessFiles, onerror);

			};
			
			var onError = function (e){
			     console.log(e.message);
			      files = ["kjv.zip"];
				  updatePage(files);				  
				  document.getElementById("downloadedBiblesSelectionTitle").style.display = "none";
				  document.getElementById("downloadedBiblesSelectionTitleOnlyOne").style.display = "block";
		    };
			try{
				var jsonObj = LANG_JSON_DATA["BIBLE_VERSIONS"];
				onSuccessFiles(jsonObj);
		     // tizen.filesystem.resolve(virtualrootDownload+"/"+bibleDownloadfolder, onSuccessDir, onError, "r");

			}catch(e){
				console.log(e);
			}

		};
		getJsonData();
	}
	function setSettingsData(jsonObj){
		settingsData = jsonObj;
		switchVersionButton_handler();

	}
	function bindEvents(){
		setActivePage(pageID);
		
		settingsData_CRUD.get(setSettingsData);
		document.getElementById("editDownloadedBibles").addEventListener("click", editDownloadedBibles_Handler);	
        var scrollBarElement = document.getElementById("downloadedBiblesListPage");
		ui.addCircularScrollBar(scrollBarElement);
		document.getElementById("downloadedBiblesTitle").innerHTML = LANG_JSON_DATA["TRANSLATIONS"]["BIBLEVERSIONS_PAGE"]["downloadedBibles"];
		document.getElementById("downloadedBiblesSelectionTitle").innerHTML = LANG_JSON_DATA["TRANSLATIONS"]["BIBLEVERSIONS_PAGE"]["chooseBibleVersion"];
	}
	function init(){
		bindEvents();
    	tizen.preference.setValue("fromOptionsPage", false);

	}
	
    init();
};

window.onunload = function() {
   
    
}