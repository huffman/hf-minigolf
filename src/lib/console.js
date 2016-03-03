var global = Function('return this')();
global.console = {
    log: function() {
        global.console._message('[DEBUG]', arguments);
    },
    warn: function() {
        global.console._message('[WARNING]', arguments);
    },
    error: function() {
        global.console._message('[ERROR]', arguments);
    },
    _message: function(prefix, args) {
        args = Array.prototype.slice.call(args);
        args.unshift(prefix);
        print.apply(null, args);
    }
};
