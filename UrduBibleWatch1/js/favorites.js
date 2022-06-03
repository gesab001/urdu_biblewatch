
var favorites = (function(){

	this.add = function(label, preferenceKey, key, value, callback){
	    var favoritesList = {};
	    if(tizen.preference.exists(preferenceKey)){
	    	favoritesList = JSON.parse(tizen.preference.getValue(preferenceKey));
	    }
	    var textToSave = label;
	    var proceedToSave = confirm("Save\n"+textToSave + "\nto favorites?");
	    if(proceedToSave){
	    	console.log("key: " + key);
	    	console.log("value: " + value);
	    	if (key in favoritesList){
	        	alert(textToSave+"\nalready exists\nin your favorites.");
	    		
	    	}else{
	    		favoritesList[key] = value;
	    		tizen.preference.setValue(preferenceKey, JSON.stringify(favoritesList));
	    		alert(textToSave+"\nhas been saved.");
	    	}
	    }
	    callback();
	};
    
	this.get = function(preferenceKey){
	    var favoritesList = {};
	    if(tizen.preference.exists(preferenceKey)){
	    	favoritesList = JSON.parse(tizen.preference.getValue(preferenceKey));
	    }
	    return favoritesList;
	};
	
	this.remove = function(preferenceKey, itemToRemove, callback){
		var favoritesList = this.get(preferenceKey);
		delete favoritesList[itemToRemove];
		tizen.preference.setValue(preferenceKey, JSON.stringify(favoritesList));
		callback();
	}
	return this;
}());