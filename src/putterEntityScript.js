print("IN ES");
(function () {
    const BASE_URL = 'http://hifi-public.s3.amazonaws.com/huffman/golf/assets/';
    const PUTT_URL = BASE_URL + 'audio/putt.wav';
    var puttSound = SoundCache.getSound(PUTT_URL);
    function Putter() {
    }
    print("IN CTOR");
    Putter.prototype = {
        preload: function(entityID) {
            this.entityID = entityID;
            Script.addEventHandler(this.entityID, "collisionWithEntity", function(entityA, entityB, collision) {
                self.collisionCallback(entityA, entityB, collision);
            });
            print("preload");
        },
        startNearGrab: function() {
            print('starting near grab');
            userData = Entities.getEntityProperties(this.entityID, 'userData').userData;
            print(userData);
            var data = JSON.parse(userData);
            var channel = data.courseID;
            Messages.sendMessage(channel, JSON.stringify({
                action: 'start'
            }));
        },
        collisionCallback: function(entityA, entityB, collision) {
            var other = entityA == this.entityID ? entityB : entityA;
            var properties = Entities.getEntityProperties(other, ['name', 'position']);
            var name = properties.name;
            if (name == 'golfball') {
                Audio.playSound(ballInHoleSound, {
                    position: properties.position,
                    volume: 1.0,
                    loop: false
                });
            }
        }
    };
    var self = new Putter();
    return self;
});
