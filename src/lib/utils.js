// Taken from MDN
if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs   = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP    = function() {},
            fBound  = function() {
                return fToBind.apply(this instanceof fNOP
                                     ? this
                                     : oThis,
                                     aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        if (this.prototype) {
            // native functions don't have a prototype
            fNOP.prototype = this.prototype; 
        }
        fBound.prototype = new fNOP();

        return fBound;
    };
};

EventEmitter = function() {
    this.eventListeners = {};
};
EventEmitter.prototype = {
    on: function(event, fn) {
        // console.log("on: ", event, fn);
        if (event in this.eventListeners) {
            this.eventListeners[event].push(fn);
        } else {
            this.eventListeners[event] = [fn];
        }
        // console.log("on: ", event, this.eventListeners[event][0]);
    },
    emitWithArgs: function(event, args) {
        // console.log('emit', this.entityID, event, this);
        var listeners = this.eventListeners[event];
        if (listeners) {
            // if (event != 'update') {
            //     console.log('emit', event, this.entityID, JSON.stringify(args));
            //     console.log('emit listeners', listeners[0]);
            // }
            for (var i in listeners) {
                try {
                    if (!Array.isArray(args)) {
                        args = [args];
                    }
                    listeners[i].apply(null, args);
                } catch (e) {
                    console.error("Error calling callback", e);
                    (function () { console.error(new Error().stack); })();
                }
            }
        } else {
            if (event != 'update') {
                console.log("No listeners found for", event);
            }
        }
    },
    emit: function(event) {
        this.emitWithArgs(event, Array.prototype.slice.call(arguments, 1));
    }
};

print('require:: pre in utils');
exports.EventEmitter = EventEmitter;
print('require:: in utils');

exports.parseJSON = function(jsonString) {
    var data;
    try {
        data = JSON.parse(jsonString);
    } catch(e) {
        data = {};
    }
    return data;
}
parseJSON = exports.parseJSON;

exports.arg = function(args, key, defaultValue) {
    if (args.hasOwnProperty(key)) {
        return args[key];
    }
    return defaultValue;
}
arg = exports.arg;

exports.extend = function(a, b) {
    for (var key in b) {
        a[key] = b[key];
    }
};
extend = exports.extend;

exports.shallowCopy = function(a) {
    var obj = {};
    for (var k in a) {
        obj[k] = a[k];
    }
    return obj;
}

exports.deepCopy = function(a) {
    var obj = {};
    for (var k in a) {
        var t = typeof(a[k]);
        if (t === 'object') {
            obj[k] = deepCopy(a[k]);
        } else {
            obj[k] = a[k];
        }
    }
    return obj;
}
deepCopy = exports.deepCopy;
