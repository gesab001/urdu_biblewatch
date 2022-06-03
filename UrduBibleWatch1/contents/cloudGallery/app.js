var pageID = "CloudGalleryPage",
isFullScreen = false,
description = document.getElementById("downloadBibleStatus"),
descriptionNoConnection = document.getElementById("downloadBibleStatusNoConnection"),
descriptionDownloadFail = document.getElementById("downloadBibleStatusFail"),
downloadId;

window.onload = function(){
  setActivePage("RemoteImageListPage");
     
      var imagesListJson,
      listOfUrlImages,
      _categoryName, 
      currentImageIndex,
      currentImageUri,
      categories = [],
      images,
      sections,
      imageIndex,      
      header = document.querySelector(".header"),
      categoryList = document.getElementById("categoryList"),
      categoryTitle = document.getElementById("categoryTitle"),
	  elementList,
      imageList = document.getElementById("imageList"),
      TRANSLATIONS = LANG_JSON_DATA["TRANSLATIONS"]["CLOUDGALLERY_PAGE"];
      //backButton = document.getElementById("backButton");
      
 

  function saveSettings(imageURI){
	   
	   var jsonObj = {"backgroundType": "image", "imageURI": imageURI};
	   var string = JSON.stringify(jsonObj);
	   tizen.preference.setValue("backgroundSettings", string);
	   
	   window.location.href = "../../index.html";
	   
  } 
  var saveImageAsBackground = function(ev){
           console.log("saveImageAsBackground id: " +ev);
           currentImageUri = this.id;
           console.log("currentImageUri id: " +currentImageUri);
          
	       var confirmChoice = confirm(TRANSLATIONS["confirmChoice"]);
	       if (confirmChoice){
	    	
   	          saveSettings(currentImageUri);

	       }
	       

  };
  var showImage = function(){
	  //imageURI = "https://raw.githubusercontent.com/gesab001/images/main/beaches/1/1_beaches0.png";//images[imageIndex];
	  console.log(currentImageUri);
	  var filename = currentImageUri.split("/");
	  filename = filename[filename.length-1];
	  var resizeFilename = "resize_250px_"+filename;
	  //imageDiv.src = currentImageUri.replace(filename, resizeFilename);

  };
  
  function createCategoriesJson(jsonObj){
	  for (category in jsonObj){
		    var jsonObj = {"label": TRANSLATIONS[category], "id": category};
		    categories.push(jsonObj);
	  }
	  showCategories();
  }
  
  
  function updatePhoto(){
	  currentImageUri = listOfUrlImages[currentImageIndex];
	  categoryTitle.innerHTML = _categoryName + "<br>" + (currentImageIndex + 1) + " of 10";
	  showImage();

  }

  function showPhotoList(categoryName){
	  
	  var callbackCheckInternetConnection = function(isConnected){
		  
		  if (isConnected){
			  loadPhotoList();
		  }else{
			  alert("You are not\nconnected to\nthe internet");
		  }
	  };
	  var loadPhotoList = function(){
		  imageList.innerHTML = "";
		  _categoryName = categoryName;
		  categoryTitle.innerHTML = TRANSLATIONS[_categoryName].toUpperCase() + "<br>" + "("+TRANSLATIONS["numberOfImages"]+")";
		  
		  currentImageIndex = 0;
		  listOfUrlImages = imagesListJson[categoryName]["1"];
	    	  for (var x=0; x<listOfUrlImages.length; x++){
	    		  var imageUri = listOfUrlImages[x];
	    		  var filename = "../../background_images"+imageUri;
	    		  var resizeFilename = filename;
				  var imageElContainer = document.createElement("DIV");
				  imageElContainer.className = "imageBackgroundListItem";
				  
				  var imageEl = document.createElement("DIV");
				  imageEl.className = "thumbnail";
				  imageEl.id = filename;
				  imageEl.style.backgroundImage = "url("+filename+")";
	    		  console.log("filename: " + filename);
	    		  console.log("imageEl.backgroundImage: " + imageEl.backgroundImage);

				  imageEl.addEventListener("click", saveImageAsBackground);
				  imageElContainer.appendChild(imageEl);	
				  imageList.appendChild(imageElContainer);	  	
	    	  }
		  

		  
		  //showImage();
		  setActivePage("popup");
		  ui.hideSections(sections);
		  ui.showSection(sections, 1);	  		  
	  };
	  //internet.checkInternetConnection(callbackCheckInternetConnection);	  
	  loadPhotoList();
  }
  
  function showCategories(){
	 //   backButton.style.display = "none";
	    setActivePage("RemoteImageListPage");

	    console.log(categories);	  
		if (categoryList.children.length>0){
			categoryList.removeChild(elementList);
		}
		var addButtonListeners = function(){
			listmaker.addListenersToItemList(elementList, showPhotoList);
		};
		var loadButtonList = function(doc){
			elementList = doc;
			categoryList.appendChild(elementList);
			addButtonListeners();
		    ui.hideSections(sections);
		    ui.showSection(sections, 0);
	
		};
	
		var createButtonList = function(){
	
			listmaker.createButtonList(categories, loadButtonList);
		};
		createButtonList();
  }

  
  function onSwipe(direction){
	  console.log("onSwipe direction: " + direction);
	  if (direction==="left"){
		  if (currentImageIndex<9){
			  currentImageIndex = currentImageIndex + 1;
			  updatePhoto();
		  }
	  }else{
		  if (currentImageIndex>0){
			  currentImageIndex = currentImageIndex - 1;
			  updatePhoto();
			  

		  }  
	  }
  }
  var readAsJson = function(str){
	  //var jsonObj = JSON.parse(str);
	  console.log("imagesList: " + str);
	  imagesListJson = imagesList;
	  createCategoriesJson(imagesList);
	  imagesList = null;
	  
  };

  sections = document.querySelectorAll(".settingsContent");
  addPopup(sections);
  ui.hideSections(sections);
  setActivePage("RemoteImageListPage");
  var url = "https://raw.githubusercontent.com/gesab001/images/main/imagesList.json";
  //internet.getOnlineResource(url, readAsJson);
  //filesystem.getJsonData("wgt-package", "imagesList.json", readAsJson);
  var FILE_URL = "../../imagesList.js";
  filesystem.loadJS(FILE_URL, "imagesList", false, readAsJson);
  //backButton.addEventListener("click", showCategories);
  var categoryPage = document.getElementById("categoryPage");
  var photoPage = document.getElementById("photoPage");

  ui.addCircularScrollBar(categoryPage);
  ui.addCircularScrollBar(photoPage);
	tizen.preference.setValue("fromOptionsPage", false);

  var chooseCategory = document.getElementById("chooseCategory");
  chooseCategory.innerHTML = TRANSLATIONS["chooseCategory"];
  

  //swipeEvent(imageDiv, onSwipe); 

};