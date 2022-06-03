/**
 *
 */

var filesystem = (function() {
	this.getMajorPlatformVersion = function(){
		
	    var platformVersion;
	    try {
	        platformVersion = tizen.systeminfo.getCapabilities().platformVersion.split(".");
	    } catch (e) {
	        console.log(e);

	    }
	    var majorVersion = parseInt(platformVersion[0]);
	    var minorVersion = parseInt(platformVersion[1]);
	    return majorVersion;
	};
    this.loadJS = function(FILE_URL, variableName, async, callback) {
        console.log("FILE_URL: " + FILE_URL);
        var scriptEle = document.createElement("script");

        scriptEle.setAttribute("src", FILE_URL);
        scriptEle.setAttribute("type", "text/javascript");
        scriptEle.setAttribute("async", async);

        document.body.appendChild(scriptEle);

        var onload = function() {
            console.log("script loaded");
            console.log("variableName: " + variableName);
            callback(variableName);

        };
        var onerror = function(ev) {
            callback("error");
            console.log("Error on loading file", ev);
        };
        // success event 
        scriptEle.addEventListener("load", onload);
        // error event
        scriptEle.addEventListener("error", onerror);
    }
    this.loadCSS = function(filename, callback) {
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename);
        document.getElementsByTagName("head")[0].appendChild(fileref);
        callback("success");

    };
    
    this.loadJSApplication = function(FILE_URL, variableName, async, callback) {
        console.log("FILE_URL: " + FILE_URL);
        var scriptEle = document.createElement("script");

        scriptEle.setAttribute("src", FILE_URL);
        scriptEle.setAttribute("type", "application/javascript");
        scriptEle.setAttribute("async", async);

        document.body.appendChild(scriptEle);

        var onload = function() {
            console.log("script loaded");
            console.log("variableName: " + variableName);
            callback(variableName);

        };
        var onerror = function(ev) {
            console.log("Error on loading file", ev);

            callback("error: " + ev);
        };
        // success event 
        scriptEle.addEventListener("load", onload);
        // error event
        scriptEle.addEventListener("error", onerror);
    };
    return this;
}());