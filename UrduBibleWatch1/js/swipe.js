/**
 *
 */

var swipe = function(div, callback, divIndex) {


    var bindEvents = function() {
        tau.event.enableGesture(div, new tau.event.gesture.Swipe({
            orientation: "horizontal"
        }));

        div.addEventListener("swipe", function(e) {
            console.log("swipe direction = " + e.detail.direction);
            callback(e.detail.direction, divIndex);
        });
    }

    bindEvents();

};

var swipeEvent = function(div, callback) {


    var bindEvents = function() {
        tau.event.enableGesture(div, new tau.event.gesture.Swipe({
            orientation: "horizontal"
        }));

        div.addEventListener("swipe", function(e) {
            console.log("swipe direction = " + e.detail.direction);
            callback(e.detail.direction);
        });
    }

    bindEvents();

};

var swipeClock = function(div, callback) {


    var bindEvents = function() {
        tau.event.enableGesture(div, new tau.event.gesture.Swipe({
            orientation: "horizontal"
        }));

        div.addEventListener("swipe", function(e) {
            console.log("swipe direction = " + e.detail.direction);
            callback(e.detail.direction);
        });
    }

    bindEvents();

};

var swipe2 = (function(){
    /**
     * Position x of touch.
     *
     * @memberof views/swipe
     * @private
     * @type {number}
     */
    var touchedX = 0,

        /**
         * Position y of touch.
         *
         * @memberof views/swipe
         * @private
         * @type {number}
         */
        touchedY = 0,

        /**
         * Start position x of touch.
         *
         * @memberof views/swipe
         * @private
         * @type {number}
         */
        startTouchX = 0,

        /**
         * Start position y of touch.
         *
         * @memberof views/swipe
         * @private
         * @type {number}
         */
        startTouchY = 0,

        /**
         * Dimensional factor to find swipe.
         *
         * @memberof views/swipe
         * @private
         * @type {number}
         */
        swipeDetectionThreshold = window.innerHeight * 0.25;

    /**
     * Handles touch start event.
     * Sets start and touch positions.
     *
     * @memberof views/swipe
     * @private
     * @param {TouchEvent} event
     */
    function onTouchStart(event) {
        startTouchX = event.changedTouches[0].clientX;
        startTouchY = event.changedTouches[0].clientY;
        touchedX = event.changedTouches[0].clientX;
        touchedY = event.changedTouches[0].clientY;
    }

    /**
     * Handles touch move event.
     * Sets start and touch positions.
     *
     * @memberof views/swipe
     * @private
     * @param {TouchEvent} event
     */
    function onTouchMove(event) {
        touchedX = event.changedTouches[0].clientX;
        touchedY = event.changedTouches[0].clientY;
    }

    /**
    * Handles touch end event.
    * Finds swipe events and dispatch it on target element.
    *
    * @memberof views/swipe
    * @private
    * @param {TouchEvent} event
    */
    function onTouchEnd(event) {
        var deltaX = startTouchX - touchedX,
            deltaY = startTouchY - touchedY,
            target = event.target,
            customEvent = null,
            eventName = '';

        touchedX = 0;
        touchedY = 0;
        startTouchX = 0;
        startTouchY = 0;

        if ((Math.abs(deltaX) >= swipeDetectionThreshold &&
                Math.abs(deltaY) >= swipeDetectionThreshold) ||
                (Math.abs(deltaX) < swipeDetectionThreshold &&
                    Math.abs(deltaY) < swipeDetectionThreshold)) {
            return false;
        }

        event.stopPropagation();
        if (Math.abs(deltaX) >= swipeDetectionThreshold) {
            if (deltaX < 0) {
                eventName = 'swiperight';
            } else {
                eventName = 'swipeleft';
            }
        } else if (Math.abs(deltaY) >= swipeDetectionThreshold) {
            if (deltaY > 0) {
                eventName = 'swipeup';
            } else {
                eventName = 'swipedown';
            }
        }
        customEvent = new window.CustomEvent(eventName, {
            cancelable: true
        });
        return target.dispatchEvent(customEvent);
    }

    /**
     * Registers module event listeners.
     *
     * @memberof views/swipe
     * @private
     */
    function bindEvents() {
        window.addEventListener('touchstart', onTouchStart, true);
        window.addEventListener('touchmove', onTouchMove, true);
        window.addEventListener('touchend', onTouchEnd, true);
    }

    /**
     * Initializes module.
     *
     * @memberof views/swipe
     * @public
     */
     this.initSwipe2 = function(){
    	console.log("init swipe2 event");
        bindEvents();
    }
     
     return this;
}());