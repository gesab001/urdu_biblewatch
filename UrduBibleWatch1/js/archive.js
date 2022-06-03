archive = (function(){
    var fileToExtract;

	
    this.checkIfSongOfSolomonJsonExistsInZipFile = function(pathToZipFile, fileToExtract, callback){
		var extractSuccessCallback = function () {
		    callback();
		        
		};

		var extractErrorCallback = function (error) {
		    console.log('extract error: ' + error.message);
		    if (error.message=="File already exists."){
		    	extractSuccessCallback();
		    }
		    if (error.message=="file already exists."){
		    	extractSuccessCallback();
		    }
		};
		
		var getEntrySuccess = function (entry) {
		    callback(true);
		};

		var getEntryError = function (error) {
			console.log(error);
			callback(false)
		};
		
		var openSuccess = function (archive) {
		    myArchive = archive;
		    archive.getEntryByName(fileToExtract, getEntrySuccess, getEntryError);

		};

		var openError = function (error) {
		     console.log("error: " + error);
		};
		//tizen.archive.open(pathToZipFile, 'r', openSuccess, openError);   
		
    };
	
	this.getFileFromZip = function(pathToZipFile, fileToExtract, callback){
	    console.log("pathToZipFile: " + pathToZipFile );
	    console.log("fileToExtract: " + fileToExtract );

		
		var extractSuccessCallback = function () {
		    callback();
		        
		};

		var extractErrorCallback = function (error) {
		    console.log('extract error: ' + error.message);
		    if (error.message=="File already exists."){
		    	extractSuccessCallback();
		    }
		    if (error.message=="file already exists."){
		    	extractSuccessCallback();
		    }
		};
		
		var getEntrySuccess = function (entry) {
		    entry.extract('wgt-private', extractSuccessCallback, extractErrorCallback);
		};

		var getEntryError = function (error) {
			console.log(error);
		};
		
		var openSuccess = function (archive) {
		    myArchive = archive;
		    archive.getEntryByName(fileToExtract, getEntrySuccess, getEntryError);

		};

		var openError = function (error) {
		     console.log("error: " + error);
		};
		//tizen.archive.open(pathToZipFile, 'r', openSuccess, openError);
	};

	this.extractAllFiles = function(pathToZipFile, callback){
		function progressCallback(opId, val, name) {
		    console.log('extracting operation (: ' + opId + ') is in progress (' + (val * 100).toFixed(1) + '%)');
		}

		function onSuccess(){
			callback();
		}
		function onError(e){
			console.log("extracting error: " + e);
			callback();
		}
		function openSuccess(archive) {
		    archive.extractAll('wgt-private', onSuccess, onError, null, true);
		}
		var openError = function (error) {
		     console.log("error: " + error);
		};		
		//tizen.archive.open(pathToZipFile, 'r', openSuccess, openError);

	}
	return this;
}());