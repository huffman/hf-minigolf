// Speed minigolf
// Every hit over par adds time

// Use blueprints to create levels
//  Levels should be the child of a single "level" object

registerBlueprint('minigolf.level_1', {
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
        }
    ]
});
registerBlueprint('minigolf.level_1', {
    name: "Level 2",
    children: {
    }
});

// When you get the ball in the hole, the level drops below the ground, and the next one comes up.
// If it is the last level, a scoreboard comes up and gives you an option to play another round.


function MiniGolfCourse() {
    this.round = null;
}

function MiniGolfRound() {
    this.currentLevel = 0;
}

MiniGolfRound.prototype = {
};
