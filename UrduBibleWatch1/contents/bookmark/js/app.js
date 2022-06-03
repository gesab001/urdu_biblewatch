var pageID = "BookmarkPage";

	
	window.onload = function() {
	    
		var bookmarkList = null;
		
		var scrollerBookmarkContentPage = document.getElementById("BookmarkContentPage");   
		if(scrollerBookmarkContentPage) {
			scrollerBookmarkContentPage.setAttribute("tizen-circular-scrollbar", "");
		}
		
		bookmarklist_listeners = [];
		bookmarklistEdit_listeners = [];

		function bookmarkListItem_eventHandler(){
			console.log("book mark selected: " + this.id);

			var reference = bookmarkList[this.id]["reference"];
			selectedBook = reference[0];
			selectedChapter = reference[1];
			selectedVerse = reference[2];
			console.log("reference bookmark: " + reference);
		    var browseSettings = {"book": selectedBook, "chapter": selectedChapter, "verse": selectedVerse}; 
		    tizen.preference.setValue("browseSettingsBrowsePage", JSON.stringify(browseSettings));
			window.location.href = "../browse/index.html";
		}

		function deleteBookmarkListItem_eventHandler(){
			console.log("bookmarkListEditItem_eventHandler: " + this.id);
			 var key = this.id;
			 bookmarkList = JSON.parse(tizen.preference.getValue("bookmarkList"));
			 delete bookmarkList[key];
			 tizen.preference.setValue("bookmarkList", JSON.stringify(bookmarkList));

				 updateBookmarkPage();
				 

				 
			 
		}
		function updateBookmarkPage(){
			console.log("update bookmark page");
			 
			 var bookmarkListDiv = document.getElementById("BookmarkList");
			 var bookmarkListDivEdit = document.getElementById("BookmarkListEdit");

			 bookmarkList = JSON.parse(tizen.preference.getValue("bookmarkList"));
			 var bookmarkListKeys = Object.keys(bookmarkList);
			 bookmarkListDiv.innerHTML = "";
			 bookmarkListDivEdit.innerHTML = "";

			 if (bookmarklist_listeners.length>0){
				 for (var x=0; x<bookmarklist_listeners.length; x++){
					 
					 var input = bookmarklist_listeners[x];
					 input.removeEventListener("click", bookmarkListItem_eventHandler);		
				 }
				 bookmarklist_listeners = [];
				 console.log("list of bookmarklist_listeners: "+ bookmarklist_listeners.length);
				 
			 }
			 if (bookmarklistEdit_listeners.length>0){
				 for (var x=0; x<bookmarklistEdit_listeners.length; x++){
					 
					 var input = bookmarklistEdit_listeners[x];
					 input.removeEventListener("click", deleteBookmarkListItem_eventHandler);		
				 }
				 bookmarklistEdit_listeners = [];
				 console.log("list of bookmarklist_listeners: "+ bookmarklistEdit_listeners.length);
				 
			 }
		     console.log("bookmarkListKeys: " + bookmarkListKeys.length);

				   	  for (var x=0; x<bookmarkListKeys.length; x++){
				
						  var id = bookmarkListKeys[x];
						  var title = bookmarkList[id]["title"] ;  
						  var newEl = document.createElement("DIV");
						  newEl.className = "bookmark-list-item";
						  var inputEl = document.createElement("INPUT");
						  inputEl.type = "radio";
						  inputEl.id =  id;
						  inputEl.name = "bookmark_item";
						  inputEl.value = id;
						  var labelEl = document.createElement("LABEL");
						  labelEl.htmlFor = id;
						  labelEl.innerHTML = title.toUpperCase();
						  newEl.appendChild(inputEl);
						  newEl.appendChild(labelEl);
						  bookmarkListDiv.appendChild(newEl);					  
					  	  
				  }	
				  //List of editable bookmarks
				  for (var x=0; x<bookmarkListKeys.length; x++){
				
					  	  var id = bookmarkListKeys[x];
						  var title = bookmarkList[id]["title"] ;  
						  var newDelEl = document.createElement("DIV");
						  newDelEl.className = "delete-bookmark-list-item";
						  var delButtonText = document.createElement("DIV");
						  var delButtonIcon = document.createElement("DIV");
						  delButtonText.style.display = "inline";
						  delButtonText.float = "left";
						  delButtonIcon.style.display = "inline";
						  delButtonText.innerHTML =  title.toUpperCase();
						  delButtonIcon.id = id.replace(" ", "_");
						  delButtonIcon.className = "trashDownloadedBibleButton";
						  delButtonIcon.addEventListener("click", deleteBookmarkListItem_eventHandler);
						  bookmarklistEdit_listeners.push(delButtonIcon);
						  newDelEl.appendChild(delButtonText);
						  newDelEl.appendChild(delButtonIcon);
						  bookmarkListDivEdit.appendChild(newDelEl);						  
				  	  
				  }	
					 var bookmarklistItems = document.querySelectorAll(".bookmark-list-item");
					 for (var x=0; x<bookmarklistItems.length; x++){
							var el = bookmarklistItems[x];
							var input = el.querySelector("input");
							input.addEventListener("click", bookmarkListItem_eventHandler);		
							bookmarklist_listeners.push(input);		
					 }
					 var totalBookmarks = bookmarklistItems.length;
					 if (totalBookmarks===0){
							document.getElementById("nobookmarks").style.display = "block";
							 document.getElementById("editBookmark").style.display = "none";

					 }else{
						 var lastElement = bookmarklistItems[totalBookmarks-1];
						 lastElement.style.marginBottom = "50%";	
				         document.getElementById("nobookmarks").style.display = "none";
						 document.getElementById("editBookmark").style.display = "block";

					 }
		    	 

		}
		
		document.getElementById("editBookmark").addEventListener("click", function(){
			var bookMarkList = document.getElementById("BookmarkList");
			var bookMarkListEdit = document.getElementById("BookmarkListEdit");
			if (bookMarkList.style.display==="block"){
				bookMarkList.style.display = "none";
				bookMarkListEdit.style.display = "block";
			}else{
				bookMarkList.style.display = "block";
				bookMarkListEdit.style.display = "none";		
			}
		});

		
		function listener_BookmarkPage(){
			console.log("bookmark page");
			document.getElementById("nobookmarks").style.display = "none";
			document.getElementById("BookmarkList").style.display = "block";
			document.getElementById("BookmarkListEdit").style.display = "none";
			document.getElementById("editBookmark").style.display = "none";
		    if(tizen.preference.exists("bookmarkList")){
		    	bookmarkList = JSON.parse(tizen.preference.getValue("bookmarkList"));
		    	if (Object.keys(bookmarkList).length>0){
		        	updateBookmarkPage();	    	
		        	document.getElementById("editBookmark").style.display = "block";
		        	document.getElementById("nobookmarks").style.display = "none";

		    		
		    	}else{
		        	document.getElementById("nobookmarks").style.display = "block";
		        	document.getElementById("editBookmark").style.display = "none";
		    		
		    	}
		    	
		    }else{
		    	document.getElementById("nobookmarks").style.display = "block";
		    	document.getElementById("editBookmark").style.display = "none";

		    }

		}
		

		listener_BookmarkPage();
		var nobookmarksDiv = document.getElementById("nobookmarks");
		var htmltext = LANG_JSON_DATA["TRANSLATIONS"]["BOOKMARKS_PAGE"]["nobookmarks"] + " " +  
		               '<a href="../browse/index.html" class="linkToBrowseFromBookmarkPage linkStyle">' + " " + 
		               LANG_JSON_DATA["TRANSLATIONS"]["BOOKMARKS_PAGE"]["nobookmarkslink"] + " " +  '</a>' + " " + 
		               LANG_JSON_DATA["TRANSLATIONS"]["BOOKMARKS_PAGE"]["nobookmarksend"];
		nobookmarksDiv.innerHTML = htmltext;
		console.log(nobookmarksDiv.innerHTML);
		document.getElementById("bookmarks_page_title").innerHTML = LANG_JSON_DATA["TRANSLATIONS"]["BOOKMARKS_PAGE"]["bookmarks"];
		tizen.preference.setValue("fromOptionsPage", true);

	};

	window.onunload = function() {
		tizen.preference.setValue("fromOptionsPage", true);

	}