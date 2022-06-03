var book, chapter, verse, screenSections,
isFullScreen,
settingsData,
pageID = "page_ReadingPlanPage",
switchVersionButton,
bibleVersionList = [],
upperCaseBibleVersionList,
bookData = {
        "kjv": null
    };

window.onload = function() {
	var READINGPLANS = LANG_JSON_DATA["READINGPLANS"];

	
    var sections = document.querySelectorAll(".page");
    ui.hideSections(sections);

    var screenSections = document.querySelectorAll(".section");
    settingsData = {
        "bibleversion": "kjv",
        "background": "black"
    };
    var selectedBibleToDownload;

    var references = null;
    var currentID;
    var bibles = null;
    var bibleBookTitlesInDifferentLanguages = null,
        localeLanguage,
        fontSize,
        versesPerDay,
        planVerseCount = 0,
        virtualrootDownload = "wgt-private",
        bibleDownloadfolder = "zipbibles";
    var readingPlanIndex = 0,
        selectedBookReadingPlan,
        selectedChapterReadingPlan,
        selectedVerseReadingPlan,
        selectedPlan, //= READINGPLANS["plans"][readingPlanIndex]["title"].replace(/ /g, "_");
        lengthOfPlan, //= READINGPLANS["plans"][readingPlanIndex]["days"];
        selectedPlanObj, // = READINGPLANS["readingplans"][selectedPlan];
        startDate, //= new Date();

        currentDate,
        timestampDifference,
        dayCount,
        todayIsString,
        originalStartingPoint,
        todayStartingPoint,
        todayEndPoint,
        currentVerseIndex,
        fontSize; //= new Date();

    function getBookChapterVerse(currentID, callback){

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

    		callback([book, chapter, verse]);
    		
    	}
    	getBook(currentID, getChapter);
    }
    function getBibleVerse (version, book_param, chapter_param, verse_param, elementID) {
        //console.log("getBibleVerse");
        //var version = "kjv";
    	book = book_param;
    	chapter = chapter_param;
    	verse = verse_param;
        var filename = book.replace(/\s/g, "_") + ".js";
        console.log(version + '/' + filename);
        //var chapter = "1";
        //var verse = "1";

        var updateDisplay = function() {
            var wordOfGod = bookData["book"][chapter]["chapter"][verse]["verse"];
            if (wordOfGod == "") {
			   wordOfGod = LANG_JSON_DATA["TRANSLATIONS"]["COMMON"]["verseNotExist"];

            }
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
        /*    var readAsJson = function(str) {
                //	console.log("success reading " + filename);
                bookData[version] = {};
                bookData[version] = {
                    book: ""
                };
                bookData[version][book] = JSON.parse(str);
                updateDisplay();

            } */
            var readAsJson = function(str) {
                //	console.log("success reading " + filename);
            	if(str==="error"){
             	   if (book === "Song of Solomon") {
                       console.log("book is Song of Solomon, change to Song of Songs");
                       var bookchange = "Song of Songs";
                       getBibleVerse(version, bookchange, chapter, verse, elementID);
                   }           		
            	}else{
                    updateDisplay();

            	}



            }
            bookData = {};
            FILE_URL = "../../zipbibles/"+version + "/" + filename ;
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
                var onCallbackGetJsonData = function(str){
                	if (str==="error"){
                		onError(str);
                	}else{
                		readAsJson(str);
                	}
                }
                try {
                    var path = "wgt-private/" + version;
                    //tizen.filesystem.resolve("wgt-private/" + version, onSuccess, onError, "r");
                    
                    filesystem.getJsonData(path, filename, onCallbackGetJsonData);

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
              //  tizen.archive.open(zipFilePath, 'r', openZipFileSuccess, openZipFileError);

            } else {
                var zipFilePath = virtualrootDownload + "/" + bibleDownloadfolder + "/" + version + ".zip";
         //       tizen.archive.open(zipFilePath, 'r', openZipFileSuccess, openZipFileError);

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

        var onLocaleSuccessCallback = function(locale) {
            ////console.log('The locale language is ' + JSON.stringify(locale.language));
            localeLanguage = locale.language;
            console.log("localeLanguage: " + localeLanguage);
            console.log("bibleBookTitlesInDifferentLanguages: " + bibleBookTitlesInDifferentLanguages);

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
    function updatecurrentPlan(index) {

    	var planTitle = READINGPLANS["plans"][index]["title"].replace(/ /g, "_");
    	var translatedTitle = LANG_JSON_DATA["TRANSLATIONS"]["READINGPLAN_PAGE"][planTitle];
        document.getElementById("nameplan").innerHTML = translatedTitle ;

    }

    function listener_readingplan() {
        settingsData = JSON.parse(tizen.preference.getValue("settingsData"));



        var openReadingPlan = function() {
            var setReadingPlanIndex = function(str) {
            	console.log("setReadingPlanIndex: " + str);

                var jsonObj = JSON.parse(str);
                readingPlanIndex = jsonObj["currentReadingPlan"]["plansIndex"];
                listener_viewSelectedReadingPlan();
            };
            var onError = function(e) {
                console.log(e);
                console.log("currentReadingPlan.json" + " doesn't exists");

                readingPlanIndex = 0;
                updatecurrentPlan(0);
                ui.hideSections(sections);
                ui.showSection(sections, 0);

            }
            var virtualroot = "documents",
                folder = "readingplan";
            var path = virtualroot + "/" + folder;
            var filename = "currentReadingPlan.json";
            //tizen.filesystem.resolve(path, onSuccess, onError, "w");
            
            var callbackGetJsonData = function(str){
            	if (str==="error"){
            		onError(str);
            	}else{
            		setReadingPlanIndex(str);
            	}
            };
            if(tizen.preference.exists("readingPlanPreferences")){
            	var jsonStr = tizen.preference.getValue("readingPlanPreferences");
            	setReadingPlanIndex(jsonStr);
            }else{
                console.log("readingPlanPreferences  doesn't exist");

                readingPlanIndex = 0;
                updatecurrentPlan(0);
                ui.hideSections(sections);
                ui.showSection(sections, 0);
            }
            //filesystem.getJsonData(path, filename, callbackGetJsonData);
        }

        var readAsJson = function(str) {
            //console.log("success reading references");

            references = JSON.parse(str);
            openReadingPlan();
        }
        var getJsonData = function(path) {
   
            var onError = function(e) {
                console.log(e);
            }
            var callbackGetJsonData = function(str){
            	if(str==="error"){
            		onError(str);
            	}else{
            		readAsJson(str);
            	}
            };
            try {
                //	console.log("path: " + path)
                //tizen.filesystem.resolve(path, onSuccess, onError, "r");
                filesystem.getJsonData(path, "references.json", callbackGetJsonData);

            } catch (e) {
                console.log(e);
            }

        };
        function createReferencesForReadingPlan(){
        	 console.log("createReferencesForReadingPlan");
              references = referencesJS;
              referencesJS = null;
  
             /* for (item in jsonObj){
            	 
            	  var book = item;
            	  console.log(book);
            	  var chapters = jsonObj[book]["chapter"] ;
            	  for (chapterItem in chapters){
            		  var chapter = chapterItem;
            		  console.log(chapter);  		
            		  var startID = jsonObj[book]["chapter"][chapter]["startID"];
              		  var lastID = jsonObj[book]["chapter"][chapter]["lastID"];
            		  console.log("startID: " + startID);
            		  console.log("lastID: " + lastID);
            		  var totalChapterVerses = parseInt(lastID) - parseInt(startID);
            		  console.log("totalChapterVerses: " + totalChapterVerses);
            		  for (var x=1; x<=totalChapterVerses; x++){
            			  var verse = x;
                		  console.log(book + " " + chapter + " " + verse);
                		  var referenceObj = [book, chapter, verse ];
                		  references.push(referenceObj);
            		  }
            	  }
              }*/
              tizen.preference.setValue("referencesReadingPlan", JSON.stringify(references));
              openReadingPlan();
              
        }

        if (tizen.preference.exists("referencesReadingPlan")){
        	console.log("referencesReadingPlan exists in preferences");

        	references = JSON.parse(tizen.preference.getValue("referencesReadingPlan"));
        	openReadingPlan();
       }else{
        	console.log("referencesReadingPlan doesn't exist in preferences");

        	loadJS("../../references4.js", "referencesJs", false, createReferencesForReadingPlan);
        }
        //getJsonData("wgt-package");


    }

    function listener_nextPlan() {
        console.log("next plan");
        var totalPlans = READINGPLANS["plans"].length;
        readingPlanIndex += 1;
        if (readingPlanIndex > totalPlans - 1) {
            readingPlanIndex = 0;
        }
        updatecurrentPlan(readingPlanIndex);
    }

    function listener_prevPlan() {
        console.log("prev plan");
        var totalPlans = READINGPLANS["plans"].length;
        readingPlanIndex -= 1;
        if (readingPlanIndex < 0) {
            readingPlanIndex = totalPlans - 1;
        }
        updatecurrentPlan(readingPlanIndex);
    }

    function updateProgressBarReadingPlan() {
        var percent = (planVerseCount / versesPerDay) * 100;
        //console.log("percent reading plan : " +percent);
        progress.setProgress(percent, "progressReadingPlan");
    };

    var callbackgetBookChapterVerse = function(reference){
        var book = reference[0];
        var chapter = reference[1];
        var verse = reference[2];
        selectedBookReadingPlan = book;
        selectedChapterReadingPlan = chapter;
        selectedVerseReadingPlan = verse;
        document.getElementById("biblePlanVerse_ReadingPlanPage").innerHTML = planVerseCount + " of " + versesPerDay + "<br>" + book + " " + chapter + ":" + verse;
        document.getElementById("biblePlanVerse_ReadingPlanPage2").innerHTML = planVerseCount + " of " + versesPerDay + "<br>" + book + " " + chapter + ":" + verse;

        var version = settingsData["bibleversion"];
        getBibleVerse(version, book, chapter, verse, "biblePlanVerse_ReadingPlanPage");

        updateProgressBarReadingPlan();        	
    }
    function nextPlanVerse() {
        console.log("nextPlanVerse");
        console.log("startingPoint: " + todayStartingPoint);
        console.log("endPoint: " + todayEndPoint);
        if (planVerseCount < versesPerDay) {
            currentVerseIndex += 1;
            planVerseCount += 1;
        }
        if (currentVerseIndex > 31101) {
            currentVerseIndex = 31101;
        }
        console.log("currentVerseIndex: " + currentVerseIndex);
        var jsonObj = {
            'dayCount': dayCount,        		        		
            'readingPlanIndex': readingPlanIndex,
            'currentVerseIndex': currentVerseIndex,
            'planVerseCount': planVerseCount
        };
        tizen.preference.setValue("readingPlanLastSeenVerse", JSON.stringify(jsonObj));


        getBookChapterVerse(currentVerseIndex, callbackgetBookChapterVerse);

    };

    function prevPlanVerse() {
        console.log("prevPlanVerse");
        console.log("startingPoint: " + todayStartingPoint);

        console.log("endPoint: " + (todayEndPoint - 1));
        if (planVerseCount > 1) {
            currentVerseIndex -= 1;
            planVerseCount -= 1;
        }
        var jsonObj = {
            'dayCount': dayCount,        		
            'readingPlanIndex': readingPlanIndex,
            'currentVerseIndex': currentVerseIndex,
            'planVerseCount': planVerseCount
        };
        tizen.preference.setValue("readingPlanLastSeenVerse", JSON.stringify(jsonObj));


        getBookChapterVerse(currentVerseIndex, callbackgetBookChapterVerse);
    };

    function refreshReadingPlanPageAfterVersionChange() {
        var version = settingsData["bibleversion"];
        var book = selectedBookReadingPlan;
        var chapter = selectedChapterReadingPlan;
        var verse = selectedVerseReadingPlan;
        getBibleVerse(version, book, chapter, verse, "biblePlanVerse_ReadingPlanPage");

    }
    var selectANewReadingPlanLink = null;

    function getStartingPointReference(todayStartingPoint, callback){
 
        
        var callbacktodayStartingPoint = function(reference){
            //var reference = references[todayStartingPoint];
            var book = reference[0];
            var first_book;
            if (book.indexOf(" ") == -1) {
                first_book = book.substring(0, 3);
            } else {
                first_book = book.substring(0, 4);
            }

            var chapter = reference[1];
            var verse = reference[2];
            var first_referenceString = first_book + " " + chapter + ":" + verse;
            callback(first_referenceString);       	
        }
        getBookChapterVerse(todayStartingPoint, callbacktodayStartingPoint);
    }
    function listener_viewSelectedReadingPlan() {
        ui.hideSections(sections);
        ui.showSection(sections, 1);

        if (selectANewReadingPlanLink != null) {
            selectANewReadingPlanLink.removeEventListener("click", changeReadingPlan_handler);

        }
        selectedPlan = READINGPLANS["plans"][readingPlanIndex]["title"].replace(/ /g, "_");
        lengthOfPlan = READINGPLANS["plans"][readingPlanIndex]["days"];
        selectedPlanObj = READINGPLANS["readingplans"][selectedPlan];

        //console.log(JSON.stringify(selectedPlanObj));
        //tizen.preference.setValue("currentReadingPlan", plansIndex);
        startDate = new Date();

        //console.log("length of plan: " + lengthOfPlan);

        //console.log(startDate.getTime());
        startDateArray = [startDate.getFullYear(), startDate.getMonth(), startDate.getDate()];
        var jsonObj = {
            "currentReadingPlan": {
                "title": READINGPLANS["plans"][readingPlanIndex]["title"],
                "plansIndex": readingPlanIndex,
                "startDate": startDateArray,
                "lengthOfPlan": lengthOfPlan,
                "settings": selectedPlanObj
            }
        };
        //console.log(JSON.stringify(jsonObj));
        var virtualroot = "documents",
            folder = "readingplan",
            filename = "currentReadingPlan.json";

        var continueReading = function(dayCount) {

            //var monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
            //var daysArray = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];
            todayIsString = currentDate.toDateString();
            //new Date(year, month, day, hours, minutes, seconds, milliseconds)



            versesPerDay = jsonObj["currentReadingPlan"]["settings"]["versesPerDay"];
            console.log("versesPerDay: " + versesPerDay );

            originalStartingPoint = jsonObj["currentReadingPlan"]["settings"]["start"];
            console.log("originalStartingPoint: " + originalStartingPoint);
            todayStartingPoint = originalStartingPoint + (dayCount * versesPerDay);
            console.log("todayStartingPoint: " + todayStartingPoint);

            var isLastDay = false;
            if ((dayCount + 1) == lengthOfPlan) {
                isLastDay = true;
                lastVersesPerDay = jsonObj["currentReadingPlan"]["settings"]["lastDayVerses"];
                todayEndPoint = todayStartingPoint + lastVersesPerDay;
                versesPerDay = lastVersesPerDay;

            } else {
                todayEndPoint = todayStartingPoint + versesPerDay;

            }
	
            currentVerseIndex = todayStartingPoint;
 
            planVerseCount = 1;
            var setReadingPlanDayCount = function(){
                var callbackgetlastReference = function(last_reference){
                    last_book = last_reference[0];
                    
                    if (last_book.indexOf(" ") == -1) {
                        last_book = last_book.substring(0, 3);
                    } else {
                        last_book = last_book.substring(0, 4);
                    }
                    last_chapter = last_reference[1];
                    last_verse = last_reference[2];
                    last_referenceString = last_book + " " + last_chapter + ":" + last_verse;
                    var callbacktodayStartingPoint = function(startingPointReferenceString){
                    	 document.getElementById("readingPlanDayCount").innerHTML = LANG_JSON_DATA["TRANSLATIONS"]["READINGPLAN_PAGE"]["day"]+ " " + (dayCount + 1) + "<br>" + startingPointReferenceString + " - " + last_referenceString;
                    };
                    getStartingPointReference(todayStartingPoint, callbacktodayStartingPoint);
                               	
                };
                getBookChapterVerse(todayEndPoint -1, callbackgetlastReference);        	
            };
            var initNewReadingPlan = function(){
              	console.log("readingPlanLastSeenVerse doesn't exists");
                setReadingPlanDayCount(); 
                getBookChapterVerse(currentVerseIndex, callbackgetBookChapterVerse);


            };
            var initOldReadingPlan = function(currentVerseIndex){
              	console.log("readingPlanLastSeenVerse exists");
              	console.log("load old reading plan");
                setReadingPlanDayCount();
                getBookChapterVerse(currentVerseIndex, callbackgetBookChapterVerse);


            };
            if (tizen.preference.exists("readingPlanLastSeenVerse")) {
            	console.log("readingPlanLastSeenVerse exists");
                var readingPlanLastSeenVerse = JSON.parse(tizen.preference.getValue("readingPlanLastSeenVerse"));
                var savedReadingPlanIndex = readingPlanLastSeenVerse["readingPlanIndex"];

                if(dayCount===readingPlanLastSeenVerse["dayCount"]){
               	   if (savedReadingPlanIndex == readingPlanIndex) {
                        planVerseCount = readingPlanLastSeenVerse["planVerseCount"];
                        currentVerseIndex = readingPlanLastSeenVerse["currentVerseIndex"];
                        initOldReadingPlan(currentVerseIndex);

                    }else{
                    	initNewReadingPlan();

                    }
                }
                else{
                 	console.log("initNewReadingPlan");

               	    initNewReadingPlan();
                }

            }else{
              	console.log("initNewReadingPlan");

            	initNewReadingPlan();
            }


 
        };
        var updatePage = function() {
            var startYear = startDateArray[0];
            var startMonth = startDateArray[1];
            var startDay = startDateArray[2];
            console.log("startDay: " + startDay);

            var startDateString = new Date(startYear, startMonth, startDay).toDateString();


            
            currentDate = new Date();
            currentDateArray = [currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()];
            var currentYear = currentDateArray[0];
            var currentMonth = currentDateArray[1];
            var currentDay = currentDateArray[2];
            console.log("currentDay: " + currentDay);
            currentDate = new Date(currentYear, currentMonth, currentDay);
            startDate = new Date(startYear, startMonth, startDay);
            console.log("The local time zone is " + tizen.time.getAvailableTimezones());

            function addHours(numOfHours, date) {
            	  date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);

            	  return date;
            	}
            var currentDateDST = new tizen.TZDate(currentYear, currentMonth, currentDay);
            var startDateDST = new tizen.TZDate(startYear, startMonth, startDay);

            var isDstActiveInCurrentDateDST = currentDateDST.isDST(); // true
            var isDstActiveInStartDateDST = startDateDST.isDST(); // false         
            console.log("isDstActiveInCurrentDateDST: " + isDstActiveInCurrentDateDST);
            console.log("isDstActiveInStartDateDST: " + isDstActiveInStartDateDST);
            if (isDstActiveInCurrentDateDST){
            	//alert("its current date is day light savings");
                if (isDstActiveInStartDateDST){
                	//alert("its day light savings");
                }else{
                	console.log("change startDate to daylight savings time");
                	startDate = addHours(-1, startDate);
                }
            }
            if (isDstActiveInStartDateDST){
            	//alert("its start date is day light savings");
                if (isDstActiveInCurrentDateDST){
                	//alert("its day light savings");
                }else{
                	console.log("change startDate to standard time");
                	startDate = addHours(1, startDate);
                }
            }
            currentDateTimestamp = currentDate.getTime();
            startDateTimestamp = startDate.getTime();

            timestampDifference = currentDateTimestamp - startDateTimestamp;
            // To calculate the no. of days between two dates
            console.log("startDate: " + startDate);
            console.log("currentDate: " + currentDate);
            
            var getDifferenceInDays = function(date1, date2) {
          	  const diffInMs = Math.abs(date2 - date1);
          	  return diffInMs / (1000 * 60 * 60 * 24);
          	};
          	
            dayCount = getDifferenceInDays(startDate, currentDate);
            console.log("dayCount: " + dayCount);

            
            console.log("lengthOfPlan: " + lengthOfPlan);
            if (dayCount < lengthOfPlan && dayCount>-1) {
                continueReading(dayCount);
            } else {
            	console.log(LANG_JSON_DATA["TRANSLATIONS"]["READINGPLAN_PAGE"]["expired"]);
                var div = document.getElementById("biblePlanVerse_ReadingPlanPage");
                div.innerHTML = LANG_JSON_DATA["TRANSLATIONS"]["READINGPLAN_PAGE"]["expired"];
                var div2 = document.getElementById("biblePlanVerse_ReadingPlanPage2");
                div2.innerHTML = LANG_JSON_DATA["TRANSLATIONS"]["READINGPLAN_PAGE"]["expired"];
            }
            
        };


        var checkIfFileExists = function() {
            	console.log("checking if file exists");

            var readAsJson = function(str) {
                	console.log("readAsJson");
                console.log(jsonObj["currentReadingPlan"]["title"]);
                var newTitle = jsonObj["currentReadingPlan"]["title"];
                var oldTitle = JSON.parse(str)["currentReadingPlan"]["title"];
                	console.log(oldTitle + "==" + newTitle);

                if (oldTitle == newTitle) {
                	console.log("same plan");
                    jsonObj = JSON.parse(str);
                    startDateArray = jsonObj["currentReadingPlan"]["startDate"];
                    updatePage();

                } else {
                    console.log("not the same plan");
                    //startDate = jsonObj["currentReadingPlan"]["startDate"];

                    updatePage();
                    var fileContents = jsonObj;
                    settingsData_CRUD.saveToPreferences("readingPlanPreferences", fileContents);
                    //fileSaver.saveToDocumentsSDK4(virtualroot, folder, filename, fileContents);
                }
            }
            var getJsonData = function() {

                var onSuccess = function(dir) {
                      console.log("on sucess: " );
                    try {
                        var file_obj = dir.resolve("currentReadingPlan.json");
                        file_obj.readAsText(readAsJson, null, 'UTF-8');
                    } catch (e) {
                        console.log(e.message);
                    }
                }
                var onError = function(e) {
                    console.log(e);
                }
                try {
                    		console.log("path: " + virtualroot);
                  //  tizen.filesystem.resolve(virtualroot + "/" + folder, onSuccess, onError, "r");

                } catch (e) {
                    console.log(e);
                }

            };
            var onSuccess = function(dir) {
                //	console.log("on sucess: " + dir.toString());

                try {
                    var file_obj = dir.resolve("currentReadingPlan.json");
                        console.log("currentReadingPlan.json" + "exists");
                    getJsonData();
                } catch (e) {
                    console.log(e.message);
                    updatePage();
                    var fileContents = jsonObj;
                    settingsData_CRUD.saveToPreferences("readingPlanPreferences", fileContents);

                    //fileSaver.saveToDocumentsSDK4(virtualroot, folder, filename, fileContents);
                }
            };
            var onError = function(e) {
                console.log(e);
                console.log("currentReadingPlan.json doesn't exist");
                startDateArray = jsonObj["currentReadingPlan"]["startDate"];
                currentDate = new Date();
                currentDate = currentDate.getTime();
                updatePage();
                var fileContents = jsonObj;
                settingsData_CRUD.saveToPreferences("currentReadingPlan", fileContents);

                //fileSaver.saveToDocumentsSDK4(virtualroot, folder, filename, fileContents);
                document.getElementById("biblePlanVerse_ReadingPlanPage").innerHTML = planVerseCount + " of " + versesPerDay + "<br>" + book + " " + chapter + ":" + verse;
                document.getElementById("biblePlanVerse_ReadingPlanPage2").innerHTML = planVerseCount + " of " + versesPerDay + "<br>" + book + " " + chapter + ":" + verse;

            };
            if(tizen.preference.exists("readingPlanPreferences")){
            	var jsonStr = tizen.preference.getValue("readingPlanPreferences");
            	readAsJson(jsonStr);
            }else{
            	startDateArray = jsonObj["currentReadingPlan"]["startDate"];
                currentDate = new Date();
                currentDate = currentDate.getTime();
                document.getElementById("biblePlanVerse_ReadingPlanPage").innerHTML = planVerseCount + " of " + versesPerDay + "<br>" + book + " " + chapter + ":" + verse;
                document.getElementById("biblePlanVerse_ReadingPlanPage2").innerHTML = planVerseCount + " of " + versesPerDay + "<br>" + book + " " + chapter + ":" + verse;

                updatePage();
                var fileContents = jsonObj;
                settingsData_CRUD.saveToPreferences("readingPlanPreferences", fileContents);

                //fileSaver.saveToDocumentsSDK4(virtualroot, folder, filename, fileContents);

            }
            //tizen.filesystem.resolve(virtualroot + "/" + folder, onSuccess, onError, "w");
        }
        checkIfFileExists();
    }

    function nameplan_handler() {

    	//var callback = function(){
            listener_viewSelectedReadingPlan();

    	//};
    	//filesystem.deleteFile("documents", "readingplan", "currentReadingPlan.json", callback);
    }
    document.getElementById("nextPlan").addEventListener("click", listener_nextPlan);
    document.getElementById("prevPlan").addEventListener("click", listener_prevPlan);
    document.getElementById("nameplan").addEventListener("click", nameplan_handler);

    function changeReadingPlan_handler() {
        ui.hideSections(sections);
        ui.showSection(sections, 0);
        readingPlanIndex = 0;
        updatecurrentPlan(0);
    }
    document.getElementById("changeReadingPlanButton").addEventListener("click", changeReadingPlan_handler);

    rotaryEventHandler = function(e) {
        if (e.detail.direction === 'CW') {

            document.getElementById("nextPlanVerse").click();
        } else if (e.detail.direction === 'CCW') {

            document.getElementById("prevPlanVerse").click();
        }
    };

    document.getElementById("nextPlanVerse").addEventListener("click", nextPlanVerse);
    document.getElementById("prevPlanVerse").addEventListener("click", prevPlanVerse);

    document.addEventListener('rotarydetent', rotaryEventHandler, false);
    
	function changeFontSize(){
		console.log("change font size");
		settingsData = JSON.parse(tizen.preference.getValue("settingsData"));
		settingsData["fontSize"] = settingsData["fontSize"]  + 2;
		if (settingsData["fontSize"]>40){
			settingsData["fontSize"] = 14;
		}
	    ui.setFontSize("biblePlanVerse_ReadingPlanPage", settingsData["fontSize"]);	
	    ui.setFontSize("biblePlanVerse_ReadingPlanPage2", settingsData["fontSize"]);	

	    settingsData_CRUD.update(settingsData);
	}

	document.querySelector(".fontResizeButton").addEventListener("click", changeFontSize);
	ui.initAddtoFavoriteButtons();

    addPopup(screenSections);
    function setFullScreen(){
    	console.log("setFullScreen");
    	ui.hideSections(screenSections);
    	ui.showSection(screenSections, 1);
        setActivePage("popup");	
        isFullScreen = true;
        settingsData["fullScreen"] = isFullScreen;


        
    }
	function openClock(){
		settingsData["fullScreen"] = true;
		console.log("fullScreen: " + settingsData["fullScreen"]);
		console.log("window.location.href: " + window.location.href);
		tizen.preference.setValue("goBackToThisFromClock", window.location.href);
		settingsData_CRUD.update(settingsData);
        window.location.href = "../clock/index.html";

	}

	function bibleChangeVersionShortcut(){
		if (bibleVersionList.length>1){
			 bible.changeBibleVersion();
			 var version = settingsData["bibleversion"];
			 bookData = {version: {}};
			 bible.setVersionButtonText();
			 refreshReadingPlanPageAfterVersionChange();

			
		}else{
			refreshReadingPlanPageAfterVersionChange();
		}
	}
    document.querySelector('.clockIcon').addEventListener("click", openClock);

    document.querySelector('.maximizeButton').addEventListener("click", setFullScreen);
 
    switchVersionButton = document.querySelector(".switchVersionButton");
    switchVersionButton.addEventListener("click", bible.switchVersionHandler);
    
    settingsData = JSON.parse(tizen.preference.getValue("settingsData"));
    bible.setVersionButtonText();
    bible.getListOfBibleVersions();

    var normalScreenVerseText = document.querySelector(".normalScreenVerseText");
    var fullScreenVerseText = document.querySelector(".fullScreenVerseText");
    
    ui.setFontSize("biblePlanVerse_ReadingPlanPage", settingsData["fontSize"]);	
    ui.setFontSize("biblePlanVerse_ReadingPlanPage2", settingsData["fontSize"]);	
    
    normalScreenVerseText.addEventListener("click", bibleChangeVersionShortcut );    
    fullScreenVerseText.addEventListener("click", bibleChangeVersionShortcut);

    isFullScreen = settingsData["fullScreen"];
    console.log("isFullScreen: " + isFullScreen);
    if (isFullScreen){
    	listener_readingplan();
    	setFullScreen();
    }else{
        listener_readingplan();

    }
    ui.initBackgound();


    function callbackSwipeEvent(direction){
    	if (direction==="left"){
    		document.getElementById("nextPlanVerse").click();
    	}else{
    		document.getElementById("prevPlanVerse").click();
    	}
    }
    swipeEvent(normalScreenVerseText, callbackSwipeEvent);
    swipeEvent(fullScreenVerseText, callbackSwipeEvent);
    arrows = document.querySelectorAll(".arrow");	
    ui.showArrows(arrows);	
	tizen.preference.setValue("fromOptionsPage", false);
    document.getElementById("chooseAReadingPlan").innerHTML = LANG_JSON_DATA["TRANSLATIONS"]["READINGPLAN_PAGE"]["chooseReadingPlan"];
};




window.onunload = function(){
	if (document.getElementById("minScreen").style.display === "block") {
	    settingsData["fullScreen"] = false;
	}
	settingsData_CRUD.update(settingsData);
	tts.cancel();
}