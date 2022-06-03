/*
 *      Copyright (c) 2016 Samsung Electronics Co., Ltd
 *
 *      Licensed under the Flora License, Version 1.1 (the "License");
 *      you may not use this file except in compliance with the License.
 *      You may obtain a copy of the License at
 *
 *              http://floralicense.org/license/
 *
 *      Unless required by applicable law or agreed to in writing, software
 *      distributed under the License is distributed on an "AS IS" BASIS,
 *      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *      See the License for the specific language governing permissions and
 *      limitations under the License.
 */

/*jshint unused: vars*/

var clock = (function() {
	   var timerUpdateDate = 0,
	    bibleIcon;
	    /**
	     * Rotates elements with a specific class name
	     * @private
	     * @param {number} angle - angle of rotation
	     * @param {string} className - class name of the elements to be rotated
	     */
	    function rotateElements(angle, className) {
	        var elements = document.querySelectorAll("." + className),
	            i;

	        for (i = 0; i < elements.length; i++) {
	            elements[i].style.transform = "rotate(" + angle + "deg)";
	        }
	    }

	    /**
	     * Updates the date and sets refresh callback on the next day
	     * @param {number} prevDate - date of the previous day
	     */
	    function updateDate(prevDate) {
	        var datetime = tizen.time.getCurrentDateTime(),
	            date = datetime.getDate(),
	            nextInterval;

	        // Check the update condition
	        // If prevDate is '0', it will always update the date
	        if (prevDate === date) {
	            /*
	             * If the date was not changed (meaning that something went wrong),
	             * call updateDate again after a second
	             */
	            nextInterval = 1000;
	        } else {
	            /*
	             * If the date was changed,
	             * call updateDate at the beginning of the next day
	             */
	            // Calculate how much time is left until the next day
	            nextInterval = (23 - datetime.getHours()) * 60 * 60 * 1000 +
	                (59 - datetime.getMinutes()) * 60 * 1000 +
	                (59 - datetime.getSeconds()) * 1000 +
	                (1000 - datetime.getMilliseconds()) + 1;
	        }

	        // Update the text for date
	        if (date < 10) {
	            document.querySelector("#date-text").innerHTML = "0" + date;
	        } else {
	            document.querySelector("#date-text").innerHTML = date;
	        }

	        // If an updateDate timer already exists, clear the previous timer
	        if (timerUpdateDate) {
	            clearTimeout(timerUpdateDate);
	        }

	        // Set next timeout for date update
	        timerUpdateDate = setTimeout(function() {
	            updateDate(date);
	        }, nextInterval);
	    }

	    /**
	     * Updates the hour/minute/second hands according to the current time
	     * @private
	     */
	    function updateTime() {
	        var datetime = tizen.time.getCurrentDateTime(),
	            hour = datetime.getHours(),
	            minute = datetime.getMinutes(),
	            second = datetime.getSeconds();

	        // Update the hour/minute/second hands
	        rotateElements((hour + (minute / 60) + (second / 3600)) * 30, "hands-hr");
	        rotateElements((minute + second / 60) * 6, "hands-min");
	        rotateElements(second * 6, "hands-sec");
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
			var clockbg = document.getElementById("clock2"),
			datebg = document.getElementById("date-bg"),
			datetext = document.getElementById("date-text"),
			handshrneedle = document.getElementById("hands-hr-needle"),
			handshrshadow = document.getElementById("hands-hr-shadow"),
			handssecneedle = document.getElementById("hands-sec-needle"),
			handssecshadow = document.getElementById("hands-sec-shadow");	 

			clockbg.addEventListener("swipeleft", onSwipeLeft );
			clockbg.addEventListener("swiperight", onSwipeRight );
			
			datebg.addEventListener("swipeleft", onSwipeLeft );
			datebg.addEventListener("swiperight", onSwipeRight );
			
			datetext.addEventListener("swipeleft", onSwipeLeft );
			datetext.addEventListener("swiperight", onSwipeRight );
			
			handshrneedle.addEventListener("swipeleft", onSwipeLeft );
			handshrneedle.addEventListener("swiperight", onSwipeRight );
			
			handshrshadow.addEventListener("swipeleft", onSwipeLeft );
			handshrshadow.addEventListener("swiperight", onSwipeRight );
			
			handssecneedle.addEventListener("swipeleft", onSwipeLeft );
			handssecneedle.addEventListener("swiperight", onSwipeRight );

			handssecshadow.addEventListener("swipeleft", onSwipeLeft );
			handssecshadow.addEventListener("swiperight", onSwipeRight );

			console.log("initializeSwiperEvents success");
			
		}
	    /**
	     * Initiates the application
	     * @private
	     */
	    this.init = function() {
	        // Update the date when the app is initiated
	        updateDate(0);
	    	setActivePage("ClockPage");


	        // Update the watch hands every second
	        setInterval(function() {
	            updateTime();
	        }, 1000);

	        // Add eventListener to update the screen immediately when the device wakes up
	        document.addEventListener("visibilitychange", function() {
	            if (!document.hidden) {
	                updateTime();
	                updateDate(0);
	            }
	        });

	        // Add eventListener to update the screen when the time zone is changed
	        tizen.time.setTimezoneChangeListener(function() {
	            updateTime();
	            updateDate(0);
	        });

		    initializeSwiperEvents();
		    console.log("currentClockIndex: "+currentClockIndex);
	    	var bibleIcon = document.querySelectorAll(".bibleIconTouchArea")[currentClockIndex];
		    bibleIcon.addEventListener("click", function(){
		    	var event = {"keyName": "back" };
		    	onHardwareKeysTap(event);
		    });
	    };


    return this;


}());