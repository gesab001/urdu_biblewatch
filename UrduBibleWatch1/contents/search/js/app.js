var book, chapter, verse, pages, screenSections,
    isFullScreen = false,
    pageID = "SearchPage",
    settingsData,
    switchVersionButton,
    bibleVersionList = [],
    upperCaseBibleVersionList,
    bookData = {"kjv": null},
    TRANSLATIONS = LANG_JSON_DATA["TRANSLATIONS"]["SEARCH_PAGE"];

window.onload = function() {
    var historyPages = [0];
    var currentPageIndex = 0;
    settingsData = {
        "bibleversion": "kjv",
        "background": "black"
    };
    pages = document.querySelectorAll(".page");
    screenSections = document.querySelectorAll(".section");
    var selectedBibleToDownload;

    var references = null;
    var currentID;
    var timerShowDate = null;
    var bibles = null;
    var bibleToSearch = null;
    var bibleBookTitlesInDifferentLanguages = null;

    var searchResultsDisplayButton = document.getElementById("searchResultsDisplayButton");
    var searchResultsDisplay = document.getElementById("searchResultsDisplay");
    var slideShowDurationType = "everytouch";
    var sections = document.querySelectorAll(".browseContent");
    var bookmarkList = null,
        localeLanguage,
        fontSize,
        versesPerDay,
        planVerseCount = 0,
        page_ChangeVerseSetting = document.getElementById("page_ChangeVerseSetting"),
        virtualrootDownload = "wgt-private",
        bibleDownloadfolder = "zipbibles";

    var keywordToView;
    var foundVerses = [];
    var foundVerseIndex = 0;
    var searchInputText = document.querySelector(".searchInputText");
    var prevSlideShowSearchVerse = document.getElementById("prevSlideShowSearchVerse");
    var nextSlideShowSearchVerse = document.getElementById("nextSlideShowSearchVerse");

    //PAST SEARCH RESULTS ADD API
    var currentVersionToSearch = null;
    var searchSection = document.getElementById("searchSection");
    var searchHistorySection = document.getElementById("searchHistorySection");
    var SearchHistoryList = document.getElementById("SearchHistoryList");
    var elementList;
    var slideShowTitle = document.getElementById("slideShowTitle");  
    var searchButton = document.querySelector(".searchButton");
    var historyButton = document.querySelector(".historyButton"); 
    var editButtonSearch = document.getElementById("editButtonSearch");
    
    function refreshSlideShowAfterVersionChange() {
        console.log("searchResultsDisplay button");
        var reference = foundVerses[foundVerseIndex]; //{"book": bookname, "chapter": c, "verse": v,  "totalVerses": Object.keys(verses).length};
        var book = reference[0];
        var chapter = reference[1];
        var verse = reference[2];
        //document.getElementById("versePlanContainer").innerHTML = planVerseCount + " of " + versesPerDay + "<br>" + book + " " + chapter + ":" + verse;
        var version = settingsData["bibleversion"];
        var title = searchInputText.value.toUpperCase() + "<br>" + (foundVerseIndex + 1) + " of " + foundVerses.length;
        document.getElementById("slideShowTitle").innerHTML = title;
        //document.getElementById("switchVersionSlideshowButton").innerHTML = version.toUpperCase();
        getBibleVerse(version, book, chapter, verse, "bibleverse");

    }
    var updateProgressBarSlideShow = function() {
        var totalSearchVerses = foundVerses.length -1;
        var percent = (foundVerseIndex / totalSearchVerses) * 100;
        console.log("percent reading plan : " + percent);
        setProgress(percent, "progressSlideshow");
    };

    function getBibleVerse(version, book_param, chapter_param, verse_param, elementID) {
        book = book_param;
        chapter = chapter_param;
        verse = verse_param
            //console.log("getBibleVerse");
            //var version = "kjv";
        var filename = book.replace(/\s/g, "_") + ".json";
        console.log(version + '/' + filename);
        //var chapter = "1";
        //var verse = "1";

        var updateDisplay = function() {
            var wordOfGod = bookData[version][book]["book"][chapter]["chapter"][verse]["verse"];
            if (wordOfGod == "") {
			   wordOfGod = LANG_JSON_DATA["TRANSLATIONS"]["COMMON"]["verseNotExist"];

            }
            console.log("wordOfGod: " + wordOfGod);
            console.log("not exist: " + "verse doesn't exist in this bible version");
            if (wordOfGod === "verse doesn't exist in this bible version") {
 			   wordOfGod = LANG_JSON_DATA["TRANSLATIONS"]["COMMON"]["verseNotExist"];
            }	
            var reference = book + " " + chapter + ":" + verse;

            if (book==="Song of Songs"){
            	reference = "Song of Solomon" + " " + chapter + ":" + verse;
	            }
            if(LANG_JSON_DATA["VERSIONLANGUAGE"][settingsData["bibleversion"]]!=="english"){
            	var languageCode = LANG_JSON_DATA["VERSIONLANGUAGE"][settingsData["bibleversion"]];

            	var bookKey = book.replace(/ /g, "-");
	            if (book==="Song of Songs"){
	               bookKey = "Song-of-Solomon";	
	            }
	            var bookLocale;
	            console.log("languageCode: " + languageCode);
	            console.log("bookKey: " + bookKey);
	            console.log("bibleBookTitlesInDifferentLanguages: " + bibleBookTitlesInDifferentLanguages);

	            try{
	            	bookLocale = bibleBookTitlesInDifferentLanguages[bookKey][languageCode];
	                reference = bookLocale + " " + chapter + ":" + verse;

	            }catch(e){
	            	console.log(e);
	            }

                  	
            }


            document.getElementById(elementID).innerHTML = "<span style='color: yellow;'>" + reference + "</span><br>" + wordOfGod;
            document.getElementById(elementID+"2").innerHTML = "<span style='color: yellow;'>" + reference + "</span><br>" + wordOfGod;


            document.getElementById(elementID).style.fontSize = fontSize + "px";
            document.getElementById(elementID+"2").style.fontSize = fontSize + "px";
            tts.play(wordOfGod);
            
            console.log("fontSize of " + elementID + ": " + document.getElementById(elementID).style.fontSize);

        };
        var getBook = function() {
            // console.log("get book: " + version);
            var readAsJson = function(str) {
                //	console.log("success reading " + filename);
            	try{
                    bookData[version] = {};
                    bookData[version] = {
                        book: ""
                    };           		
            	}catch(e){
            		console.log(e.message);
            	}

                bookData[version][book] = JSON.parse(str);
                updateDisplay();

            }
            var readAsJson = function(str) {
                //	console.log("success reading " + filename);
            	if(str==="error"){
             	   if (book === "Song of Solomon") {
                       console.log("book is Song of Solomon, change to Song of Songs");
                       var bookchange = "Song of Songs";
                       var FILE_URL = "../../zipbibles/"+version + "/" + filename.split(".")[0]+".js" ;
                       filesystem.loadJS(FILE_URL, "bookData", false, readAsJson);
                     
                   }           		
            	}else{
            		var bookData2 = {};
                    var version = settingsData["bibleversion"];

                   	try{
                   		
                		console.log("version: "+version);
                		console.log("book: "+book);

                        bookData2[version] = {};
                        bookData2[version] = {book: ""};           		
                	}catch(e){
                		console.log(e.message);
                	}


                    bookData2[version][book] = bookData;
                    bookData = null;
                    bookData = bookData2;
                    updateDisplay();

            	}



            }
            bookData = null;
            var FILE_URL = "../../zipbibles/"+version + "/" + filename.split(".")[0]+".js" ;
            filesystem.loadJS(FILE_URL, "bookData", false, readAsJson);
            
            var getJsonData = function() {
                var onSuccess = function(dir) {
                    //	  console.log("on sucess: " );
                    var file_obj = dir.resolve(filename);
                    file_obj.readAsText(readAsJson, null, 'UTF-8');
                }

                var onError = function(e) {
                    console.log(e);
                }
                try {
                    var path = "wgt-private/" + version;
                    //tizen.filesystem.resolve("wgt-private/" + version, onSuccess, onError, "r");

                } catch (e) {
                    console.log(e);
                }

            };
            var extractSuccessCallback = function() {
                console.log('File extracted');
                getJsonData();
            }

            var extractErrorCallback = function(error) {
                //  console.log('extract error: ' + error.message);
                getJsonData();
            };

            var getEntrySuccess = function(entry) {
                //	console.log(entry);
                entry.extract('wgt-private', extractSuccessCallback, extractErrorCallback);
            }

            var getEntryError = function(error) {
                console.log(error);
                if (book === "Song of Solomon") {
                    console.log("book is Song of Solomon, change to Song of Songs");
                    var bookchange = "Song of Songs";
                    getBibleVerse(version, bookchange, chapter, verse, elementID);
                }

            }
            var openZipFileSuccess = function(archive) {
                //	console.log(archive);
                //  console.log('ArchiveFile mode: ' + archive.mode);
                myArchive = archive;
                //myArchive.getEntries(listSuccess);


                archive.getEntryByName(version + '/' + filename, getEntrySuccess, getEntryError);

            };

            var openZipFileError = function(error) {
                console.log("error: " + error);
            }
            if (version == "kjv") {
                var zipFilePath = "wgt-package/kjv.zip";
                //tizen.archive.open(zipFilePath, 'r', openZipFileSuccess, openZipFileError);

            } else {
                var zipFilePath = virtualrootDownload + "/" + bibleDownloadfolder + "/" + version + ".zip";
                //tizen.archive.open(zipFilePath, 'r', openZipFileSuccess, openZipFileError);

            }

        };


        var bibleVerseLoader = function() {

            try {
                //   console.log(bookData[version][book]["book"][chapter]["chapter"][verse]["verse"]);
                updateDisplay();

            } catch (e) {
                //  console.log(e.message);
                getBook();
            }
        };
        var loadBibleBooksInDifferentLanguages = function() {
            var path = "wgt-package";
            var filename = "booksOfTheBibleInDifferentLanguages.json";

            var readAsJson = function() {

    			bibleBookTitlesInDifferentLanguages = booksOfTheBibleInDifferentLanguagesJS;
    			booksOfTheBibleInDifferentLanguagesJS = null;
                bibleVerseLoader();


            }
            //filesystem.getJsonData(path, filename, readAsJson);
            localization.loadBibleBooksInDifferentLanguages(readAsJson);


        };
        var onLocaleSuccessCallback = function(locale) {
            ////console.log('The locale language is ' + JSON.stringify(locale.language));
            localeLanguage = locale.language;
            console.log("localeLanguage: " + localeLanguage);
            if (bibleBookTitlesInDifferentLanguages == null) {
            	var callbackloadBibleBooksInDifferentLanguages = function(){
            		bibleBookTitlesInDifferentLanguages = booksOfTheBibleInDifferentLanguagesJS;
                    bibleVerseLoader();

            	}
                localization.loadBibleBooksInDifferentLanguages(callbackloadBibleBooksInDifferentLanguages);

            } else {
                bibleVerseLoader();

            }

        };


        var getLocalLanguageSetting = function() {
            tizen.systeminfo.getPropertyValue('LOCALE', onLocaleSuccessCallback);
            //tizen.systeminfo.getPropertyValueArray("LOCALE", successArrayCB);
        };

        getLocalLanguageSetting();


    }


    function updateSlideShowPage() {
        pageID = "page_SlideshowPage";

        var reference = foundVerses[foundVerseIndex]; //{"book": bookname, "chapter": c, "verse": v,  "totalVerses": Object.keys(verses).length};
        var book_param = reference[0];
        var chapter_param = reference[1];
        var verse_param = reference[2];
        //document.getElementById("versePlanContainer").innerHTML = planVerseCount + " of " + versesPerDay + "<br>" + book + " " + chapter + ":" + verse;
        var version = settingsData["bibleversion"];

        var title = searchInputText.value;
        slideShowTitle.innerHTML = title.toUpperCase() + "<br>" + (foundVerseIndex + 1) + LANG_JSON_DATA["TRANSLATIONS"]["COMMON"]["of"] + foundVerses.length;;
        //document.getElementById("switchVersionSlideshowButton").innerHTML = version.toUpperCase();
        getBibleVerse(version, book_param, chapter_param, verse_param, "bibleverse");
        updateSearchHistory(title.toLowerCase(), foundVerseIndex); 
        

        if (slideShowDurationType != "everyminute") {
            updateProgressBarSlideShow();
        }
    }




    searchResultsDisplayButton.addEventListener("click", function() {
        console.log("searchResultsDisplay button");

        //showPage(10);
        foundVerseIndex = 0;
        ui.hideSections(pages);
        ui.showSection(pages, 1);
        setActivePage("popup");
        saveSearchHistory(searchInputText.value.toLowerCase(), 0);
        updateSlideShowPage();

    });
    prevSlideShowSearchVerse.addEventListener("click", function() {
        console.log("prevSlideShowSearchVerse button");
        var title = searchInputText.value;
        var oldId = title +"_"+foundVerseIndex;
        console.log("oldId: " + oldId);

        var searchHistoryItemDiv = document.getElementById(oldId);

        if (foundVerseIndex > 0) {
            foundVerseIndex -= 1;
            var newId = title +"_"+foundVerseIndex;
            console.log("newId: " + newId);
            if(searchHistoryItemDiv!=null){
                searchHistoryItemDiv.id = newId;

            }
            updateSlideShowPage();

        }

    });


    nextSlideShowSearchVerse.addEventListener("click", function() {
        console.log("nextSlideShowSearchVerse button");
        var title = searchInputText.value;
        var oldId = title +"_"+foundVerseIndex;
        console.log("oldId: " + oldId);

        var searchHistoryItemDiv = document.getElementById(oldId);
        console.log("searchHistoryItemDiv: " + searchHistoryItemDiv);
        if (foundVerseIndex < foundVerses.length - 1) {
            foundVerseIndex += 1;
            var newId = title +"_"+foundVerseIndex;
            console.log("newId: " + newId);
            if(searchHistoryItemDiv!=null){
                searchHistoryItemDiv.id = newId;

            }
            updateSlideShowPage();
        }

    });

    function getCurrentSearchedVerse() {
        var reference = foundVerses[foundVerseIndex]; //{"book": bookname, "chapter": c, "verse": v,  "totalVerses": Object.keys(verses).length};

        return reference;
    }

    function inputTextFocus(e) {
        foundVerses = [];
    	document.querySelector(".searchresultsshow").innerHTML = TRANSLATIONS["search"]+ ": " + settingsData["bibleversion"].toUpperCase();

        searchResultsDisplayButton.style.display = "none";
        goButtonSearch.style.display = "block";
        searchInputText.value = "";


    }
    searchInputText.addEventListener('focus', inputTextFocus, true);
    var searchResults = document.querySelector(".searchresultsshow");

    function displayResults() {
    	foundVerses = [];
        console.log("display results");
        searchResults.innerHTML = "";
        console.log("input text value: " + searchInputText.value);
        //searchInputText.value = "البدء";
        keyword = searchInputText.value;
        
        console.log("keyword =" + keyword);
        var resultsCount = 0,
            totalBooksSearched = 0,
            filename;



        var findWord = function(bookname, chapters) {
            for (c in chapters) {
                var verses = chapters[c]["chapter"];
                for (v in verses) {
                    var string = verses[v]["verse"].trim();

                    if (string.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
                        //console.log("word: " + string);  
                        resultsCount += 1;

                        var jsonObj = [bookname, c, v];
                        //console.log("jsonObj: " + JSON.stringify(jsonObj));
                        foundVerses.push(jsonObj);
                        //searchResults.innerHTML = "Found " + resultsCount + " verses";

                    }

                }

            }
            //console.log("results count: " + resultsCount);
        }
        searchResults.innerHTML = "Searching...";

        for (x in bibleToSearch) {
            var bookname = bibleToSearch[x]["book_name"];
            totalBooksSearched += 1;

            //progressBar_percent = (totalBooksSearched / 66) * 100; 
            //console.log("progressBar percent " + progressBar_percent );
            //progressBarWidget.value(progressBar_percent);

            var chapters = bibleToSearch[x]["book"];
            findWord(bookname, chapters);
        }

        var version = settingsData["bibleversion"].toUpperCase();
        searchResults.innerHTML = TRANSLATIONS["found"].replace("[VALUE]", resultsCount).replace("[VERSION]", version);//"Found " + resultsCount + " verses <br> in the " + version + " bible";
        console.log("Found " + resultsCount + " verses");
        if (resultsCount > 0) {
        	searchResultsDisplayButton.style.display = "block";
            goButtonSearch.style.display = "none";
            
        }else{
        	 goButtonSearch.style.display = "block";
        }

    }

    function loadBibleData() {
    	var biblejsfiles = ['Genesis.js', 'Exodus.js', 'Leviticus.js', 'Numbers.js', 'Deuteronomy.js', 'Joshua.js', 'Judges.js', 'Ruth.js', '1_Samuel.js', '2_Samuel.js', '1_Kings.js', '2_Kings.js', '1_Chronicles.js', '2_Chronicles.js', 'Ezra.js', 'Nehemiah.js', 'Esther.js', 'Job.js', 'Psalms.js', 'Proverbs.js', 'Ecclesiastes.js', 'Song_of_Songs.js', 'Isaiah.js', 'Jeremiah.js', 'Lamentations.js', 'Ezekiel.js', 'Daniel.js', 'Hosea.js', 'Joel.js', 'Amos.js', 'Obadiah.js', 'Jonah.js', 'Micah.js', 'Nahum.js', 'Habakkuk.js', 'Zephaniah.js', 'Haggai.js', 'Zechariah.js', 'Malachi.js', 'Matthew.js', 'Mark.js', 'Luke.js', 'John.js', 'Acts.js', 'Romans.js', '1_Corinthians.js', '2_Corinthians.js', 'Galatians.js', 'Ephesians.js', 'Philippians.js', 'Colossians.js', '1_Thessalonians.js', '2_Thessalonians.js', '1_Timothy.js', '2_Timothy.js', 'Titus.js', 'Philemon.js', 'Hebrews.js', 'James.js', '1_Peter.js', '2_Peter.js', '1_John.js', '2_John.js', '3_John.js', 'Jude.js', 'Revelation.js'];
        var readAsJson = function(str) {
            console.log("readAsJson");

            bibleToSearch = JSON.parse(str)["version"];
            displayResults();
        };
        bibleToSearch = {};
    	var addBook = function(bookNumber){
    		console.log("bookNumber: " + bookNumber);
    		bibleToSearch[bookNumber.toString()] = bookData;
            console.log("bibletosearch: " + Object.keys(bibleToSearch));
    		if(Object.keys(bibleToSearch).length===66){
    	        bookData = {"kjv": null};
    	        displayResults();
    		}
    	};
        for (var x=0; x<biblejsfiles.length; x++){
        	bookData = null;
        	var bookNumber = x+1;
        	var FILE_URL = "../../zipbibles/"+currentVersionToSearch+"/"+biblejsfiles[x];
            console.log("bookNumber: " + bookNumber);

        	filesystem.loadJS(FILE_URL, bookNumber, false, addBook);

        }

 
    }

    function goButtonSearchHandler() {
        foundVerses = [];
        if (searchInputText.value.length > 0) {
            if (currentVersionToSearch != settingsData["bibleversion"]) {
                console.log("its a different version, load a new version for searching");
                currentVersionToSearch = settingsData["bibleversion"];
                searchResults.innerHTML = TRANSLATIONS["loadingData"];
                loadBibleData();
            } else {
                if (bibleToSearch == null) {
                    searchResults.innerHTML = TRANSLATIONS["loadingData"];
                    loadBibleData();
                } else {
                    displayResults();
                }
            }

        }
    }


    document.querySelector("#goButtonSearch").addEventListener("click", goButtonSearchHandler);

    function changeAllNextVerses() {
        document.getElementById("nextSlideShowSearchVerse").click();
    }

    function changeAllPrevVerses() {
        document.getElementById("prevSlideShowSearchVerse").click();
    }

    function rotaryHandler(e) {
        if (e.detail.direction === 'CW') {

            changeAllNextVerses();
        } else if (e.detail.direction === 'CCW') {

            changeAllPrevVerses();
        }
    }

    document.addEventListener('rotarydetent', rotaryHandler, false);

    function changeFontSize() {
        console.log("change font size");
        settingsData = JSON.parse(tizen.preference.getValue("settingsData"));
        settingsData["fontSize"] = settingsData["fontSize"] + 2;
        if (settingsData["fontSize"] > 40) {
            settingsData["fontSize"] = 14;
        }
        ui.setFontSize("bibleverse", settingsData["fontSize"]);
        ui.setFontSize("bibleverse2", settingsData["fontSize"]);

        settingsData_CRUD.update(settingsData);
    }

    document.querySelector(".fontResizeButton").addEventListener("click", changeFontSize);


    addPopup(pages);

    function setFullScreen() {
        console.log("setFullScreen");
        ui.hideSections(screenSections);
        ui.showSection(screenSections, 1);
        setActivePage("popup");
        isFullScreen = true;
        settingsData["fullScreen"] = isFullScreen;
    }

    document.querySelector(".maximizeButton").addEventListener("click", setFullScreen);

    
    function saveSearchResults(){
    	
         console.log("saveSearchResults");
         if(foundVerses.length>0){
             var searchPreferences = {
            		 "bibleVersionToSearch": currentVersionToSearch, 
            		 "title": searchInputText.value,
                     "foundVerses": foundVerses,
                     "foundVerseIndex": foundVerseIndex
                 };
             settingsData_CRUD.saveToPreferences("searchPreferences", searchPreferences);   	
       	 
         }
    }
    function openClock() {
        settingsData["fullScreen"] = true;
        console.log("fullScreen: " + settingsData["fullScreen"]);
        console.log("window.location.href: " + window.location.href);
        tizen.preference.setValue("goBackToThisFromClock", window.location.href);
        tizen.preference.setValue("changingVersion", false);
        settingsData_CRUD.update(settingsData);
        saveSearchResults();
        //document.getElementById("clockLink").click();
        window.location.href = "../clock/index.html";

    }
    document.querySelector(".clockIcon").addEventListener("click", openClock);

    function setSettingsData(jsonObj) {
        settingsData = jsonObj;
    	document.querySelector(".searchresultsshow").innerHTML = TRANSLATIONS["search"]+": "+ settingsData["bibleversion"].toUpperCase();

        bible.setVersionButtonText();
        if (settingsData["fullScreen"]) {
            var searchPreferences = JSON.parse(tizen.preference.getValue("searchPreferences"));
            searchInputText.value = searchPreferences["title"];

            foundVerses = searchPreferences["foundVerses"];
            foundVerseIndex = searchPreferences["foundVerseIndex"];
            updateSlideShowPage();
            ui.hideSections(pages);
            ui.showSection(pages, 1);
            setFullScreen();


        }
        if(tizen.preference.exists("changingVersion")){
        	var isChangingVersion = tizen.preference.getValue("changingVersion");
        	if (isChangingVersion){
        		console.log("tizen.preference.getValue('changingVersion'): " + isChangingVersion);
        		if (tizen.preference.exists("searchPreferences")){
                    var searchPreferences = JSON.parse(tizen.preference.getValue("searchPreferences"));
                    searchInputText.value = searchPreferences["title"];
                    foundVerses = searchPreferences["foundVerses"];
                    foundVerseIndex = searchPreferences["foundVerseIndex"];
                    updateSlideShowPage();
                    ui.hideSections(pages);
                    ui.showSection(pages, 1);   
                    setActivePage("popup");      			
        		}


        	}
        	document.querySelector(".searchresultsshow").innerHTML = TRANSLATIONS["search"]+": "+ settingsData["bibleversion"].toUpperCase();
        	tizen.preference.setValue("changingVersion", false);
        	isChangingVersion = false;
        
 	
        }
        if(tizen.preference.exists("changingSearchVersion")){
        	var changingSearchVersion = tizen.preference.getValue("changingSearchVersion");
        	if (changingSearchVersion){
                ui.hideSections(pages);
                ui.showSection(pages, 0);   
                setActivePage("SearchPage");  


        	}
        	document.querySelector(".searchresultsshow").innerHTML = TRANSLATIONS["search"]+": "+ settingsData["bibleversion"].toUpperCase();
        	tizen.preference.setValue("changingSearchVersion", false);
        	changingSearchVersion = false;
        
 	
        }
        
        if(tizen.preference.exists("fromBrowsePage")){
        	var fromBrowsePage = tizen.preference.getValue("fromBrowsePage");
        	if (fromBrowsePage){
        		console.log("tizen.preference.getValue('fromBrowsePage'): " + fromBrowsePage);
                var searchPreferences = JSON.parse(tizen.preference.getValue("searchPreferences"));
                searchInputText.value = searchPreferences["title"];

                foundVerses = searchPreferences["foundVerses"];
                foundVerseIndex = searchPreferences["foundVerseIndex"];
                updateSlideShowPage();
                ui.hideSections(pages);
                ui.showSection(pages, 1);   
                setActivePage("popup");

        	}
        	tizen.preference.setValue("fromBrowsePage", false);
        	fromBrowsePage = false;
        
 	
        }
        ui.setFontSize("bibleverse", settingsData["fontSize"]);
        ui.setFontSize("bibleverse2", settingsData["fontSize"]);
    }
    

    function goToSwitchVersion(){
        if (document.getElementById("minScreen").style.display === "block") {
            settingsData["fullScreen"] = false;
        }else{
            settingsData["fullScreen"] = true;

        }
        console.log("fullScreen: " + settingsData["fullScreen"]);
        console.log("window.location.href: " + window.location.href);
        tizen.preference.setValue("goBackToThisFromSwitchVersion", window.location.href);
        tizen.preference.setValue("changingVersion", true);
        settingsData_CRUD.update(settingsData);
        saveSearchResults();   
    	bible.switchVersionHandler();
    }
    function changeVersionToSearch(){
        if (document.getElementById("minScreen").style.display === "block") {
            settingsData["fullScreen"] = false;
        }else{
            settingsData["fullScreen"] = true;

        }
        console.log("fullScreen: " + settingsData["fullScreen"]);
        console.log("window.location.href: " + window.location.href);
        tizen.preference.setValue("goBackToThisFromSwitchVersion", window.location.href);
        tizen.preference.setValue("changingSearchVersion", true);
        settingsData_CRUD.update(settingsData);
        //saveSearchResults();   
    	bible.switchVersionHandler();    	
    }

    function bibleChangeVersionShortcut(){
    	if (bibleVersionList.length>1){
    		 bible.changeBibleVersion();
    		 var version = settingsData["bibleversion"];
    		 bookData = {version: {}};
    		 bible.setVersionButtonText();
    		 updateSlideShowPage();

    		
    	}else{
   		 updateSlideShowPage();

    	}
    }
    function goToBrowsePage() {
        var browseSettings = {};
        browseSettings["book"] = book;
        browseSettings["chapter"] = chapter;
        browseSettings["verse"] = verse;
        settingsData_CRUD.saveToPreferences("browseSettingsBrowsePage", browseSettings);
        saveSearchResults();   
        tizen.preference.setValue("fromBrowsePage", true);
    	tizen.preference.setValue("fromOptionsPage", false);

        tizen.preference.setValue("backToSearchPage", true);

        window.location.href = "../browse/index.html";
    }
    document.querySelector(".goToBrowseButton").addEventListener("click", goToBrowsePage);
    switchVersionButton = document.querySelector(".switchVersionButton");
    switchVersionButton.addEventListener("click", goToSwitchVersion);
    
    
    document.querySelector(".addToFavoritesButton").addEventListener("click", bible.addVerseToFavorites);

    settingsData_CRUD.get(setSettingsData);
    ui.initBackgound();
    bible.getListOfBibleVersions();
    
    var normalScreenVerseText = document.querySelector(".normalScreenVerseText");
    var fullScreenVerseText = document.querySelector(".fullScreenVerseText");

    normalScreenVerseText.addEventListener("click", bibleChangeVersionShortcut );    
    fullScreenVerseText.addEventListener("click", bibleChangeVersionShortcut);

    function callbackSwipeEvent(direction){
    	if (direction==="left"){
    		nextSlideShowSearchVerse.click();
    	}else{
    		prevSlideShowSearchVerse.click();
    	}
    }
    
    function onSwipeLeft(){
    	console.log("onSwipeLeft");
		nextSlideShowSearchVerse.click();
    }

    function onSwipeRight(){
    	console.log("onSwipeRight");

		prevSlideShowSearchVerse.click();
    }
    swipe2.initSwipe2();

    normalScreenVerseText.addEventListener("swipeleft", onSwipeLeft );
    fullScreenVerseText.addEventListener("swipeleft", onSwipeLeft );

    normalScreenVerseText.addEventListener("swiperight", onSwipeRight  );
    fullScreenVerseText.addEventListener("swiperight", onSwipeRight );
    
   // swipeEvent(normalScreenVerseText, callbackSwipeEvent);
   // swipeEvent(fullScreenVerseText, callbackSwipeEvent);
    arrows = document.querySelectorAll(".arrow");	
    ui.showArrows(arrows);	

    //PAST SEARCH RESULTS ADD API
    function deleteItemFromSearchHistoryList(ev){
    	console.log(ev);
    	var evArr = ev.split("_");
    	keyword = evArr[0].toLowerCase();
       	console.log("keyword: " + keyword);
    	if(keyword.length!=0){
        	var bibleSearchHistory;
        	var preferenceKey = "bibleSearchHistory";
        	console.log("tizen.preference.exists(preferenceKey)" + tizen.preference.exists("bibleSearchHistory"));
        	if (tizen.preference.exists("bibleSearchHistory")){
        		bibleSearchHistory = JSON.parse(tizen.preference.getValue("bibleSearchHistory"));
            	//var keyword = slideShowTitle.innerText.split(" ")[0];
            	delete bibleSearchHistory[keyword];

            //	var callbackSort = function(arr){
            		console.log("bibleSearchHistory: " + JSON.stringify(bibleSearchHistory));       		
                	//var divToDelete = "deleteThis-"+ev;
                	//document.getElementById(divToDelete).remove();
                	if(Object.keys(bibleSearchHistory).length===0){
                		//editButtonSearch.style.display = "none";
                		tizen.preference.remove("bibleSearchHistory");
                	}else{
                		tizen.preference.setValue("bibleSearchHistory", JSON.stringify(bibleSearchHistory) );

                	}
            		editButtonSearch.click();

        	}
   		
    	}


    	
    	


    }
    //PAST SEARCH RESULTS ADD API
    function showSearchHistoryList(ev){
        var searchInputText = document.querySelector(".searchInputText");

    	console.log(ev);
    	var evArr = ev.split("_");
    	keyword = evArr[0];
    	searchInputText.value = keyword;
    	currentVersionToSearch = evArr[2];
		bibleSearchHistory = JSON.parse(tizen.preference.getValue("bibleSearchHistory"));

    	foundVerseIndex = bibleSearchHistory[keyword]["foundVerseIndex"];
    	
    	var openSlideShow = function(){
    	      console.log("searchResultsDisplay button");

    	        //showPage(10);

    	    	console.log("foundVerseIndex: " + foundVerseIndex );
    	        ui.hideSections(pages);
    	        ui.showSection(pages, 1);
    	        setActivePage("popup");

    	        updateSlideShowPage();
    	};
        var getResults = function() {
        	foundVerses = [];
            console.log("display results");
            searchResults.innerHTML = "";
            console.log("input text value: " + searchInputText.value);

            keyword = searchInputText.value;
            console.log("keyword =" + keyword);
            var resultsCount = 0,
                totalBooksSearched = 0,
                filename;



            var findWord = function(bookname, chapters) {
                for (c in chapters) {
                    var verses = chapters[c]["chapter"];
                    for (v in verses) {
                        var string = verses[v]["verse"].trim();

                        if (string.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
                            //console.log("word: " + string);  
                            resultsCount += 1;

                            var jsonObj = [bookname, c, v];
                            //console.log("jsonObj: " + JSON.stringify(jsonObj));
                            foundVerses.push(jsonObj);
                            //searchResults.innerHTML = "Found " + resultsCount + " verses";

                        }

                    }

                }
                //console.log("results count: " + resultsCount);
            }
            searchResults.innerHTML = "Searching...";

            for (x in bibleToSearch) {
                var bookname = bibleToSearch[x]["book_name"];
                totalBooksSearched += 1;

                //progressBar_percent = (totalBooksSearched / 66) * 100; 
                //console.log("progressBar percent " + progressBar_percent );
                //progressBarWidget.value(progressBar_percent);

                var chapters = bibleToSearch[x]["book"];
                findWord(bookname, chapters);
            }

            var version = settingsData["bibleversion"].toUpperCase();
            searchResults.innerHTML = "Found " + resultsCount + " verses <br> in the " + version + " bible";
            console.log("Found " + resultsCount + " verses");
            if (resultsCount > 0) {
            	searchResultsDisplayButton.style.display = "block";
                goButtonSearch.style.display = "none";
                openSlideShow();
            }else{
            	
            }

        };
        var loadBibleData = function() {
        	var biblejsfiles = ['Genesis.js', 'Exodus.js', 'Leviticus.js', 'Numbers.js', 'Deuteronomy.js', 'Joshua.js', 'Judges.js', 'Ruth.js', '1_Samuel.js', '2_Samuel.js', '1_Kings.js', '2_Kings.js', '1_Chronicles.js', '2_Chronicles.js', 'Ezra.js', 'Nehemiah.js', 'Esther.js', 'Job.js', 'Psalms.js', 'Proverbs.js', 'Ecclesiastes.js', 'Song_of_Songs.js', 'Isaiah.js', 'Jeremiah.js', 'Lamentations.js', 'Ezekiel.js', 'Daniel.js', 'Hosea.js', 'Joel.js', 'Amos.js', 'Obadiah.js', 'Jonah.js', 'Micah.js', 'Nahum.js', 'Habakkuk.js', 'Zephaniah.js', 'Haggai.js', 'Zechariah.js', 'Malachi.js', 'Matthew.js', 'Mark.js', 'Luke.js', 'John.js', 'Acts.js', 'Romans.js', '1_Corinthians.js', '2_Corinthians.js', 'Galatians.js', 'Ephesians.js', 'Philippians.js', 'Colossians.js', '1_Thessalonians.js', '2_Thessalonians.js', '1_Timothy.js', '2_Timothy.js', 'Titus.js', 'Philemon.js', 'Hebrews.js', 'James.js', '1_Peter.js', '2_Peter.js', '1_John.js', '2_John.js', '3_John.js', 'Jude.js', 'Revelation.js'];
            var readAsJson = function(str) {
                console.log("readAsJson");

                bibleToSearch = JSON.parse(str)["version"];
                getResults();
            };
            bibleToSearch = {};
        	var addBook = function(bookNumber){
        		console.log("bookNumber: " + bookNumber);
        		bibleToSearch[bookNumber.toString()] = bookData;
                console.log("bibletosearch: " + Object.keys(bibleToSearch));
        		if(Object.keys(bibleToSearch).length===66){
        	        bookData = {"kjv": null};
        	        getResults();
        		}
        	};
            for (var x=0; x<biblejsfiles.length; x++){
            	bookData = null;
            	var bookNumber = x+1;
            	var FILE_URL = "../../zipbibles/"+currentVersionToSearch+"/"+biblejsfiles[x];
                console.log("bookNumber: " + bookNumber);

            	filesystem.loadJS(FILE_URL, bookNumber, false, addBook);

            }

     
        };
    	var init = function(){
    	       foundVerses = [];
    	        if (searchInputText.value.length > 0) {
    	        	

    	                console.log("its a different version, load a new version for searching");
    	                searchResults.innerHTML = TRANSLATIONS["loadingData"];
    	                loadBibleData();
    	            

    	        }
    	};
    	init();



    	
    }
    function initSearchHistory(buttonsType){
    	console.log("initSearchHistory");
      	var bibleSearchHistory = {};
    	var preferenceKey = "bibleSearchHistory";
    	if (tizen.preference.exists("bibleSearchHistory")){

    		 bibleSearchHistory = JSON.parse(tizen.preference.getValue("bibleSearchHistory"));
        	 console.log("bibleSearchHistory: " + JSON.stringify(bibleSearchHistory));
			 var searchHistoryListArray = [];
			 for (keyword in bibleSearchHistory ){
				 
				 if (keyword.length!=0){
					 var title = keyword.toLowerCase();
					 var id = keyword +"_"+bibleSearchHistory[keyword]["foundVerseIndex"]+"_"+bibleSearchHistory[keyword]["bibleVersionToSearch"];
					 var jsonObj = {"label": title, "id": id};
					 console.log("jsonObj: " + JSON.stringify(jsonObj));
					 searchHistoryListArray.push(jsonObj);							 
				 }
					 
			 }

			 var callbackSort = function(arr){
				 searchHistoryListArray = arr;
				 console.log("sorted: " + JSON.stringify(searchHistoryListArray));
	    			if (SearchHistoryList.children.length>0){
	    				SearchHistoryList.removeChild(elementList);
	    			}

	    			
	    			var addButtonListeners = function(){
	                	if(buttonsType!="deleteButtons"){
	                		console.log("create buttonstype: " + buttonsType);
		    				listmaker.addListenersToItemList(elementList, showSearchHistoryList);

	                	}else{
	                		console.log("create buttonstype: " + buttonsType);

		    				listmaker.addListenersToItemList(elementList, deleteItemFromSearchHistoryList);

	                	}
	    			};
	    			var loadButtonList = function(doc){
	    				elementList = doc;
	    				SearchHistoryList.appendChild(elementList);
	    	    		SearchHistoryList.style.display = "block";
	    	    		document.getElementById("SearchHistoryListNone").style.display = "none";
	    	    		editButtonSearch.style.display = "block";

	    				addButtonListeners();
	    				//ui.showElement(page);

	    			};

	    			var createButtonList = function(){
	                	console.log("createButtonList");
	                	console.log("searchHistoryListArray: " + JSON.stringify(searchHistoryListArray));
	                	if(buttonsType!="deleteButtons"){
	                		console.log("create buttonstype: " + buttonsType);
		    				listmaker.createButtonList(searchHistoryListArray, loadButtonList);

	                	}else{
	                		console.log("create buttonstype: " + buttonsType);
                            
		    				listmaker.createDeleteButtonList(searchHistoryListArray, loadButtonList);

	                	}
	    			};
	    			createButtonList();

			 };
			 listmaker.sortListArray(searchHistoryListArray, "label", callbackSort); 		
    	}else{
    		SearchHistoryList.style.display = "none";
    		document.getElementById("SearchHistoryListNone").style.display = "block";
    		editButtonSearch.style.display = "none";
    		
    	}
    }
    
    function updateSearchHistory(keyword, _foundVerseIndex){
    	console.log("_foundVerseIndex: " +_foundVerseIndex);
		var bibleSearchHistory = JSON.parse(tizen.preference.getValue("bibleSearchHistory"));
	  	bibleSearchHistory[keyword]["foundVerseIndex"] = _foundVerseIndex;
        //	var callbackSort = function(arr){
        		tizen.preference.setValue("bibleSearchHistory", JSON.stringify(bibleSearchHistory) );
        		console.log("bibleSearchHistory updated: " + JSON.stringify(bibleSearchHistory));   		
    }
    function saveSearchHistory(keyword, foundVerseIndex){
    	console.log("keyword: " + keyword);
    	console.log("foundVerseIndex: "+foundVerseIndex);
    	if(keyword.length!=0){
        	var bibleSearchHistory = {};
        	var preferenceKey = "bibleSearchHistory";
        	console.log("tizen.preference.exists(preferenceKey)" + tizen.preference.exists("bibleSearchHistory"));
        	if (tizen.preference.exists("bibleSearchHistory")){
        		bibleSearchHistory = JSON.parse(tizen.preference.getValue("bibleSearchHistory"));
        		
        	}
        	//var keyword = slideShowTitle.innerText.split(" ")[0];
        	bibleSearchHistory[keyword] = {"bibleVersionToSearch": currentVersionToSearch, "foundVerseIndex": foundVerseIndex};
        //	var callbackSort = function(arr){
        		tizen.preference.setValue("bibleSearchHistory", JSON.stringify(bibleSearchHistory) );
        		console.log("bibleSearchHistory: " + JSON.stringify(bibleSearchHistory));   		
    	}

    	//};
    	//listmaker.sortListArray(bibleSearchHistory, callbackSort);
    }
    
    searchButton.addEventListener("click", function(){
    	searchSection.style.display = "block"
        searchHistorySection.style.display = "none";
    	editButtonSearch.style.display = "none";
    	searchResultsDisplayButton.style.display = "none";
    	inputTextFocus();

    	document.querySelector(".searchresultsshow").style.display = "block";
    	document.querySelector(".searchresultsshow").innerHTML = TRANSLATIONS["search"]+": "+ settingsData["bibleversion"].toUpperCase();

    });
    historyButton.addEventListener("click", function(){
    	searchSection.style.display = "none"
        searchHistorySection.style.display = "block";
    	searchResultsDisplayButton.style.display = "none";
    	initSearchHistory("historybuttons");
    });
    
    editButtonSearch.addEventListener("click", function(){
    	searchSection.style.display = "none"
            searchHistorySection.style.display = "block";
        	initSearchHistory("deleteButtons");
        });
    
    var versionToSearchButton = document.querySelector(".versionToSearchButton");
    versionToSearchButton.addEventListener("click", changeVersionToSearch);
    
    
  /*  document.getElementById("editButtonText").innerHTML = TRANSLATIONS["edit"];
    if (TRANSLATIONS["edit"].length > 5) {
        console.log("text has overlflown");
        document.getElementById("editButtonSearch").className = "marquee";
    } else {
        // console.log("text has not overlflown");
    	document.getElementById("editButtonSearch").className = "marqueeNo";
    }
    
    searchResultsDisplay.innerHTML = TRANSLATIONS["viewResults"];
    if (TRANSLATIONS["viewResults"].length > 5) {
        console.log("text has overlflown");
        document.getElementById("searchResultsDisplayButton").className = "marquee";
    } else {
        // console.log("text has not overlflown");
    	document.getElementById("searchResultsDisplayButton").className = "marqueeNo";
    }*/
    document.getElementById("findButtonText").innerHTML = TRANSLATIONS["find"];
    document.querySelector(".noSearchHistoryText").innerHTML = TRANSLATIONS["noSearchHistory"];
};

window.onunload = function() {
    if (document.getElementById("minScreen").style.display === "block") {
        settingsData["fullScreen"] = false;
    }
    
    if (document.getElementById("SearchPage").style.display === "block"){
        tizen.preference.setValue("changingVersion", false);

    }
    settingsData_CRUD.update(settingsData);
    tts.cancel();

}