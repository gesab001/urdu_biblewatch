

var stringMaker = (function(){
	
	this.getPathToZipFile = function(version) {
	    return "wgt-private/zipbibles/" + version + ".zip";
	};

	this.getPathToBible = function(version) {
	    return "wgt-private/" + version;
	};

	this.getFileToExtract = function(version, book) {
	    var filename = book.replace(/\s/g, "_") + ".json";

	    return version + "/" + filename;
	};

	this.getBookJsonFilename = function(book) {
	    return book.replace(/\s/g, "_") + ".json";
	};
	
	this.getBookJsFilename = function(book) {
	    return book.replace(/\s/g, "_") + ".js";
	};	
	return this;
}());