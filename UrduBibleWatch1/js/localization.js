/**
 * 
 */

var localization = (function(){

	
	this.getDeviceLocaleLanguage = function(callback){
		tizen.systeminfo.getPropertyValue('LOCALE', callback);
		
	};
	

	
	this.getLocalizedBook = function(book, callback){
		var bookLocale;
		var localizedBooks = Object.keys(bibleBookTitlesInDifferentLanguages);
		var changeBookTitleToLocale = function(locale){

			var languageCode = locale.language.toLowerCase().replace("_", "-");
			try{
				var bookKey = book.replace(/ /g, "-");
				var bookLocale = bibleBookTitlesInDifferentLanguages[bookKey];
			}catch(e){
				console.log(e.message);
				bookLocale = book;
			}

			callback(bookLocale);
		}
		this.getDeviceLocaleLanguage(changeBookTitleToLocale);
	};

	this.getLocalizedBook2 = function(book, callback){


		
		var callbackloadBibleBooksInDifferentLanguages = function(){
			var bookLocale;

			var _bibleBookTitlesInDifferentLanguages = booksOfTheBibleInDifferentLanguagesJS;
			var languageCode = LANG_JSON_DATA["VERSIONLANGUAGE"][settingsData["bibleversion"]];
			console.log("languageCode: " + languageCode);
			
			try{
				var bookKey = book.replace(/ /g, "-");
				console.log("bookKey: " + bookKey);

				var bookLocale = _bibleBookTitlesInDifferentLanguages[bookKey][languageCode];
				console.log("bookLocale: " + bookLocale);
			
			}catch(e){
				console.log(e.message);
				bookLocale = book;
			}

			callback(bookLocale);
			booksOfTheBibleInDifferentLanguagesJS = null;

		};
		this.loadBibleBooksInDifferentLanguages(callbackloadBibleBooksInDifferentLanguages);
	};
	this.getLocalizedBibleBooks = function(callback){
		
		var bibleBookTitlesInDifferentLanguages = null;
		
		var getLocalizedListOfBookTitles = function(locale){
			
			var languageCode = locale.language.toLowerCase().replace("_", "-");
			var books = Object.keys(bibleBookTitlesInDifferentLanguages);
			var results = {};
			var bookLocale;
			for (var x=0; x<books.length; x++){
				var bookKey = books[x];
				try{
					bookLocale = bibleBookTitlesInDifferentLanguages[bookKey][languageCode][0];
					results[bookKey] = bookLocale;			
	
					
				}catch(e){
		
					bookLocale = bookKey.replace(/-/g, " ");
					results[bookKey] = bookLocale;
				}

			}
			callback(results);


		};

		var getLocalLanguage = function(){
			bibleBookTitlesInDifferentLanguages = booksOfTheBibleInDifferentLanguagesJS;

			tizen.systeminfo.getPropertyValue('LOCALE', getLocalizedListOfBookTitles);
		};		
		//var  loadBibleBooksInDifferentLanguages = function (){
		//	bibleBookTitlesInDifferentLanguages = booksOfTheBibleInDifferentLanguagesJS;
		//	getLocalLanguage();
		//};
		//filesystem.getJsonData("wgt-package", "booksOfTheBibleInDifferentLanguages.json",  loadBibleBooksInDifferentLanguages);		
		//var FILE_URL = "../../booksOfTheBibleInDifferentLanguages.js";
		//filesystem.loadJS(FILE_URL, "booksOfTheBibleInDifferentLanguages", false, loadBibleBooksInDifferentLanguages );
		this.loadBibleBooksInDifferentLanguages(getLocalLanguage);
	};
	this.getLocalizedBibleBooks2 = function(callback){
		
		var bibleBookTitlesInDifferentLanguages = null;
		
		var getLocalizedListOfBookTitles = function(locale){
			
			var languageCode = LANG_JSON_DATA["VERSIONLANGUAGE"][settingsData["bibleversion"]];
			var books = Object.keys(bibleBookTitlesInDifferentLanguages);
			var results = {};
			var bookLocale;
			for (var x=0; x<books.length; x++){
				var bookKey = books[x];
				try{
					bookLocale = bibleBookTitlesInDifferentLanguages[bookKey][languageCode][0];
					results[bookKey] = bookLocale;			
	
					
				}catch(e){
		
					bookLocale = bookKey.replace(/-/g, " ");
					results[bookKey] = bookLocale;
				}

			}
			callback(results);


		};

		var getLocalLanguage = function(){
			bibleBookTitlesInDifferentLanguages = booksOfTheBibleInDifferentLanguagesJS;

			tizen.systeminfo.getPropertyValue('LOCALE', getLocalizedListOfBookTitles);
		};		
		//var  loadBibleBooksInDifferentLanguages = function (){
		//	bibleBookTitlesInDifferentLanguages = booksOfTheBibleInDifferentLanguagesJS;
		//	getLocalLanguage();
		//};
		//filesystem.getJsonData("wgt-package", "booksOfTheBibleInDifferentLanguages.json",  loadBibleBooksInDifferentLanguages);		
		//var FILE_URL = "../../booksOfTheBibleInDifferentLanguages.js";
		//filesystem.loadJS(FILE_URL, "booksOfTheBibleInDifferentLanguages", false, loadBibleBooksInDifferentLanguages );
		this.loadBibleBooksInDifferentLanguages(getLocalLanguage);
	};

	this.loadBibleBooksInDifferentLanguages = function(callback){
		var FILE_URL = "../../booksOfTheBibleInDifferentLanguages.js";
		filesystem.loadJS(FILE_URL, "booksOfTheBibleInDifferentLanguages", false, callback );
   		
	};
	return this;
}());
