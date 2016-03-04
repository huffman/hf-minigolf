Script.include('lib/common.js');

// Speed minigolf
// Every hit over par adds time

// Use blueprints to create levels
//  Levels should be the child of a single "level" object

// const BASE_URL = "http://localhost:8000/assets/";
const BASE_URL = 'http://hifi-public.s3.amazonaws.com/huffman/golf/assets/';
const blueprints = require('lib/blueprints.js');

const GRAVITY = { x: 0, y: -5, z: 0 };

const CLAP_SHORT_URL = BASE_URL + 'audio/clapShort.wav';
const CLAP_LONG_URL = BASE_URL + 'audio/clapLong.wav';
const BALL_IN_HOLE_URL = BASE_URL + 'audio/ballInHole.wav';
var clapShortSound = SoundCache.getSound(CLAP_SHORT_URL);
var clapLongSound = SoundCache.getSound(CLAP_LONG_URL);
var ballInHoleSound = SoundCache.getSound(BALL_IN_HOLE_URL);

blueprints.registerBlueprint('minigolf.putter', {
    type: 'Model',
    modelURL: 'http://hifi-public.s3.amazonaws.com/huffman/golf/assets/putter/putter.fbx',
    shapeType: 'compound',
    script: BASE_URL + 'putterEntityScript.js',
    // script: 'http://localhost:8000/putterEntityScript.js',
    compoundShapeURL: 'http://hifi-public.s3.amazonaws.com/huffman/golf/assets/putter/putterHull.obj',
    dimensions: {
        x: 0.0321,
        y: 0.9067,
        z: 0.2041
    },
    gravity: GRAVITY,
    dynamic: true,
    // userData: {
    //     grabbableKey: {
    //         invertSolidWhileHeld: true
    //     },
    //     wearable:{joints:{RightHand:[{x:0.07079616189002991,
    //                                   y:0.20177987217903137,
    //                                   z:0.06374628841876984},
    //                                  Quat.fromPitchYawRollDegrees(180, 0, 0)
    //                                 ],
    //                       LeftHand:[{x:0.1802254319190979,
    //                                  y:0.13442856073379517,
    //                                  z:0.08504903316497803},
    //                                 Quat.fromPitchYawRollDegrees(180, 0, 0)]
    //                      }}
    // }
});

blueprints.registerBlueprint('minigolf.baseCourse', {
    name: "Base course",
    children: [
        {
            name: 'platform',
            type: 'Box',
            localPosition: {
                x: 0,
                y: -0.25,
                z: 0
            },
            dimensions: {
                x: 2.75,
                y: 0.5,
                z: 2.75
            },
            color: {
                red: 192,
                green: 255,
                blue: 128
            }
        },
        {
            name: 'center',
            visible: false,
            type: 'Box',
            localPosition: {
                x: 0,
                y: 0,
                z: 0
            },
            dimensions: {
                x: 0.25,
                y: 0.1,
                z: 0.25
            },
            color: {
                red: 128,
                green: 255,
                blue: 128
            }
        }
    ]
});

blueprints.registerBlueprint('minigolf.timer', {
    name: "Timer",
    type: "Text",
    text: "TEST",
    lineHeight: 0.42,
    dimensions: {
        x: 1.5,
        y: 0.6,
        z: 0.01
    },
    rotation: Quat.fromPitchYawRollDegrees(0, 180, 0),
    color: {
        red: 255,
        green: 255,
        blue: 192
    }
});


blueprints.registerBlueprint('minigolf.ball', {
    name: "golfball",
    type: "Sphere",
    dimensions: {
        x: 0.05,
        y: 0.05,
        z: 0.05
    },
    color: {
        red: 255,
        green: 255,
        blue: 192
    },
    dynamic: true,
    // damping: 0,
    gravity: {
        x: 0,
        y: -5,
        z: 0
    },
    velocity: {
        x: 0,
        y: -0.1,
        z: 0
    }
});

blueprints.registerBlueprint('minigolf.startScreen', {
    name: "Start Screen",
    children: [
        // {
        //     name: 'level',
        //     type: 'Box',
        //     dimensions: {
        //         x: 10,
        //         y: 0.5,
        //         z: 10
        //     },
        //     color: {
        //         red: 255,
        //         green: 192,
        //         blue: 128
        //     }
        // }
    ]
});

