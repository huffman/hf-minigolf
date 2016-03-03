var global = Function('return this')();
if (global.require === undefined) {
    var moduleCache = {};
    global.module = null, global.exports = null;
    global.require = function(url, noCache) {
        url = Script.resolvePath(url);

        if (!noCache && moduleCache.hasOwnProperty(url)) {
            var exports = moduleCache[url].exports;
            print("REQUIRE: Returning cached module: ", Object.keys(exports));
            return exports;
        }
        print("REQUIRE: Loading module: ", url);

        global.module = {};
        global.exports = {};

        Script.include(url);

        global.module.exports = global.exports;
        moduleCache[url] = global.module;

        return global.exports;
    };
}
