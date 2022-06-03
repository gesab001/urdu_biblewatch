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
    var animRequest = 0,
    	bibleIcon,
        timerUpdateDate = 0,
        modeStopwatch = "Pause",
        timePrevFrame,
        timeElapsed = 0,
        NEEDLE_DATA = {
            "START": {
                "transform": "rotate(0deg)"
            },
            "END": {
                "transform": "rotate(360deg)"
            }
        };

    /**
     * Removes all child of the element.
     * @private
     * @param {Object} elm - The object to be emptied
     * @return {Object} The emptied element
     */
    function emptyElement(elm) {
        while (elm.firstChild) {
            elm.removeChild(elm.firstChild);
        }

        return elm;
    }

    /**
     * Adds leading zero(s) to a number and make a string of fixed length.
     * @private
     * @param {number} number - A number to make a string.
     * @param {number} digit - The length of the result string.
     * @return {string} The result string
     */
    function addLeadingZero(number, digit) {
        var n = number.toString(),
            i,
            strZero = "";

        for (i = 0; i < digit - n.length; i++) {
            strZero += '0';
        }

        return strZero + n;
    }

    /**
     * Sets the text data to the element.
     * @private
     * @param {Object} elm - An element to be changed.
     * @param {string} data - A text string to set.
     */
    function setText(elm, data) {
        emptyElement(elm);
        elm.appendChild(document.createTextNode(data));
    }

    /**
     * Sets the style of element with the calculated style value from dataArray, by origPos, destPos, ratio.
     * Generally used for applying animation effect.
     * @private
     * @param {Object} elm - An object to be applied the calculated style value
     * @param {Object} dataArray- An array of style data
     * @param {string} origPos- Original position of transition
     * @param {string} destPos- Destination position of transition
     * @param {number} ratio - Progress ratio of transition
     */
    function applyStyleTransition(elm, dataArray, origPos, destPos, ratio) {
        var valOrigStyle,
            valDestStyle,
            valAnimStyle;

        if (ratio > 1) {
            ratio = 1;
        }

        // Calculate the style value of the element for the moment.
        Object.keys(dataArray[origPos]).forEach(function(key) {
            switch (key) {
                case "transform":
                    // Remove the "rotate(" string, then parse float value.
                    // After parsing, calculate the result value and recover the prefix "rotate(" and suffix "deg)".
                    valOrigStyle = parseFloat(dataArray[origPos][key].substring(7));
                    valDestStyle = parseFloat(dataArray[destPos][key].substring(7));
                    valAnimStyle = "rotate(" + (valOrigStyle + (valDestStyle - valOrigStyle) * ratio) + "deg)";
                    break;
                default:
                    break;
            }

            elm.style[key] = valAnimStyle;
        });
    }

    /**
     * Sets the style of elements in container by origPos, destPos, ratio.
     * @private
     * @param {Object} elm - An object to be animated
     * @param {Array} dataArray - An array that contains the style data of animation
     * @param {number} origPos- Original position of transition
     * @param {number} destPos- Destination position of transition
     * @param {number} ratio - Progress ratio of transition
     */
    function setAnimationStyle(elm, dataArray, origPos, destPos, ratio) {
        // Progress ratio cannot exceed 1.0
        if (ratio > 1) {
            ratio = 1;
        }

        // Apply style to the element
        applyStyleTransition(elm, dataArray, origPos, destPos, ratio);
    }

    /**
     * Makes a snapshot of main screen animation frame,
     * by setting style to elements by the current time.
     * @private
     * @param {number} timestamp - DOMHighResTimeStamp value passed by requestAnimationFrame.
     */
    function drawMainAnimationFrame(timestamp) {
        var elmInnerSecond = document.querySelector("#hand-dial-inner-second"),
            elmMainHour = document.querySelector("#hand-main-hour"),
            elmMainMinute = document.querySelector("#hand-main-minute"),
            datetime = tizen.time.getCurrentDateTime(),
            hour = datetime.getHours(),
            minute = datetime.getMinutes(),
            second = datetime.getSeconds(),
            milisecond = datetime.getMilliseconds(),
            sum;

        // Second needle takes 60000 milliseconds to run one cycle
        sum = milisecond + (second * 1000);
        setAnimationStyle(elmInnerSecond, NEEDLE_DATA, "START", "END", (sum / 60000));
        // Minute needle takes 60 * 60000 milliseconds to run one cycle
        sum += (minute * 60000);
        setAnimationStyle(elmMainMinute, NEEDLE_DATA, "START", "END", (sum / 3600000));
        // Hour needle takes 12 * 60 * 60000 milliseconds to run one cycle
        sum += (hour * 3600000);
        setAnimationStyle(elmMainHour, NEEDLE_DATA, "START", "END", ((sum % 43200000) / 43200000));

        animRequest = window.requestAnimationFrame(drawMainAnimationFrame);
    }

    /**
     * Makes a snapshot of stopwatch screen animation frame,
     * by setting style to elements by elapsed time calculated by timestamp.
     * @private
     * @param {number} timestamp - DOMHighResTimeStamp value passed by requestAnimationFrame.
     */
    function drawStopwatchAnimationFrame(timestamp) {
        var elmStopwatchSecond = document.querySelector("#hand-swatch-second"),
            elmStopwatchMinute = document.querySelector("#hand-dial-swatch-minute"),
            elmStopwatchHour = document.querySelector("#hand-dial-swatch-hour"),
            elmTextMinute = document.querySelector("#text-swatch-minute"),
            elmTextSecond = document.querySelector("#text-swatch-second"),
            elmTextMsecond = document.querySelector("#text-swatch-msecond"),
            progress;

        // Check timestamp of the last frame of animation.
        if (!timePrevFrame) {
            timePrevFrame = timestamp;
        }
        // Progress is calculated by difference of timestamps between last time and now.
        progress = timestamp - timePrevFrame;
        // TimeElapsed is sum of progress from each calls.
        timeElapsed += progress;

        // Second needle takes 60000 milliseconds to run one cycle
        setAnimationStyle(elmStopwatchSecond, NEEDLE_DATA, "START", "END", ((timeElapsed % 60000) / 60000));
        // Minute needle takes 30 * 60000 milliseconds to run one cycle
        setAnimationStyle(elmStopwatchMinute, NEEDLE_DATA, "START", "END", ((timeElapsed % 1800000) / 1800000));
        // Hour needle takes 12 * 60 * 60000 milliseconds to run one cycle
        setAnimationStyle(elmStopwatchHour, NEEDLE_DATA, "START", "END", ((timeElapsed % 43200000) / 43200000));

        // Set time text to the center area
        setText(elmTextMinute, addLeadingZero(Math.floor(timeElapsed / 60000) % 60, 2));
        setText(elmTextSecond, addLeadingZero(Math.floor(timeElapsed / 1000) % 60, 2));
        setText(elmTextMsecond, addLeadingZero(Math.round(timeElapsed / 10) % 100, 2));

        // Save the timestamp to use a reference of last time in next frame.
        timePrevFrame = timestamp;
        animRequest = window.requestAnimationFrame(drawStopwatchAnimationFrame);
    }

    /**
     * Updates the date and sets refresh callback on the next day
     * @private
     * @param {number} prevDate - Date of the previous day.
     */
    function updateDate(prevDate) {
        var elmCircleDate = document.querySelector("#circle-date"),
            datetime = tizen.time.getCurrentDateTime(),
            nextInterval;

        // Check the update condition.
        // If prevDate is '0', it will always update the date.
        if (prevDate === datetime.getDate()) {
            // If the date was not changed(means something went wrong),
            // Call updateDate again after a second.
            nextInterval = 1000;
        } else {
            // If the date was changed,
            // Call updateDate at the beginning of the next day.
            nextInterval =
                (23 - datetime.getHours()) * 60 * 60 * 1000 +
                (59 - datetime.getMinutes()) * 60 * 1000 +
                (59 - datetime.getSeconds()) * 1000 +
                (1000 - datetime.getMilliseconds()) +
                1;
        }

        // Update the text of date
        setText(elmCircleDate, datetime.getDate());

        // If an updateDate timer already exists, clear the previous timer
        if (timerUpdateDate) {
            clearTimeout(timerUpdateDate);
        }

        // Set next timeout for date update
        timerUpdateDate = setTimeout(function() {
            updateDate(datetime.getDate());
        }, nextInterval);
    }

    /**
     * Resets the stopwatch status.
     * @private
     */
    function resetStopwatch() {
        var elmStopwatchSecond = document.querySelector("#hand-swatch-second"),
            elmStopwatchMinute = document.querySelector("#hand-dial-swatch-minute"),
            elmStopwatchHour = document.querySelector("#hand-dial-swatch-hour"),
            elmTextMinute = document.querySelector("#text-swatch-minute"),
            elmTextSecond = document.querySelector("#text-swatch-second"),
            elmTextMsecond = document.querySelector("#text-swatch-msecond");

        // If the stopwatch is working, stop it first
        if (modeStopwatch === "Start") {
            toggleStopwatch();
        }

        // Reset elapsed time variable
        timeElapsed = 0;

        // Clear all text of labels and angle of needles.
        setText(elmTextMinute, "00");
        setText(elmTextSecond, "00");
        setText(elmTextMsecond, "00");
        applyStyleTransition(elmStopwatchSecond, NEEDLE_DATA, "START", "END", 0);
        applyStyleTransition(elmStopwatchMinute, NEEDLE_DATA, "START", "END", 0);
        applyStyleTransition(elmStopwatchHour, NEEDLE_DATA, "START", "END", 0);
    }

    /**
     * Changes the mode of the application.
     * @param {string} mode - Mode of the application to be changed.
     * @private
     */
    function changeMode(mode) {
        var elmCompMain = document.querySelector("#components-main"),
            elmCompStopwatch = document.querySelector("#components-swatch"),
            elmCompToucharea = document.querySelector("#components-toucharea");

        // Stop the animation before mode changing
        if (animRequest) {
            window.cancelAnimationFrame(animRequest);
        }

        switch (mode) {
            case "Stopwatch":
                // Main -> Stopwatch
                elmCompMain.style.display = "none";
                elmCompStopwatch.style.display = "block";
                elmCompToucharea.style.display = "none";
                break;
            case "Main":
                // Stopwatch -> Main
                resetStopwatch();
                animRequest = window.requestAnimationFrame(drawMainAnimationFrame);
                elmCompMain.style.display = "block";
                elmCompStopwatch.style.display = "none";
                elmCompToucharea.style.display = "block";
                break;
            default:
                break;
        }
    }

    /**
     * Toggle the stopwatch to start or pause.
     * @private
     */
    function toggleStopwatch() {
        var elmStopwatchStart = document.querySelector("#button-swatch-start");

        switch (modeStopwatch) {
            case "Pause":
                // Pause -> Start
                modeStopwatch = "Start";
                elmStopwatchStart.style.backgroundImage = "url('image/chrono_stopwatch_btn_stop.png')";
                animRequest = window.requestAnimationFrame(drawStopwatchAnimationFrame);
                break;
            case "Start":
                // Start -> Pause
                modeStopwatch = "Pause";
                timePrevFrame = 0;
                elmStopwatchStart.style.backgroundImage = "url('image/chrono_stopwatch_btn_resume.png')";
                window.cancelAnimationFrame(animRequest);
                break;
            default:
                break;
        }
    }

    /**
     * Sets default event listeners.
     * @private
     */
    function setDefaultEvents() {
        var elmTopSquare = document.querySelector("#toucharea-swatch-top"),
            elmBotSquare = document.querySelector("#toucharea-swatch-bot"),
            elmStopwatchStart = document.querySelector("#button-swatch-start"),
            elmStopwatchExit = document.querySelector("#button-swatch-exit");

        // Set initial date and refresh timer
        updateDate(0);

        // Add an event listener to update the screen immediately when the device wakes up
        document.addEventListener("visibilitychange", function() {
            if (!document.hidden) {
                updateDate(0);
            }
        });
        // Add an event listener to update the screen immediately when the device wakes up
        tizen.time.setTimezoneChangeListener(function() {
            updateDate(0);
        });

        // Add event listeners to buttons and touch areas
        elmTopSquare.addEventListener("click", function() {
            changeMode("Stopwatch");
        });
        elmBotSquare.addEventListener("click", function() {
            changeMode("Stopwatch");
        });
        elmStopwatchExit.addEventListener("click", function() {
            changeMode("Main");
        });
        elmStopwatchStart.addEventListener("click", function() {
            toggleStopwatch();
        });
    }

	function onSwipeLeft(){
		console.log("onSwipeLeft");
		//showAnotherClock("left");
		currentClockIndex = parseInt(tizen.preference.getValue("clockIndex"));
		console.log("currentClockIndex:" + currentClockIndex); 
		if (currentClockIndex<clocks.length-1){
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
    	var touchareaanotherClock = document.getElementById("toucharea-anotherClock"),
    	dial = document.getElementById("dial"),
    	componentsconst = document.getElementById("components-const"),
    	dialswatchminute = document.getElementById("dial-swatch-minute"),
    	handdialswatchminute = document.getElementById("hand-dial-swatch-minute"),
    	dialswatchhour = document.getElementById("dial-swatch-hour"),
    	handdialswatchhour = document.getElementById("hand-dial-swatch-hour"),
    	handswatchsecond = document.getElementById("hand-swatch-second"),
    	componentsmain = document.getElementById("components-main"),
    	circledate = document.getElementById("circle-date"),
    	dialinnersecond = document.getElementById("dial-inner-second"),
    	handdialinnersecond = document.getElementById("hand-dial-inner-second"),
    	handswatchsecond = document.getElementById("hand-swatch-second"),
    	handmainhour = document.getElementById("hand-main-hour"),
    	handmainminute = document.getElementById("hand-main-minute"),
    	background = document.getElementById("background");
   
    	touchareaanotherClock.addEventListener("swipeleft", onSwipeLeft );
    	touchareaanotherClock.addEventListener("swiperight", onSwipeRight );

    	dial.addEventListener("swipeleft", onSwipeLeft );
    	dial.addEventListener("swiperight", onSwipeRight );
  
    	componentsconst.addEventListener("swipeleft", onSwipeLeft );
    	componentsconst.addEventListener("swiperight", onSwipeRight );
   
    	dialswatchminute.addEventListener("swipeleft", onSwipeLeft );
    	dialswatchminute.addEventListener("swiperight", onSwipeRight );
  
    	handdialswatchminute.addEventListener("swipeleft", onSwipeLeft );
    	handdialswatchminute.addEventListener("swiperight", onSwipeRight );
   
    	dialswatchhour.addEventListener("swipeleft", onSwipeLeft );
    	dialswatchhour.addEventListener("swiperight", onSwipeRight );
 
    	handdialswatchhour.addEventListener("swipeleft", onSwipeLeft );
    	handdialswatchhour.addEventListener("swiperight", onSwipeRight );
   
    	handswatchsecond.addEventListener("swipeleft", onSwipeLeft );
    	handswatchsecond.addEventListener("swiperight", onSwipeRight );
    	
    	componentsmain.addEventListener("swipeleft", onSwipeLeft );
    	componentsmain.addEventListener("swiperight", onSwipeRight );
    	
    	circledate.addEventListener("swipeleft", onSwipeLeft );
    	circledate.addEventListener("swiperight", onSwipeRight );
    
    	dialinnersecond.addEventListener("swipeleft", onSwipeLeft );
    	dialinnersecond.addEventListener("swiperight", onSwipeRight );
	
    	handdialinnersecond.addEventListener("swipeleft", onSwipeLeft );
       	handdialinnersecond.addEventListener("swiperight", onSwipeRight );
    	
    	handswatchsecond.addEventListener("swipeleft", onSwipeLeft );
       	handswatchsecond.addEventListener("swiperight", onSwipeRight );
    	
    	handmainhour.addEventListener("swipeleft", onSwipeLeft );
       	handmainhour.addEventListener("swiperight", onSwipeRight );
    	
    	handmainminute.addEventListener("swipeleft", onSwipeLeft );
       	handmainminute.addEventListener("swiperight", onSwipeRight );
       	
       	background.addEventListener("swipeleft", onSwipeLeft );
       	background.addEventListener("swiperight", onSwipeRight );
       	
		console.log("initializeSwiperEvents success");
		
	}
    /**
     * Initiates the application.
     * @private
     */
    this.init = function() {
    	setActivePage("ClockPage");
    	//var page = document.getElementById("toucharea-anotherClock");
    	//swipeClock(page, showAnotherClock);
    	//ui.setUpBibleIcons();  
    	bibleIcon = document.querySelectorAll(".bibleIconTouchArea")[currentClockIndex];
	    bibleIcon.addEventListener("click", function(){
	    	var event = {"keyName": "back" };
	    	onHardwareKeysTap(event);
	    });
	    initializeSwiperEvents();
        setDefaultEvents();
        drawMainAnimationFrame();
    };
    return this;

    
}());