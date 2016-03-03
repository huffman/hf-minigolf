Script.include('lib/common.js');

// Speed minigolf
// Every hit over par adds time

// Use blueprints to create levels
//  Levels should be the child of a single "level" object

const blueprints = require('lib/blueprints.js');

blueprints.registerBlueprint('minigolf.timer', {
    name: "Timer",
    type: "Text",
    text: "TEST",
    color: {
        red: 255,
        green: 255,
        blue: 192
    }
});


blueprints.registerBlueprint('minigolf.ball', {
    name: "Golf ball",
    type: "Sphere",
    color: {
        red: 255,
        green: 255,
        blue: 192
    },
    isDynamic: true,
    damping: 0,
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
        {
            name: "club",
            type: "Box",
            localPosition: {
                x: 2,
                y: 2,
                z: 2
            },
            dimensions: {
                x: 0.1,
                y: 1.0,
                z: 0.1
            }
        },
        {
            name: 'level',
            type: 'Box',
            dimensions: {
                x: 10,
                y: 0.5,
                z: 10
            },
            color: {
                red: 255,
                green: 192,
                blue: 128
            }
        }
    ]
});

blueprints.registerBlueprint('minigolf.level_1', {
    name: "Level 1",
    children: [
        {
            name: "tee"
        },
        {
            name: "hole",
            localPosition: {
                x: 2,
                y: 1,
                z: 2
            },
            children: [
                {
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
                }
            ]
        },
        {
            name: 'level',
            type: 'Box',
            dimensions: {
                x: 10,
                y: 0.5,
                z: 10
            },
            color: {
                red: 128,
                green: 192,
                blue: 255
            }
        }
    ]
});
blueprints.registerBlueprint('minigolf.level_2', {
    name: "Level 2",
    children: [
        {
            name: 'level',
            type: 'Box',
            dimensions: {
                x: 10,
                y: 0.5,
                z: 10
            },
            color: {
                red: 128,
                green: 255,
                blue: 192
            }
        },
        {
            name: "tee",
            localPosition: {
                x: 2,
                y: 1,
                z: 2
            },
        },
        {
            name: "hole",
            localPosition: {
                x: -2,
                y: 1,
                z: 2
            },
            children: [
                {
                    type: 'Sphere',
                    dimensions: {
                        x: 0.2,
                        y: 0.2,
                        z: 0.2
                    },
                    color: {
                        red: 192,
                        green: 192,
                        blue: 255
                    }
                }
            ]
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
                x: 5,
                y: 3,
                z: 0
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
                Entities.deleteEntity(entityID);
            }.bind(this));
            this.startAreaID = null;
        }
        if (!this.round) {
            this.round = new MiniGolfRound(this.position, this.roundStarted.bind(this), this.roundComplete.bind(this));

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
        Messages.unsubscribe(this.courseID);
    }
};

// Deletes and entity and all of its direct descendants (non recursive, depth of 1)
function deleteEntity(entityID) {
    var childrenIDs = findEntities({ parentID: entityID });
    for (var i = 0; i < childrenIDs.length; ++i) {
        Entities.deleteEnitty(childrenIDs[i]);
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
    console.log("Creating golf round");
    this.levels = ['minigolf.level_1', 'minigolf.level_2'];
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
            this.timeEnded = Date.now();
            this.onComplete();
            return;
        }

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
            var teePosition = Entities.getEntityProperties(teeEntityID, 'position').position;
            this.ballID = blueprints.spawnBlueprint('minigolf.ball', {
                parentID: this.currentLevelEntityID,
                position: Vec3.sum(teePosition, { x: 0, y: 1, z: 0 })
            });

            var holeEntityID = findEntity({
                parentID: this.currentLevelEntityID,
                name: 'hole'
            });
            this.holePosition = Entities.getEntityProperties(holeEntityID, 'position').position;
            this.checkForBallInHole();
        }.bind(this))
    },
    checkForBallInHole: function() {
        var ballPosition = Entities.getEntityProperties(this.ballID, 'position').position;
        if (Vec3.distance(ballPosition, this.holePosition) < 0.3) {
            console.log("BALL IN HOLE");
            this.ballIn();
        } else {
            setTimeout(this.checkForBallInHole.bind(this), 1000);
        }
    },
    ballIn: function() {
        setTimeout(function() {
            this.startLevel(this.currentLevel + 1);
        }.bind(this), 1000);
    },
    unloadCurrentLevel: function() {
        if (this.currentLevelEntityID) {
            var entityID = this.currentLevelEntityID;
            ease(easeOutQuad, this.currentLevelEntityID, -2, 800, function() {
                Entities.deleteEntity(entityID);
            }.bind(this));

            this.currentLevel = -1;
        }
    },
    destroy: function() {
        if (this.currentLevelEntityID) {
            Entities.deleteEntity(this.currentLevelEntityID);
        }
    }
};

function easeOutQuad(t, b, c, d) {
    t /= d;
	  return -c * t*(t-2) + b;
}

var golfCourse = new MiniGolfCourse({ x: 0, y: 0, z: 0 }, 'course-0');


Script.scriptEnding.connect(function() {
    console.log("Destroying golf course");
    golfCourse.destroy();
});

setTimeout(function() {
    Messages.sendMessage(golfCourse.courseID, JSON.stringify({
        action: 'start'
    }));
}, 1000);
