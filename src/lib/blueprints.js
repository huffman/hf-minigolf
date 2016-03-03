var SCRIPT_URL = Script.resolvePath('componentsClient.js');

// Create a single entity in a scene, including its children, recursively
// TODO Add blueprint generation here
function _createEntity(sceneName, entityManager, parentID, data) {
    var children = [];
    if (data.hasOwnProperty('blueprint')) {
        print("Found blueprint:", data.blueprint);
        var name = data.blueprint;
        var overrideProperties = data;
        if (!(name in blueprintTypes)) {
            console.warn("Cannot find blueprint: " + name);
            return null;
        }
        var blueprint = blueprintTypes[name];
        var properties = {};
        for (var k in blueprint) {
            properties[k] = blueprint[k];
        }
        for (k in overrideProperties) {
            properties[k] = data[k];
        }
        data = properties;
    }
    if (data.hasOwnProperty('children')) {
        children = data.children;
        delete data.children;
    }
    if (data.hasOwnProperty('components')) {
        //data.userData = parseJSON(data.userData);
        if (typeof data.userData !== 'object') {
            data.userData = {};
        }
        data.userData.scene = sceneName;
        data.userData.components = data.components;
        data.userData = JSON.stringify(data.userData);
        delete data.components;
    } else {
        data.userData = JSON.stringify({ scene: sceneName });
    }
    print(data.userData);
    if (!data.hasOwnProperty('type')) {
        data.type = "Box";
        data.visible = false;
    }

    data.script = SCRIPT_URL;

    if (parentID) {
        data.parentID = parentID;
    }

    print("Creating ", data.name, data.type, data.parentID);
    var entityID = entityManager.addEntity(data);

    for (var i in children) {
        _createEntity(sceneName, entityManager, entityID, children[i]);
    }

    return entityID;
}

createScene = function(scene) {
    for (var i in scene.entities) {
        _createEntity(scene.name, Entities, null, scene.entities[i]);
    }
};

createObject = function(object) {
    return _createEntity('unknown', Entities, null, object);
};

destroyScene = function(name) {
    print("Destroying scene: ", name);

    // Find all entities that are tagged with this scene name
    var entities = Entities.findEntities({ x: 0, y: 0, z: 0 }, 1000000);
    for (var i = 0; i < entities.length; ++i) {
        var entityID = entities[i];
        var properties = Entities.getEntityProperties(entityID, ['userData']);
        var data = parseJSON(properties.userData);
        if (data.hasOwnProperty('scene') && data.scene == name) {
            print("Deleting", entityID);
            Entities.deleteEntity(entityID);
        }
    }
};

var blueprintTypes = {};
registerBlueprint = function(name, data) {
    if (name in blueprintTypes) {
        console.warning("Overwriting type ", name);
    }
    print("Registering blueprint type " + name);
    blueprintTypes[name] = data;
};

registerExtendedBlueprint = function(name, baseName, data) {
    var baseData = blueprintTypes[baseName];
    
    for (var key in baseData) {
        if (!data.hasOwnProperty(key)) {
            data[key] = baseData[key];
        }
    }

    print("registering extended: ", name, baseName, JSON.stringify(data));

    registerBlueprint(name, data);
};

spawnBlueprint = function(name, overrideProperties) {
    if (!(name in blueprintTypes)) {
        console.warn("Cannot find blueprint: " + name);
        return null;
    }
    var blueprint = blueprintTypes[name];
    var properties = {};
    for (var k in blueprint) {
        properties[k] = blueprint[k];
    }
    for (k in overrideProperties) {
        properties[k] = overrideProperties[k];
    }
    return createObject(properties);
};

exports.spawnBlueprint = spawnBlueprint;
