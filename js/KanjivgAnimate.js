'use strict';

var KanjivgAnimate = (function () {

    function KanjivgAnimate(trigger, time) {
        time = typeof time !== 'undefined' ? time : 500;

        this.setOnClick(trigger, time);
    }

    /**
     * Add onclick function to triggers.
     *
     * @param {element} trigger
     * @param {int} time 
     */
    KanjivgAnimate.prototype.setOnClick = function setOnClick(trigger, time) {
        var triggers = document.querySelectorAll(trigger);

        var length = triggers.length;

        var kvganimate = this;

        for (var i = 0; i < length; i++) {
            triggers[i].onclick = function() {
                var animate = new KVGAnimator(time);

                animate.play(this);

                return false;
            };
        }
    };

    return KanjivgAnimate;
})();

var KVGAnimator = (function () {

    function KVGAnimator(time) {
        this.time = time;
    }

    /**
     * Initiate the animation.
     * 
     * @param  {element} trigger 
     */
    KVGAnimator.prototype.play = function play(trigger) {
        var svg = this.findTarget(trigger);

        if (!svg || svg.tagName !== 'svg' || svg.querySelectorAll('path') <= 0) {
            return;
        }

        this.paths = svg.querySelectorAll('path');

        this.numbers = svg.querySelectorAll('text');

        this.pathCount = this.paths.length;

        this.hideAll();

        this.count = 0;

        var path = this.paths[this.count];

        var number = this.numbers[this.count];

        this.animatePath(path, number);
    };

    /**
     * Find data target, if available.
     * 
     * @param  {element} trigger
     */
    KVGAnimator.prototype.findTarget = function findTarget(trigger) {
        var attribute = 'data-kanjivg-target';

        if (!trigger.hasAttribute(attribute)) {
            return trigger;
        }

        var target = trigger.getAttribute(attribute); 

        return document.querySelector(target);
    };

    /**
     * Hide paths and numbers before animation.
     */
    KVGAnimator.prototype.hideAll = function hideAll() {
        for (var i = 0; i < this.pathCount; i++) {
            this.paths[i].style.display = 'none';

            if (typeof this.numbers[i] !== 'undefined') {
                this.numbers[i].style.display = 'none';
            }
        }  
    };

    /**
     * Prepare for animation and call animation function.
     * 
     * @param  {element} path
     * @param  {element} number
     */
    KVGAnimator.prototype.animatePath = function animatePath(path, number) {
        this.length = path.getTotalLength();

        path.style.display = 'block';

        if (typeof number !== 'undefined') {
            number.style.display = 'block';
        }

        path.style.transition = path.style.WebkitTransition = 'none';

        path.style.strokeDasharray = this.length + ' ' + this.length;

        path.style.strokeDashoffset = this.length;

        path.getBoundingClientRect();

        this.interval = this.time / this.length;

        this.doAnimation(path);
    };

    /**
     * Do the animation.
     * 
     * @param  {path} path
     */
    KVGAnimator.prototype.doAnimation = function doAnimation(path) {
            var animator = setTimeout(function () {
                this.doAnimation(path);
            }.bind(this, path), this.interval);

            path.style.strokeDashoffset = this.length;

            this.length--;

            if (this.length < 0) {
                clearInterval(animator);

                this.count += 1;

                if (this.count < this.pathCount) {
                    var newPath  = this.paths[this.count];

                    var newNumber = this.numbers[this.count];

                    this.animatePath(newPath, newNumber);
                }
            }
    };

    return KVGAnimator;
})();

//module.exports = KanjivgAnimate;
