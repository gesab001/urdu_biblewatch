var systeminfo = (function(){
	
	var getPlatformVersion = function(){
		
	    var platformVersion;
	    try {
	        platformVersion = tizen.systeminfo.getCapabilities().platformVersion.split(".");
	    } catch (e) {
	        console.log(e);

	    }
	    var majorVersion = parseInt(platformVersion[0]);
	    var minorVersion = parseInt(platformVersion[1]);
	    return majorVersion;
	}
	
	return this;
}());