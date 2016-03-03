Script.include('lib/common.js');

// Speed minigolf
// Every hit over par adds time

// Use blueprints to create levels
//  Levels should be the child of a single "level" object

const blueprints = require('lib/blueprints.js');

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
            name: "teeLocation"
        },
        {
            name: "tee"
        },
        {
            name: "hole"
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
        }
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

    Messages.subscribe(this.courseID);
    Messages.messageReceived.connect(this.onMessage.bind(this));
}

MiniGolfCourse.prototype = {
    onMessage: function(channel, message) {
        if (channel == this.courseID) {
            var msg = JSON.parse(message);

            if (msg.action == 'start') {
                this.startRound();
            } else if (msg.action == 'win') {
                if (this.round) {
                    this.round.ballIn();
                }
            }
        }
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
        }.bind(this))
    },
    startRound: function() {
        if (this.startAreaID) {
            var entityID = this.startAreaID;
            ease(easeOutQuad, entityID, -2, 800, function() {
                Entities.deleteEntity(entityID);
            }.bind(this))
            this.startAreaID = null;
        }
        if (!this.round) {
            this.round = new MiniGolfRound(this.position, this.reset.bind(this));

            console.log('round', this.round)

            this.roundStartTimer = setTimeout(function() {
                this.round.start();
                setTimeout(function() {
                    this.round.startLevel(1);
                }.bind(this), 2500);
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

function deleteEntity(entityID) {
}

function MiniGolfRound(position, onComplete) {
    console.log("Creating golf round");
    this.levels = ['minigolf.level_1', 'minigolf.level_2'];
    this.position = position;
    this.currentLevel = -1;
    this.complete = onComplete;
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

MiniGolfRound.prototype = {
    start: function() {
        if (this.currentLevel < 0) {
            this.startLevel(0);
        }
    },
    startLevel: function(level) {
        this.unloadCurrentLevel();

        this.currentLevel = level;

        if (this.currentLevel >= this.levels.length) {
            this.complete();
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
        }.bind(this))
    },
    ballIn: function() {
        startLevel(this.currentLevel + 1);
    },
    unloadCurrentLevel: function() {
        if (this.currentLevelEntityID) {
            //var position0 = Entities.getEntityProperties(this.currentLevelEntityID, 'position').position;
            var entityID = this.currentLevelEntityID;
            ease(easeOutQuad, this.currentLevelEntityID, -2, 800, function() {
                Entities.deleteEntity(entityID);
            }.bind(this))

            //var dt = 0;
            //var entityID = this.currentLevelEntityID;

            //var id = setInterval(function() {
            //    dt += 1000.0 / 60;

            //    Entities.editEntity(entityID, {
            //        position: {
            //            x: position0.x,
            //            y: easeOutQuad(dt, position0.y, position0.y - 2, 1400),
            //            z: position0.z
            //        }
            //    });

            //    if (dt > 1400) {
            //        clearInterval(id);
            //        Entities.deleteEntity(entityID);
            //    }
            //}, 1000.0 / 60);
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

//setTimeout(golfCourse.startRound.bind(golfCourse), 1000);