var holeChildren = [{
    type: 'Sphere',
    dimensions: {
        x: 0.2,
        y: 0.2,
        z: 0.2
    },
    color: {
        red: 255,
        green: 192,
        blue: 255
    }
}];
holeChildren = [];

const HOLE_SCALE = 0.6
blueprints.registerBlueprint('minigolf.level_1', {
    name: "Level 1",
    rotation: Quat.fromPitchYawRollDegrees(0, 90, 0),
    children: [
        {
            name: "tee",
            collisionless: true,
            localPosition: {
                x: -0.8914,
                y: 0,
                z: -0.4316

            }
        },
        {
            name: "hole",
            collisionless: true,
            localPosition: {
                x: -0.8942,
                y: 0.0851,
                z: 0.3038
            },
            children: holeChildren,
        },
        {
            name: 'level',
            type: 'Model',
            localPosition: {
                x: -.8843,
                y: 0.27 / 2 * HOLE_SCALE,
                z: 0
            },
            dimensions: Vec3.multiply(HOLE_SCALE, {
                x: 1.48,
                y: 0.27,
                z: 2.48
            }),
            modelURL: BASE_URL + "hole1.fbx",
            compoundShapeURL: BASE_URL + "hole1Hull.obj"
        },
        // {
        //     name: 'level',
        //     type: 'Box',
        //     position: {
        //         x: 0,
        //         y: -0.5,
        //         z: 0
        //     },
        //     dimensions: {
        //         x: 10,
        //         y: 0.5,
        //         z: 10
        //     },
        //     color: {
        //         red: 128,
        //         green: 192,
        //         blue: 255
        //     }
        // }
    ]
});

blueprints.registerBlueprint('minigolf.level_2', {
    name: "Level 2",
    rotation: Quat.fromPitchYawRollDegrees(0, -90, 0),
    children: [
        // {
        //     name: 'level',
        //     type: 'Box',
        //     dimensions: {
        //         x: 10,
        //         y: 0.5,
        //         z: 10
        //     },
        //     color: {
        //         red: 128,
        //         green: 255,
        //         blue: 192
        //     }
        // },
        {
            name: 'level',
            type: 'Model',
            dimensions: Vec3.multiply(HOLE_SCALE, {
                x: 4.4802,
                y: 0.5882,
                z: 4.4802
            }),
            localPosition: {
                x: 0,
                y: 0.5882 / 2 * HOLE_SCALE,
                z: 0
            },
            modelURL: BASE_URL + "hole2.fbx",
            compoundShapeURL: BASE_URL + "hole2Hull.obj"
        },
        {
            name: "tee",
            localPosition: {
                x: 0.9009,
                y: 0.1270,
                z: 0.9764
            },
        },
        {
            name: "hole",
            localPosition: {
                x: -0.9122,
                y: 0.1270,
                z: -0.8921
            },
            children: holeChildren
        },
    ]
});
blueprints.registerBlueprint('minigolf.level_3', {
    name: "Level 3",
    rotation: Quat.fromPitchYawRollDegrees(0, 0, 0),
    children: [
        {
            name: 'level',
            type: 'Model',
            dimensions: Vec3.multiply(HOLE_SCALE, {
                x: 4.4802,
                y: 0.5882,
                z: 4.4802
            }),
            localPosition: {
                x: 0,
                y: 0.5882 / 2 * HOLE_SCALE,
                z: 0
            },
            modelURL: BASE_URL + "hole3.fbx",
            compoundShapeURL: BASE_URL + "hole2Hull.obj"
        },
        {
            name: "tee",
            localPosition: {
                x: -0.7839,
                y: 0.1270,
                z: -0.9344
            },
        },
        {
            name: "hole",
            localPosition: {
                x: 0.7716,
                y: 0.1270,
                z: 0.8992
            },
            children: holeChildren
        },
    ]
});


// When you get the ball in the hole, the level drops below the ground, and the next one comes up.
// If it is the last level, a scoreboard comes up and gives you an option to play another round.


