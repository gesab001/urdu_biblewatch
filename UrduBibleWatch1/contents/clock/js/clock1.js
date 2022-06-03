/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var clock = (function(){
	var page,
	timeIsOn = false,
	strDay,
	bibleIcon,
	timerUpdateDate = 0,
	flagConsole = false,
	flagDigital = false,
	battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery,
	interval,
	BACKGROUND_URL = "url('../../images/bg.jpg')",
	arrDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	arrMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


	/**
	 * Updates the date and sets refresh callback on the next day.
	 * @private
	 * @param {number} prevDay - date of the previous day
	 */
	function updateDate(prevDay) {
	    var datetime = tizen.time.getCurrentDateTime(),
	        nextInterval,
	        strDay = document.getElementById("str-day"),
	        strFullDate,
	        getDay = datetime.getDay(),
	        getDate = datetime.getDate(),
	        getMonth = datetime.getMonth();

	    var getLocalizedDate = function(){
	  	  var  onLocaleSuccessCallback = function(locale) {
			    ////console.log('The locale language is ' + JSON.stringify(locale.language));
				var localeLanguage = locale.language.replace("_", "-");
				//console.log("localeLanguage: " + localeLanguage);
		        d = new tizen.TZDate();
		        //strFullDate = arrDay[getDay] + " " + getDate + " " + arrMonth[getMonth];
		        strFullDate = d.toLocaleDateString();

		        strDay.innerHTML = strFullDate;

			};


			var getLocalLanguageSetting = function(){
				tizen.systeminfo.getPropertyValue('LOCALE', onLocaleSuccessCallback);
				  //tizen.systeminfo.getPropertyValueArray("LOCALE", successArrayCB);
			};	 
			getLocalLanguageSetting();
	    };
	    // Check the update condition.
	    // if prevDate is '0', it will always update the date.
	    if (prevDay !== null) {
	        if (prevDay === getDay) {
	            /**
	             * If the date was not changed (meaning that something went wrong),
	             * call updateDate again after a second.
	             */
	            nextInterval = 1000;
	        } else {
	            /**
	             * If the day was changed,
	             * call updateDate at the beginning of the next day.
	             */
	            // Calculate how much time is left until the next day.
	            nextInterval =
	                (23 - datetime.getHours()) * 60 * 60 * 1000 +
	                (59 - datetime.getMinutes()) * 60 * 1000 +
	                (59 - datetime.getSeconds()) * 1000 +
	                (1000 - datetime.getMilliseconds()) +
	                1;
	        }
	    }

	    if (getDate < 10) {
	        getDate = "0" + getDate;
	    }
	    getLocalizedDate();

	    // If an updateDate timer already exists, clear the previous timer.
	    if (timerUpdateDate) {
	        clearTimeout(timerUpdateDate);
	    }

	    // Set next timeout for date update.
	    timerUpdateDate = setTimeout(function() {
	        updateDate(getDay);
	    }, nextInterval);
	}

	/**
	 * Updates the current time.
	 * @private
	 */
	function updateTime() {
	    var strHours = document.getElementById("str-hours"),
	        strConsole = document.getElementById("str-console"),
	        strMinutes = document.getElementById("str-minutes"),
	        strAmpm = document.getElementById("str-ampm"),
	        datetime = tizen.time.getCurrentDateTime(),
	        hour = datetime.getHours(),
	        minute = datetime.getMinutes();


	    var someDate = new tizen.TZDate(1999, 11, 31, 23, 59, 59, 999, 'Europe/London');
	    console.log(someDate.toLocaleTimeString());
	    var getLocalizedTime = function(){
		  	  var  onLocaleSuccessCallback = function(locale) {
				    ////console.log('The locale language is ' + JSON.stringify(locale.language));
					var localeLanguage = locale.language.replace("_", "-");
					//console.log("localeLanguage: " + localeLanguage);
			        d = new tizen.TZDate();
			        //strFullDate = arrDay[getDay] + " " + getDate + " " + arrMonth[getMonth];
			        strFullTime = d.toLocaleTimeString();

			        strHours.innerHTML = strFullTime;

				};


				var getLocalLanguageSetting = function(){
					tizen.systeminfo.getPropertyValue('LOCALE', onLocaleSuccessCallback);
					  //tizen.systeminfo.getPropertyValueArray("LOCALE", successArrayCB);
				};	 
				getLocalLanguageSetting();
		};
		getLocalizedTime();    
	    document.getElementById("rec-string-time").style.display = "block";
	}

	function loadBackgroundImage(){
		if (tizen.preference.exists("backgroundImage")){
			var backgroundImageURI = tizen.preference.getValue("backgroundImage");
			console.log("backgroundImageURI: " + backgroundImageURI);
			var backgroundImageDiv = document.getElementById("backgroundImage");
			document.getElementById("backgroundImage").style.backgroundImage = backgroundImageURI;
		}else{
	        document.getElementById("backgroundImage").style.backgroundImage = BACKGROUND_URL;
		}
	}

	/**
	 * Sets to background image as BACKGROUND_URL,
	 * and starts timer for normal digital watch mode.
	 * @private
	 */

	function initDigitalWatch() {
	    flagDigital = true;
	    //loadBackgroundImage();
	    interval = setInterval(updateTime, 500);
	}

	function visibilitychange(){
	    if (!document.hidden) {
	        updateWatch();
	    }	
	}

	function TimezoneChangeListener(){
		
	}
	/**
	 * Clears timer and sets background image as none for ambient digital watch mode.
	 * @private
	 */
	function ambientDigitalWatch() {
	    flagDigital = false;
	    clearInterval(interval);
	    document.getElementById("digital-body").style.backgroundImage = "none";
	    updateTime();
	}
	function ambientmodechanged(){
	    if (e.detail.ambientMode === true) {
	        // rendering ambient mode case
	        ambientDigitalWatch();

	    } else {
	        // rendering normal digital mode case
	        initDigitalWatch();
	    }
	}
	/**
	 * Gets battery state.
	 * Updates battery level.
	 * @private
	 */
	function getBatteryState() {
	    var batteryLevel = Math.floor(battery.level * 10),
	        batteryFill = document.getElementById("battery-fill");

	    batteryLevel = batteryLevel + 1;
	    batteryFill.style.width = batteryLevel + "%";
	}

	/**
	 * Updates watch screen. (time and date)
	 * @private
	 */
	function updateWatch() {
	    updateTime();
	    updateDate(0);
	}


	/**
	 * Binds events.
	 * @private
	 */

	function onSwipe(direction){
		console.log(direction);
	}

	function onSwipeLeft(){
		console.log("onSwipeLeft");
		//showAnotherClock("left");
		currentClockIndex = parseInt(tizen.preference.getValue("clockIndex"));
		console.log("currentClockIndex:" + currentClockIndex); 
		if (currentClockIndex<clocks.length){
			currentClockIndex = currentClockIndex + 1;
			tizen.preference.setValue("clockIndex", currentClockIndex );
			window.location.reload();
		}

	}

	function onSwipeRight(){
		console.log("onSwipeRight");
		currentClockIndex = parseInt(tizen.preference.getValue("clockIndex"));
		console.log("currentClockIndex:" + currentClockIndex); 
		if (currentClockIndex>0){
			currentClockIndex = currentClockIndex - 1;
			tizen.preference.setValue("clockIndex", currentClockIndex );
			window.location.reload();
		}
	}
	function initializeSwiperEvents(){
		swipe2.initSwipe2();
		page = document.getElementById("ClockPage");
		var strHours = document.getElementById("str-hours"),
	    strConsole = document.getElementById("str-console"),
	    strMinutes = document.getElementById("str-minutes"),
	    strAmpm = document.getElementById("str-ampm"),
	    strDay = document.getElementById("str-day"),
		digitalBody = document.getElementById("digital-body");	 

		strHours.addEventListener("swipeleft", onSwipeLeft );
		strHours.addEventListener("swiperight", onSwipeRight );
		
		page.addEventListener("swipeleft", onSwipeLeft );
		page.addEventListener("swiperight", onSwipeRight );
		
		strConsole.addEventListener("swipeleft", onSwipeLeft );
		strConsole.addEventListener("swiperight", onSwipeRight );
		
		strMinutes.addEventListener("swipeleft", onSwipeLeft );
		strMinutes.addEventListener("swiperight", onSwipeRight );
		
		strAmpm.addEventListener("swipeleft", onSwipeLeft );
		strAmpm.addEventListener("swiperight", onSwipeRight );

		strDay.addEventListener("swipeleft", onSwipeLeft );
		strDay.addEventListener("swiperight", onSwipeRight );
		
		digitalBody.addEventListener("swipeleft", onSwipeLeft );
		digitalBody.addEventListener("swiperight", onSwipeRight );
		
		console.log("initializeSwiperEvents success");
		
	}
	function bindEvents() {
		page = document.getElementById("ClockPage");
	    //page.addEventListener("click", showAnotherClock);
		//swipeClock(page, showAnotherClock);
		initializeSwiperEvents();
		setActivePage("ClockPage");


	    console.log("currentClockIndex: "+currentClockIndex);
    	var bibleIcon = document.querySelectorAll(".bibleIconTouchArea")[currentClockIndex];
	    bibleIcon.addEventListener("click", function(){
	    	var event = {"keyName": "back" };
	    	onHardwareKeysTap(event);
	    });
	    // add eventListener for battery state
		
	   // battery.addEventListener("chargingchange", getBatteryState);
	   // battery.addEventListener("chargingtimechange", getBatteryState);
	   // battery.addEventListener("dischargingtimechange", getBatteryState);
	   // battery.addEventListener("levelchange", getBatteryState);

	    // add eventListener for timetick
	    window.addEventListener("timetick", ambientDigitalWatch);

	    // add eventListener for ambientmodechanged
	    window.addEventListener("ambientmodechanged", ambientmodechanged);

	    // add eventListener to update the screen immediately when the device wakes up.
	    document.addEventListener("visibilitychange", visibilitychange);

	    // add event listeners to update watch screen when the time zone is changed.
	    tizen.time.setTimezoneChangeListener(updateWatch);
	    ui.initBackgound();
	}

	function destroy(){
		clearInterval(interval);
	};

	function start(){
		updateWatch();
	    interval = setInterval(updateTime, 500);
	};

	function unBindEvents(){
	    //page.removeEventListener("click", "showClock2");
		page = null;
		destroy();

	    
	    // add eventListener for timetick
	    window.removeEventListener("timetick", ambientDigitalWatch);

	    // add eventListener for ambientmodechanged
	    window.removeEventListener("ambientmodechanged", ambientmodechanged);

	    // add eventListener to update the screen immediately when the device wakes up.
	    document.removeEventListener("visibilitychange", visibilitychange);

	    // add event listeners to update watch screen when the time zone is changed.
	    tizen.time.unsetTimezoneChangeListener(updateWatch);

	}

	/**
	 * Initializes date and time.
	 * Sets to digital mode.
	 * @private
	 */
	this.init = function() {
	    initDigitalWatch();
	    updateDate(0);
	    bindEvents();
	};
    return this;
})();

