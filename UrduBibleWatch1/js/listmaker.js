

var listmaker = (function(){
	
	this.createAlphabet = function (array, callback){
		var listObj = array.sort();
		var result = [];
		var duplicates = [];
		
		for (var x=0; x<listObj.length; x++){
			var letter = listObj[x].substring(0,1).toUpperCase();
			if (duplicates.indexOf(letter)==-1){
				var label = letter;
				var id = letter;
				var jsonObj = {"label": label, "id": id};
				result.push(jsonObj);
				duplicates.push(id);
			}
		}
		callback(result);
	};
	
	this.createButtonList = function(array, callback){
		 var mainDiv = document.createElement("DIV");
		 for (var x=0; x<array.length; x++){

			     var jsonObj = array[x];
				 var label = jsonObj["label"];
				 var id = jsonObj["id"];
				 var buttonEl = document.createElement("DIV");
				 buttonEl.className = "setting-item";
				 buttonEl.id = id;
				 buttonEl.innerHTML = label;
	
				 mainDiv.appendChild(buttonEl);
			 

		 }
         mainDiv.lastElementChild.style.marginBottom = "50%";
		 callback(mainDiv);
	};
	this.createDeleteButtonList = function(array, callback){
		 var mainDiv = document.createElement("DIV");
		 for (var x=0; x<array.length; x++){

			     var jsonObj = array[x];
				 var label = jsonObj["label"];
				 var id = jsonObj["id"];
				 var buttonEl = document.createElement("DIV");
				 buttonEl.className = "delete-download-bible-list-item";
				 buttonEl.id = "deleteThis-"+id;
				 var delButtonIcon = document.createElement("DIV");
				 var delButtonText = document.createElement("DIV");
				 delButtonText.innerHTML =  label;
				 delButtonText.style.display = "inline";
				 delButtonText.float = "left";
				 delButtonIcon.style.display = "inline";
				 delButtonIcon.className = "trashDownloadedBibleButton";
				 delButtonIcon.id = id;
				 buttonEl.appendChild(delButtonText);
				 buttonEl.appendChild(delButtonIcon);
				 mainDiv.appendChild(buttonEl);	

		 }
        mainDiv.lastElementChild.style.marginBottom = "50%";
		callback(mainDiv);
	};
	this.addListenersToItemList = function(element, callback){
         var buttonsList = element.children;
         var openItem = function(event){
			 var id = event.target.id;
			 callback(id);
         };
		 for (var x=0; x<buttonsList.length; x++){
                var button = buttonsList[x];
                button.addEventListener("click", openItem);	
		 }
	};	
	this.removeListenersToItemList = function(element, callback){
        var buttonsList = element.children;
        var openItem = function(event){
			 var id = event.target.id;
			 callback(id);
        };
		 for (var x=0; x<buttonsList.length; x++){
               var button = buttonsList[x];
               button.removeEventListener("click", openItem);	
		 }
	};	

	this.sortListArray = function(arr, compareBy, callback){
		  var compareObjects = function(object1, object2, key) {
			  const obj1 = object1[key].toUpperCase();
			  const obj2 = object2[key].toUpperCase();

			  if (obj1 < obj2) {
			    return -1;
			  }
			  if (obj1 > obj2) {
			    return 1;
			  }
			  return 0;
			};
			

			 arr.sort(function (title1, title2)  {
				  return compareObjects(title1, title2, compareBy);
				});
			 callback(arr);
	};
	return this;
}());