function MiniGolfCourse(courseID, position) {
    this.position = position;
    this.round = null;
    this.roundStartTimer = null;

    this.courseID = courseID;
    this.courseEntityID = blueprints.spawnBlueprint('minigolf.baseCourse', {
        position: position
    });
    this.putterEntityID = blueprints.spawnBlueprint('minigolf.putter', {
        position: Vec3.sum(position, { x: 0, y: 1, z: 1 }),
        userData: {
            courseID: this.courseID
        }
    });

    this.reset();

    this.timeID = null;

    Messages.subscribe(this.courseID);
    Messages.messageReceived.connect(this.onMessage.bind(this));

    Script.update.connect(this.onUpdate.bind(this));
}

MiniGolfCourse.prototype = {
    onUpdate: function(dt) {
        if (this.round) {
            this.roundTime += dt;
            // Update text object
            Entities.editEntity(this.timeID, {
                text: this.roundTime.toFixed(2)
            });
        }
    },
    onMessage: function(channel, message) {
        if (channel == this.courseID) {
            var msg = JSON.parse(message);

            if (msg.action == 'start') {
                console.log("Got message start");
                this.startRound();
            } else if (msg.action == 'win') {
                if (this.round) {
                    this.round.ballIn();
                }
            }
        }
    },
    roundStarted: function() {
        this.timeID = blueprints.spawnBlueprint('minigolf.timer', {
            text: "00:00",
            position: {
                x: 0,
                y: 2,
                z: 3
            }
        });
        this.roundInProgress = true;
        this.roundTime = 0;
    },
    roundCompleted: function() {
        this.roundInProgress = false;
        this.timeToComplete = this.roundTime;
        this.round = null;

        setTimeout(function() {
            Entities.deleteEntity(this.timeID);
            this.reset();
        }.bind(this), 2000);
    },
    reset: function() {
        this.startAreaID = blueprints.spawnBlueprint('minigolf.startScreen', {
            position: {
                x: this.position.x,
                y: this.position.y - 2,
                z: this.position.z
            }
        });
        ease(easeOutQuad, this.startAreaID, 2, 800, function() {
        }.bind(this));
    },
    startRound: function() {
        if (this.startAreaID) {
            var entityID = this.startAreaID;
            ease(easeOutQuad, entityID, -2, 800, function() {
                deleteEntity(entityID);
            }.bind(this));
            this.startAreaID = null;
        }
        if (!this.round) {
            print("pos", this.position.y);
            this.round = new MiniGolfRound(this.position, this.roundStarted.bind(this), this.roundCompleted.bind(this));

            console.log('round', this.round);

            this.roundStartTimer = setTimeout(function() {
                this.round.start();
                /*
                setTimeout(function() {
                    this.round.startLevel(1);
                }.bind(this), 2500);
                */
            }.bind(this), 0);
        }
    },
    stopRound: function() {
        if (this.round) {
            if (this.roundStartTimer) {
                clearTimeout(this.roundStartTimer);
            }
            this.round = null;
        }
    },
    destroy: function() {
        if (this.round) {
            this.round.destroy();
        }
        deleteEntity(this.courseEntityID);
        deleteEntity(this.putterEntityID);
        deleteEntity(this.timeID);
        Messages.unsubscribe(this.courseID);
    }
};

// Deletes and entity and all of its direct descendants (non recursive, depth of 1)
function deleteEntity(entityID) {
    var childrenIDs = findEntities({ parentID: entityID });
    for (var i = 0; i < childrenIDs.length; ++i) {
        Entities.deleteEntity(childrenIDs[i]);
    }
    Entities.deleteEntity(entityID);
}

function ease(easeFn, entityID, dY, duration, onComplete) {
    var position0 = Entities.getEntityProperties(entityID, 'position').position;
    var dt = 0;
    var id = setInterval(function() {
        dt += 1000.0 / 60;

        dt = Math.min(dt, duration);

        Entities.editEntity(entityID, {
            position: {
                x: position0.x,
                y: easeFn(dt, position0.y, dY, duration),
                z: position0.z
            }
        });

        if (dt >= duration) {
            clearInterval(id);
            onComplete();
            //Entities.deleteEntity(entityID);
        }
    }, 1000.0 / 60);
}

