var slideshow = {
    _items: [],
    _index: 0,
    _lastIndex: 0,
    _interval: 10000,
    _elapsed: 0,
    _status: "stopped",
    _startTime: 0,
    _threshold: 0,
    _thresholdTime: 0,
    _progress: 0,
    _callback: null,
    _update: null,
    get state(){
        return this._status;
    },
    get progress(){
        return Math.min(1, this._elapsed / this._interval);
    },
    setup(items, callback, options = {}){
        if (!items || (typeof items !== "number" && typeof items !== "object")) {
            console.warn("No items (array) or item count (number) added (first parameter MUST be either an array or a number)! Slider disabled!");
            return;
        }
        if (!callback || typeof callback !== "function") {
            console.warn("No callback defined (second parameter MUST be a function)! Slider disabled!");
            return;
        }

        // Options
        let {
            interval = this._interval,
            threshold = this._threshold
        } = options;

        if (interval < 0) {
            console.warn(`interval can't be a negative number! Default (${this._interval}) is used`)
        } else {
            this._interval = interval;
        }
        this._threshold = threshold * 1000;

        // Required
        this._callback = callback;
        this._items = items;
        if (typeof this._items === "number") {
            this._lastIndex = this._items - 1;
        } else {
            this._lastIndex = this._items.length - 1;
        }
    },
    start(){
        if (!this._lastIndex || !this._callback) {
            return;
        }
        this._status = "running";
        this._startTime = undefined;
        this._progress = 0;
        requestAnimationFrame(this._run.bind(this));
    },
    stop(){
        this._status = "stopped";
        this._flush();
        this._resetUpdate();
    },
    toggle(){
        if (this.state === "stopped") {
            this.start();
        } else {
            this.stop();
        }
    },
    pause(){
        if (this._status != "running") {
            return;
        }
        this._status = "paused";
        this._startTime = undefined;
    },
    resume(){
        if (this._status != "paused") {
            return;
        }
        this.start();
    },
    reset(executeCallback){
        this._index = 0;
        this._elapsed = 0;
        this._startTime = 0;
        this._thresholdTime = 0;
        this._progress = 0;
        this.stop();
        if (executeCallback) {
            this._sendEvent();
        }
    },
    next(){
        if (!this._lastIndex || !this._callback) {
            return;
        }
        this._index = this._next(this._index);
        this._sendEvent();
        this._resetUpdate();
    },
    previous(){
        if (!this._lastIndex || !this._callback) {
            return;
        }
        this._index = this._previous(this._index);
        this._sendEvent();
        this._resetUpdate();
    },
    goto(index){
        if (!this._lastIndex || index > this._lastIndex || index < 0 || !this._callback) {
            return;
        }
        this._index = index;
        this._sendEvent();
        this._resetUpdate();
    },
    update(callback){
        if (this._threshold <= 0) {
            return;
        }
        this._update = callback;
    },
    _next(currentIndex){
        var index = currentIndex;
        index++;
        if (index > this._lastIndex) {
            index = 0;
        }
        return index;
    },
    _previous(currentIndex){
        var index = currentIndex;
        index--;
        if (index < 0) {
            index = this._lastIndex;
        }
        return index;
    },
    _run(){
        if (this._status != "running") {
            return;
        }
        var currentTime = (new Date()).getTime();
        if (this._startTime === undefined) {
            this._startTime = currentTime;
        }
        var deltaTime = currentTime - this._startTime;
        this._elapsed += deltaTime;
        this._startTime = currentTime;
        if (this._threshold > 0) {
            this._thresholdTime += deltaTime;
            if (this._thresholdTime >= this._threshold) {
                this._update(this.progress);
                this._thresholdTime = this._thresholdTime - this._threshold;
            }
        }
        if (this._elapsed > this._interval) {
            this._flush();
            this.next();
        }
        requestAnimationFrame(this._run.bind(this));
    },
    _sendEvent(){
        this._flush();
        if (typeof this._items === "number") {
            this._callback({
                previous: this._previous(this._index),
                current: this._index,
                next: this._next(this._index)
            });
        } else {
            this._callback({
                index: {
                    previous: this._previous(this._index),
                    current: this._index,
                    next: this._next(this._index)
                },
                previous: this._items[this._previous(this._index)],
                current: this._items[this._index],
                next: this._items[this._next(this._index)]
            });
        }
    },
    _flush(){
        this._elapsed = 0;
        this._startTime = undefined;
    },
    _resetUpdate(){
        if (this._threshold > 0) {
            this._update(0);
        }
    }
}
export default slideshow;