/**
 * 
 */

var internet =(function() {
	var dropboxtoken = "Cy4tp2XzJegAAAAAAAAAAUpAbaH-FJsP3L70PMmMS0geyCnmlxclLGDfv0n7CWni";

	this.checkInternetConnection = function(callback){
		tizen.systeminfo.getPropertyValue('NETWORK', function(networkInfo) {
			console.log("networkInfo.networkType: " + networkInfo.networkType);
		    if (networkInfo.networkType === 'NONE') {
		        console.log('Network connection is not available. Download is not possible.');
		        callback(false);
		    }else{
		        console.log('connect to network');
		    	callback(true);
		    }
		});
	};
    this.getOnlineResource = function(url, callback) {
    	console.log("getOnlineResource");


      		   
     		    var xhttp = new XMLHttpRequest();
     		    
     		    xhttp.onreadystatechange = function() {
     		       console.log(this.status);
     		       console.log("readyState: " + this.readyState);

     		       if (this.readyState == 4 && this.status == 200) {
     		    	       console.log(this.responseText);
     		    	   	   callback(this.responseText);    		
     		        }
     		    	
     		    };
     		    xhttp.open("GET", url);
     		    xhttp.send();  
    };
    
    this.logMessage = function(url) {
    	console.log("postMessage");  
     		    var xhttp = new XMLHttpRequest();
     		    xhttp.open("GET", url);
     		    xhttp.send();  
    };
    this.getDataFromDropbox = function(path, callback){
    	   console.log("getDataFromDropbox");
           console.log("path to dropbox folder: " + path);
       	var dropboxtoken = "Cy4tp2XzJegAAAAAAAAAAUpAbaH-FJsP3L70PMmMS0geyCnmlxclLGDfv0n7CWni";

    	   var xhttp = new XMLHttpRequest();
    	   xhttp.onreadystatechange = function() {
    	     if (this.readyState == 4 && this.status == 200){
    	       //syncwithLocalStorage(JSON.parse(this.responseText));
    	       console.log(this.responseText);
    	       callback(this.responseText);
    	     }else{
    	    	 console.log(this.responseText);
    		 }
    	    };
    	   xhttp.open("POST", "https://content.dropboxapi.com/2/files/download", true);
    	   xhttp.setRequestHeader("Authorization", "Bearer " +dropboxtoken);
    	   xhttp.setRequestHeader("Dropbox-API-Arg", "{\"path\": \"/"+path+"\"}");
    	   xhttp.send();
    	};
    this.logMessageDropbox = function(path, data) {
    	var dropboxtoken = "Cy4tp2XzJegAAAAAAAAAAUpAbaH-FJsP3L70PMmMS0geyCnmlxclLGDfv0n7CWni";

    		   var xhttp = new XMLHttpRequest();
    		   xhttp.onreadystatechange = function() {
     		       console.log(this.status);
     		       console.log("readyState: " + this.readyState);

     		       if (this.readyState == 4 && this.status == 200) {
     		    	       console.log(this.responseText);
     		    	   	    		
     		        }else{
  		    	       console.log(this.responseText);

     		        }
     		    	
     		    };
    		   xhttp.open("POST", "https://content.dropboxapi.com/2/files/upload", true);
    		   xhttp.setRequestHeader("Authorization", "Bearer " + dropboxtoken); 
    		   xhttp.setRequestHeader("Dropbox-API-Arg", "{\"path\": \"/"+path+"\",\"mode\": \"overwrite\",\"autorename\": true,\"mute\": false,\"strict_conflict\": false}");
    		   xhttp.setRequestHeader("Content-Type", "application/octet-stream");
    		   xhttp.send(data);
    		   console.log("this.logMessageDropbox");
    		
    };
	
    return this;
}());

