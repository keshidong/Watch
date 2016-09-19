!function () {
    var util = {
        isObject: function (obj) {
            return obj !== null && typeof obj === 'object';
        }
    }

    var Watch = function (obj) {
        var fnObject = {};
        this._fnObject = fnObject;
        // xx
        var defineReactive = function (obj, key, val, exp) {
            Object.defineProperty(obj, key, {
                get: function () {
                    console.log('get')
                    return val;
                },
                set: function (value) {
                    if (val === value) {
                        return;
                    }
                    var fnArr = fnObject[exp];
                    if (Array.isArray(fnArr)) {

                        for (;fnArr.length > 0;) {
                            var fnFirst = fnArr.shift();
                            fnFirst();
                        }
                    }
                    val = value;

                }
            });
        };

        // 对对象obj循环defineProperty.
        var fnWatch = function (obj, str) {
            if (!util.isObject(obj)) return;

            for (key in obj) {
                var tempValue = obj[key];
                var str = str ? str + '.' + key : key;
                if (typeof tempValue === 'function') continue;
                defineReactive(obj, key, tempValue, str);
                fnWatch(tempValue, str);
            }
        }
        fnWatch(obj);
    };

    Watch.prototype.on = function (key, callback) {
        var keyArr = key.split('.');
        var len = keyArr.length;
        if (len <= 0) return;

        if (!this._fnObject[key]) {
            this._fnObject[key] = [];
        }
        this._fnObject[key].push(callback);
    };

    if (typeof define === 'function') {
        define(function() {
            return Watch;
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = Watch;
    } else {
        this.Watch = Watch;
    }
}();