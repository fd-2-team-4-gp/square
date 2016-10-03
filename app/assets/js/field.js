app.currentModule = (function($) {
    var gameConfig = {
        url: 'https://api.backendless.com/v1/data/game'
    };
    
    return {
        init: function(obj, callback) {
            //console.log("Инициализируем модуль поля");
            obj = obj || new Object(null);
            callback = callback || function() {
                // return false;
            }
            
            app.getAvatar();

            var id = Backendless.UserService.getCurrentUser().objectId;
            //показать все поля, созданные текущим игроком       
            
            $(obj).find("#showAllFields").on('click', function(e) {
                // console.log(app.conf);
                $.ajax({
                    url: gameConfig.url,
                    method: "GET",
                    dataType: "json",
                    headers: {
                        "application-id": app.conf.id,
                        "secret-key": app.conf.key
                    },
                    success: getUserFields,
                    error: function(xhRequest, ErrorText, thrownError) {
                        console.log(xhRequest, ErrorText, thrownError);
                    },
                });
            });

            function getUserFields(data) {
                fields = data.data;
                var userFields = fields.filter(function(item) {
                    return item.ownerId === id;
                });

                userFields.forEach(function(item, i, arr) {
                    var field = $('<div data-id="' + item.objectId + '" id="f' + i + '">поле ' + i + '</div>').on('click', function(e){ console.log(e.target) });
                    $('#resultFields').append(field);
                });
            }

            //создать новое поле
            
            $(obj).find("#createField").on('click', function(e) {
                var count = prompt('До скольки голов будем играть?', '5');

                function game(args) {};

                var contactObject = new game({
                    maxGoal: count
                });

                var newfield = Backendless.Persistence.of(game).save(contactObject);
                var field = $('<div id="' + newfield.objectId + '">поле ' + '</div>');
                $('#resultFields').html('');
                $('#resultFields').append(field);
            });

            function showNewField(data) {

                var field = $('<div id="' + data.objectId + '">поле ' + data.name + '</div>');
                $('#resultFields').append(field);

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

                    this.domObj.html(result);

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

            startGame.on('click', function() {
                field.start();
            });

            callback();
        }
    }
})(jQuery);