function MiniGolfRound(position, onStarted, onComplete) {
    console.log("Creating golf round", position.y);
    this.levels = ['minigolf.level_1', 'minigolf.level_2', 'minigolf.level_3'];
    this.position = position;
    this.currentLevel = -1;
    this.onStarted = onStarted;
    this.onComplete = onComplete;
    this.timeStarted = 0;
    this.timeEnded = 0;
}

MiniGolfRound.prototype = {
    start: function() {
        if (this.currentLevel < 0) {
            this.onStarted();
            this.startLevel(0);
        }
    },
    startLevel: function(level) {
        this.unloadCurrentLevel();

        this.currentLevel = level;

        if (this.currentLevel >= this.levels.length) {
            Audio.playSound(clapLongSound, {
                position: this.position,
                volume: 1.0,
                loop: false
            });
            this.timeEnded = Date.now();
            this.onComplete();
            return;
        }

        console.log("POS is: ", this.position.y);
        this.currentLevelEntityID = blueprints.spawnBlueprint(this.levels[level], {
            position: {
                x: this.position.x,
                y: this.position.y - 2,
                z: this.position.z
            }
        });
        ease(easeOutQuad, this.currentLevelEntityID, 2, 800, function() {
            var teeEntityID = findEntity({
                parentID: this.currentLevelEntityID,
                name: 'tee'
            });
            if (!teeEntityID) {
                console.error("Can't find tee entity");
                return;
            }
            this.teePosition = Entities.getEntityProperties(teeEntityID, 'position').position;

            setTimeout(function() {
                this.ballID = blueprints.spawnBlueprint('minigolf.ball', {
                    // parentID: this.currentLevelEntityID,
                    position: Vec3.sum(this.teePosition, { x: 0, y: 1, z: 0 })
                });
                this.checkForBallInHole();
            }.bind(this), 1000);

            var holeEntityID = findEntity({
                parentID: this.currentLevelEntityID,
                name: 'hole'
            });
            this.holePosition = Entities.getEntityProperties(holeEntityID, 'position').position;
        }.bind(this));
    },
    checkForBallInHole: function() {
        var ballPosition = Entities.getEntityProperties(this.ballID, 'position').position;
        var distance = Vec3.distance(ballPosition, this.holePosition);
        if (distance < 0.1) {
            console.log("BALL IN HOLE");
            this.ballIn();
        } else {
            if (distance > 10) {
                Entities.editEntity(this.ballID, {
                    velocity: { x: 0, y: -0.1, z: 0 },
                    position: Vec3.sum(this.teePosition, { x: 0, y: 1, z: 0 })
                });
            }
            setTimeout(this.checkForBallInHole.bind(this), 50);
        }
    },
    ballIn: function() {
        Audio.playSound(ballInHoleSound, {
            position: this.holePosition,
            volume: 1.0,
            loop: false
        });
        setTimeout(function() {
            Entities.deleteEntity(this.ballID);
            Audio.playSound(clapShortSound, {
                position: this.position,
                volume: 1.0,
                loop: false
            });
            this.startLevel(this.currentLevel + 1);
        }.bind(this), 1000);
    },
    unloadCurrentLevel: function() {
        if (this.currentLevelEntityID) {
            var entityID = this.currentLevelEntityID;
            ease(easeOutQuad, this.currentLevelEntityID, -2, 800, function() {
                deleteEntity(entityID);
                // Entities.deleteEntity(entityID);
            }.bind(this));

            this.currentLevel = -1;
        }
    },
    destroy: function() {
        if (this.currentLevelEntityID) {
            deleteEntity(this.currentLevelEntityID);
        }
    }
};

function easeOutQuad(t, b, c, d) {
    t /= d;
	  return -c * t*(t-2) + b;
}

var golfCourse = new MiniGolfCourse('course-0', { x: 0, y: 0, z: 0 });


Script.scriptEnding.connect(function() {
    console.log("Destroying golf course");
    golfCourse.destroy();
});

// setTimeout(function() {
//     Messages.sendMessage(golfCourse.courseID, JSON.stringify({
//         action: 'start'
//     }));
// }, 1000);
