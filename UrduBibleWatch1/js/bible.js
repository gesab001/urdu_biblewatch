var bible = (function() {

    this.checkForBookOfSolomon = function(callback) {
        console.log("book is Song of Solomon");

        var onCallback = function(str) {
            if (str === "error") {

                fileToExtract = stringMaker.getFileToExtract(version, "Song of Songs");
                filename = stringMaker.getBookJsFilename("Song of Songs");
                callback();

            } else {
                console.log("isExists Song of Solomon: " + isExists);
                callback();
            }
        };


        var FILE_URL = "../../zipbibles/" + version + "/Song_of_Solomon.js";
        filesystem.loadJS(FILE_URL, "bookData", false, onCallback);
        //archive.checkIfSongOfSolomonJsonExistsInZipFile(pathToZipFile, fileToExtract, onCallback);
    };
    this.initBibleView = function() {

        var getBookFromZipFile = function(pathToZipFile, fileToExtract) {
            archive.getFileFromZip(pathToZipFile, fileToExtract, getBookData);
        };


        var getBookData = function() {

            var pathToBible = "../../zipbibles/" + version;


            var initBookLocale = function(response) {
                bookLocale = response;
            };
            localization.getLocalizedBook(book, initBookLocale);


            FILE_URL = pathToBible + "/" + filename.split(".")[0].replace(/ /g, "_") + ".js";
            console.log("FILE_URL: " + FILE_URL);

            filesystem.loadJS(FILE_URL, "bookData", false, browseView);
        }
        getBookData();
    };
    this.loadBrowseReferences = function(json) {
        references = json;
        totalVerses = references.length;
        console.log("loadBrowseReferences totalVerses: " + totalVerses);
        currentID = verse - 1;
        console.log("currentID: " + currentID);
        progress.updateProgressBarManual((currentID + 1), totalVerses);
        this.getTheWordOfGod();
    };

    function getBookChapterVerse(currentID) {
            console.log("currentID: " + currentID);

            function getBook(currentID, callback) {

                book = "Genesis";
                for (bookItem in references) {
                    //console.log(bookItem);
                    var start = references[bookItem]["start"];
                    var end = references[bookItem]["end"];
                    //console.log("start: " + start);
                    //console.log("end: " + end);
                    if (currentID >= start && currentID <= end) {
                        book = bookItem;
                        break;
                    }
                }
                console.log("book match found: " + book);
                callback(book, currentID);
            }

            function getChapter(book, currentID) {
                chapter = "1";
                chapters = references[book]["chapter"];
                for (chapterItem in chapters) {
                    //console.log(chapterItem);
                    var start = chapters[chapterItem]["startID"];
                    var end = chapters[chapterItem]["lastID"];
                    //console.log("start: " + start);
                    //console.log("end: " + end);
                    if (currentID >= start && currentID <= end) {
                        chapter = chapterItem;

                        break;
                    }
                }
                getVerse(book, chapter, currentID);

            }

            function getVerse(book, chapter, currentID) {
                verse = "1";
                var startID = references[book]["chapter"][chapter]["startID"];
                var lastID = references[book]["chapter"][chapter]["lastID"];
                console.log("startID: " + startID);
                console.log("lastID: " + lastID);
                verse = currentID - startID + 1;
                verse = verse.toString();
                console.log(book + " " + chapter + " " + verse);


            }

            getBook(currentID, getChapter);
        }
        /*	this.getReferenceMinute = function(currentID){
        	    getBookChapterVerse(currentID);

        	    if (bookData == undefined) {
        	    	console.log("bookData is undefined");
        	        getBookData();
        	    } else {
        	    	console.log(" bible.getTheWordOfGod");
        	        bible.getTheWordOfGod();
        	    }
        	};*/

    this.getReferenceMinute = function(currentID) {
        getBookChapterVerse(currentID);
        var filenameToCompare = stringMaker.getBookJsFilename(book);
        console.log("getReferenceMinute book: " + filenameToCompare);
        console.log("getReferenceMinute filename: " + filename);

        if (bookData == undefined) {
            console.log("bookData is undefined");
            getBookData();
        } else if (filenameToCompare != filename) {
            bookData = null;
            console.log("bookData is wrong");

            getBookData();

        } else {

            bible.getTheWordOfGod();
        }
    };
    this.getReference = function(currentID) {
        var reference = references[currentID];
        book = reference[0];
        chapter = reference[1];
        verse = reference[2];
        if (bookData == undefined) {
            getBookData();
        } else {
            bible.getTheWordOfGod();
        }
    };

    this.getBrowseTitle = function() {
        var updatePage = function() {
            var title = bookLocale + " " + chapter;
            //this.setTitle(title);
    		document.getElementById("Title").innerHTML = verse + "/" + totalVerses;

        };
        if (bookLocale === undefined) {
            this.getBookLocaleIfUndefined(updatePage);
        } else {
            updatePage();
        }
    };

    this.setTitle = function(title) {
        document.getElementById("Title").innerHTML = title;

    };
    this.saveBookmark = function() {
 
        var callback = function(_book){
        	console.log("_book: " + _book);
            var bookmarkTitle;

            console.log("input bookmark: " + input.value);
            if (input.value.length != 0) {
                bookmarkTitle = input.value;
            } else {
                bookmarkTitle = _book + " " + chapter + ":" + verse;
            }
            var key = book.replace(" ", "") + chapter + verse;

            console.log("bookmarktitle: " + bookmarkTitle);

            if (tizen.preference.exists("bookmarkList")) {
                bookmarkList = JSON.parse(tizen.preference.getValue("bookmarkList"));
            } else {
                bookmarkList = {};
            }
            bookmarkList[key] = {
                    "title": bookmarkTitle,
                    "reference": [book, chapter, verse]
                };
                console.log("bookmarkList: " + JSON.stringify(bookmarkList));

            settingsData_CRUD.saveToPreferences("bookmarkList", bookmarkList);

            //alert(LANG_JSON_DATA["TRANSLATIONS"]["COMMON"]["alertSaved"]);
            ui.hideSections(sections);
            ui.showSection(sections, 4);       	
        };
        localization.getLocalizedBook(book, callback);

    };
    this.bookmarkThisButtonHandler = function() {


        var callback = function(_book) {
            console.log("bookmarkThisButtonHandler");

            var textToSave = _book + "\n " + chapter + ":" + verse;
            var proceedToSave = confirm(LANG_JSON_DATA["TRANSLATIONS"]["BOOKMARKS_PAGE"]["confirmBookmark"].replace("[***]", textToSave ));
            console.log("proceedtoSave: " + proceedToSave);


            if (proceedToSave) {
                ui.hideSections(sections);
                ui.showSection(sections, 5);
                input.value = '';
                input.placeholder = textToSave;
            }
        };
        localization.getLocalizedBook(book, callback);

    };
    var getBibleVerse = function(bookData, book, chapter, verse, callback) {
        var wordOfGod = bookData["book"][chapter.toString()]["chapter"][verse.toString()]["verse"].trim();
        callback(wordOfGod);


    };
    this.getBookLocaleIfUndefined = function(callback) {
        console.log("bookLocale is undefined");
        var bookKey = book.replace(/ /g, "-");

        var init = function(locale) {
            console.log("locale language: " + locale.language);
            if (locale.language.substring(0, 2) === "en") {
                bookLocale = book;
            } else {
                try {
                    bookLocale = bibleBookTitlesInDifferentLanguages[bookKey];
                } catch (e) {
                    console.log(e.message);
                    bookLocale = book;
                }
            }
            console.log("bookLocale: " + bookLocale);
            callback();


        };

        localization.getDeviceLocaleLanguage(init);
    };
    var showWordOfGod = function(wordOfGod) {

		if(wordOfGod.length==0){
			   wordOfGod = LANG_JSON_DATA["TRANSLATIONS"]["COMMON"]["verseNotExist"];
		}
        console.log("wordOfGod: " + wordOfGod);
        console.log("not exist: " + "verse doesn't exist in this bible version");
        if (wordOfGod === "verse doesn't exist in this bible version") {
			   wordOfGod = LANG_JSON_DATA["TRANSLATIONS"]["COMMON"]["verseNotExist"];
        }	
		
        var updatePage = function() {
        	var _book;
        	var reference;
        	
        	var updateHTML = function(){
                bibleverse.innerHTML = "<span style='color: yellow;'>" + reference + "</span><br>" + wordOfGod;
                bibleverse2.innerHTML = "<span style='color: yellow;'>" + reference + "</span><br>" + wordOfGod;
                tts.play(wordOfGod + " " + reference);      		
        	};
            if (LANG_JSON_DATA["VERSIONLANGUAGE"][settingsData["bibleversion"]]==="english"){
            	_book = book;
                reference = _book + " " + chapter + ":" + verse;
                updateHTML();


            }else{
            	var callback = function(_book){
                    reference = _book + " " + chapter + ":" + verse;
                    updateHTML();

            		
            	};
            	localization.getLocalizedBook2(book, callback);
            }

            

        };
        if (bookLocale === undefined) {
            this.getBookLocaleIfUndefined(updatePage);
        } else {
            updatePage();
        }
        console.log("bibleversion: " + settingsData["bibleversion"]);



    };
    this.getTheWordOfGod = function() {
        getBibleVerse(bookData, book, chapter, verse, showWordOfGod);

    }
    var nextCurrentID = function(currentID, totalVerses) {
        var newID = currentID + 1;
        if (newID > totalVerses - 1) {
            newID = totalVerses - 1;
        }
        return newID;
    };
    var prevCurrentID = function(currentID, totalVerses) {
        var newID = currentID - 1;
        if (newID < 0) {
            newID = 0;
        }
        return newID;
    };

    var updateBrowseView = function() {
        this.getReference(currentID);
        this.getBrowseTitle();
        progress.updateProgressBarManual((currentID + 1), totalVerses);
    	document.getElementById("Title").innerHTML = (currentID+1) + "/" + totalVerses;

    };
    this.nextVerse = function() {
        console.log("nextVerse");
        currentID = nextCurrentID(currentID, totalVerses);
        updateBrowseView();
        
    };

    this.prevVerse = function() {
        console.log("prevVerse");

        currentID = prevCurrentID(currentID, totalVerses);
        updateBrowseView();
    };

    this.addVerseToFavorites = function() {
        var TRANSLATIONS = LANG_JSON_DATA["TRANSLATIONS"]["COMMON"];
        var favoritesList = [];
        if (tizen.preference.exists("favoriteVerses")) {
            favoritesList = JSON.parse(tizen.preference.getValue("favoriteVerses"));
        }
        var _book = book;
        var textToSave = _book + "\n" + chapter + ":" + verse;

        var proceed = function(){
            var proceedToSave = confirm(TRANSLATIONS["proceedToSaveFavorites"].replace("[***]", textToSave)); //confirm("Save\n"+textToSave + "\nto favorites?");
            if (proceedToSave) {
                var reference = [book, chapter, verse];
                var arrayList = JSON.stringify(favoritesList);
                var array = JSON.stringify(reference);
                if (arrayList.indexOf(array) != -1) {
                    //alert(TRANSLATIONS["alreadySaveToFavorites"].replace("[***]", textToSave));

                } else {
                    favoritesList.push(reference);
                    tizen.preference.setValue("favoriteVerses", JSON.stringify(favoritesList));
                    //alert(TRANSLATIONS["savedToFavorites"].replace("[***]", textToSave));
                }
            }       	
        };
        if(settingsData["bibleversion"]!="kjv"){
        	
            var callbackgetLocalizedBook2 = function(_book){
            	textToSave = _book + "\n" + chapter + ":" + verse;
            	proceed();
            };
            localization.getLocalizedBook2(book, callbackgetLocalizedBook2);
        }else{
        	proceed();
        }
        


    };
    this.setSelectedBook = function(element, selectedBook, bibleBookTitlesInDifferentLanguages) {
        var bookKey = selectedBook.replace(/ /g, "-");
        console.log("bookKey: " + bookKey);
        var  bookLocale = bibleBookTitlesInDifferentLanguages[bookKey];   
        element.innerHTML = bookLocale.replace(/-/g, " ");
        setBookTitleMarquee(bookLocale);
        console.log("bookLocale: " + bookLocale);
    };


    this.getAllReferences = function(callback) {

        var readJson = function() {
                var str = JSON.stringify(referencesJS);
                referencesJS = {};
                callback(str);
            }
            //filesystem.getJsonData("wgt-package", "references.json", readJson );
        var FILE_URL = "../../references4.js";
        filesystem.loadJS(FILE_URL, "referencesJS", false, readJson);
    };

    this.getCurrentID = function(totalVerses) {

        var numberOfVerses = totalVerses;
        var date1 = new Date();
        var date2 = new Date(2018, 5, 23, 14, 45, 0, 0);
        var difference = date1.getTime() - date2.getTime();
        var minutesDifference = Math.floor(difference / 1000 / 60) + 1;
        var x = minutesDifference % totalVerses || 0;
        return x;
    };





    this.getTotalChaptersAndVerses = function(callback) {
        totalChaptersAndVerses = {};
        //filesystem.getJsonData("wgt-package", "totalChaptersAndVerses.json", callback);
        FILE_URL = "../../totalChaptersAndVerses.js";
        filesystem.loadJS(FILE_URL, "totalChaptersAndVerses", false, callback)
    };
    this.getVerseReferencesInAChapter = function(book, chapter, callback) {

        var readAsJson = function(str) {
            console.log("readAsJson");
            //var totalChaptersAndVerses = JSON.parse(str);
            console.log(book + " " + chapter);
            var totalVerses = totalChaptersAndVerses[book]["chapter"][chapter.toString()]["totalVerses"];
            console.log("totalVerses: " + totalVerses);
            var references = [];
            for (var x = 1; x <= totalVerses; x++) {
                var verse = x;
                var reference = [book, chapter, verse];
                references.push(reference);
            };
            console.log(references);
            callback(references);
        };
        this.getTotalChaptersAndVerses(readAsJson);

    };

    this.createEmptyList = function() {
        var emptyList = [];
        return emptyList;

    };


    this.getBibleVersionsList = function(callback) {
        var fileExists;

        var readAsJson = function(str) {
            callback(JSON.parse(str));
        };
        var setFileExists = function(boolean) {
            fileExists = boolean;
            if (fileExists) {
                filesystem.getJsonData("wgt-private", "bibles.json", readAsJson);

            } else {
                filesystem.getJsonData("wgt-package", "bibles.json", readAsJson);

            }

        };


        filesystem.fileExists("wgt-private", null, "bibles.json", setFileExists);

    };

    this.switchVersionHandler = function() {
        window.location.href = "../bibleversions/index.html";
    };

    this.setVersionButtonText = function() {
        console.log("setVersionButtonText");
        var version = settingsData["bibleversion"];
        var buttonEl = switchVersionButton;
        var textEl = buttonEl.getElementsByTagName("DIV")[0];
        textEl.innerHTML = version.toUpperCase();
        if (version.length > 5) {
            console.log("text has overlflown");
            buttonEl.className = "switchVersionButton marquee";
        } else {
            // console.log("text has not overlflown");
            buttonEl.className = "switchVersionButton marqueeNo";
        }
    };
    this.getVersionButtonText = function() {
        console.log("getVersionButtonText");
        var buttonEl = switchVersionButton;
        var textEl = buttonEl.getElementsByTagName("DIV")[0];
        return textEl.innerHTML;
    };

    function loadBibleVersionList(listObj) {
        if (listObj.length !== 0) {
            for (var x = 0; x < listObj.length; x++) {
                bibleVersionList.push(listObj[x]);
            }
            bibleVersionList.sort(function(a, b) {
                return a.toLowerCase().localeCompare(b.toLowerCase());
            });
            upperCaseBibleVersionList = bibleVersionList.map(function(value) {
                return value.toUpperCase();
            });
        }
        console.log(bibleVersionList);
    };

    this.getListOfBibleVersions = function() {
        var bibleversionslist = [];
        var path = "wgt-private/zipbibles";
        var filter = {
            "name": "%zip"
        };
        var callbackGetList = function(listObj) {
            bibleversionslist = listObj;
            loadBibleVersionList(bibleversionslist);
            if (bibleversionslist.length === 0) {
                console.log("its empty");
            } else {
                console.log(bibleversionslist);
            }
        };
        var listObj = [];
        for (var x = 0; x < LANG_JSON_DATA["BIBLE_VERSIONS"].length; x++) {
            var name = LANG_JSON_DATA["BIBLE_VERSIONS"][x]["name"];
            listObj.push(name);
        }
        console.log("getListOfBibleVersions: " + listObj);
        callbackGetList(listObj);
    };

    this.changeBibleVersion = function() {
        var currentBibleVersion = bible.getVersionButtonText() + ".zip";
        currentBibleVersion = currentBibleVersion.toUpperCase();

        console.log("upperCaseNames: " + upperCaseBibleVersionList);
        console.log("currentBibleVersion: " + currentBibleVersion);

        var indexOfCurrentBibleVersion = upperCaseBibleVersionList.indexOf(currentBibleVersion);
        console.log("indexOfCurrentBibleVersion: " + indexOfCurrentBibleVersion);
        var nextVersionIndex = indexOfCurrentBibleVersion + 1;
        if (nextVersionIndex > bibleVersionList.length - 1) {
            nextVersionIndex = 0;
        }
        var nextVersion = bibleVersionList[nextVersionIndex];
        settingsData["bibleversion"] = nextVersion.replace(".zip", "");
        settingsData_CRUD.update(settingsData);
        console.log("nextVersion: " + nextVersion);
        bookData = undefined;
    };

    return this;
}());