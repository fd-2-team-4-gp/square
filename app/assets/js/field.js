app.currentModule = (function($) {

    var config = {
        url: 'https://api.backendless.com/v1/data/Users',
        id: 'DCE54221-04BE-2940-FF08-14B2BC0FFC00',
        key: 'E8FCB4B6-2D60-EA57-FF4B-2880988EE300',
        v: 'v1'
    }

    return {
        init: function(obj, callback) {
            console.log("Инициализируем модуль поля");
            obj = obj || new Object(null);
            callback = callback || function() {
                return false;
            }

            var square = $(obj).find('#square');
            var mess = $(obj).find('#info');

            function Player(name, colour, avatar) {
                var _self = this;

                this.avatar = avatar;
                this.name = name;
                this.colour = colour;
                this.count = 0;
                this.goal = 0;

                this.punch = function() {

                    if (this.ball) {
                        var playerId = Math.ceil(Math.random() * this.players.length) - 1;
                        this.ball = false;

                        if (Math.random() * 2 > 1) {
                            field.players[playerId].addGoal();
                            this.addCount();
                            field.started = false;
                        }
                        else {
                            field.players[playerId].getBall();
                        }
                    }
                }
                this.ball = false;

                this.getBall = function() {
                    this.ball = true
                };

                this.addCount = function() {
                    this.count++
                };

                this.addGoal = function() {
                    this.goal++
                };

                this.render = function(index) {
                    var ball = '';

                    if (this.ball) {
                        ball = '<div class="ball"></div>';
                    }

                    var result = [
                        '<div class="player ',
                        this.colour,
                        '" data-index="',
                        index,
                        '"><img src="',
                        this.avatar,
                        '"><br>',
                        this.name,
                        ball,
                        '</div>'
                    ];

                    return result.join('');
                };

                this.click = function(e, obj) {
                    console.log(e, obj);
                    obj = obj || this.field;
                    console.log(this.field);

                    obj.players.forEach(function(p) {
                        p.ball = false;
                    });

                    _self.getBall();
                    obj.render();
                    mess.innerHTML = 'мяч у меня!' + _self.name;
                };
            };

            function Field(players, obj) {
                this.players = players;
                this.domObj = obj;
                this.started = false;

                this.render2 = function() {
                    var _self = this;
                    var result = this.players.map(
                        function(p, index) {
                            return p.render(index);
                        }
                    ).join('');

                    this.domObj.innerHTML = result;

                    var domPlayers = document.getElementsByClassName('player');

                    for (var i = 0; i < domPlayers.length; i++) {
                        domPlayers[i].addEventListener('click', function(_i, _f) {
                            return function() {
                                _f.players[_i].click(_i, _f);
                            };
                        }(i, _self));
                    }
                };

                this.render = function() {
                    var _self = this;

                    var result = this.players.map(
                        function(p, index) {
                            return p.render(index);
                        }
                    ).join('');

                    console.log(this.domObj);

                    this.domObj.html(result);

                    //mess.prepend('<div>--domObj = "' + this.domObj + '</div>');

                    var domPlayers = document.getElementsByClassName('player');

                    for (var i = 0; i < domPlayers.length; i++) {
                        domPlayers[i].addEventListener('click', {
                            handleEvent: this.players[i].click,
                            field: _self
                        });
                    }
                };

                this.start = function() {
                    if (!this.started) {
                        var p_Id = Math.ceil(Math.random() * this.players.length) - 1;
                        this.started = true;
                        this.players[p_Id].getBall();
                        mess.prepend('<div>--начнём с id = "' + p_Id + '</div>');
                    }
                    else {
                        mess.prepend('<div>--Игра уже идет!!!!!!!!!!!!!!!!</div>');
                    }
                    console.log("начнём с id = " + p_Id);
                    this.render();
                }
            }

            var p1 = new Player('Cap', 'green', 'assets/images/cap.png');
            var p2 = new Player('IronMan', 'red', 'assets/images/ironman.png');
            var p3 = new Player('SpiderMan', 'yellow', 'assets/images/spiderman.png');
            var p4 = new Player('Puh', 'blue', 'assets/images/puh.png');
            var field = new Field([p1, p2, p3, p4], square);

            var startGame = $(obj).find('#startGame');

            console.log(startGame);

            startGame.on('click', function() {
                field.start();
            });

            callback();
        }
    }
})(jQuery);