var app = (function($, cont) {
    var config = {
        id: 'DCE54221-04BE-2940-FF08-14B2BC0FFC00',
        key: 'E8FCB4B6-2D60-EA57-FF4B-2880988EE300',
        v: 'v1'
    };
    Backendless.initApp(config.id, config.key, config.v);

    var coordMini = {
        m: ['-600px 0', '-653px 0', '-704px 0', '-756px 0'],
        w: ['-600px -63px', '-653px -63px', '-704px -63px', '-756px -63px']
    }

    $("#formAuto").on('submit', sendData);

    function sendData(e) {
        e.preventDefault();

        var login = $("#login").val();
        var password = $("#password").val();

        Backendless.UserService.login(login, password, true, new Backendless.Async(userLoggedIn, gotError));

        function userLoggedIn(user) {
            window.location.hash = '#/';
            $window.trigger('hashchange');
            $('#user').html(user.name + " " + user.lastName);
            $('#formAuto').addClass('hide');
            $('#logIn, li.hide').removeClass('hide');
            $("#formAuto")[0].reset();
        }

        function gotError(err) {
            console.log("авторизация не удалась!");
        }
    };

    $('#logOut').on('click', logOut);

    function logOut(e) {
        e.preventDefault();
        console.log('clik');

        var x = Backendless.UserService.logout();
        console.log(x);

        window.location.hash = '#/';
        $window.trigger('hashchange');
        $('#formAuto').removeClass('hide');
        $('#btnProfile, #btnField, #logIn').addClass('hide');
    }

    var initialized = false,
        $window = $(window),
        pages = {};

    var renderState = function() {
        cont.html(app.state.html);
    }

    var changeState = function(e) {
        app.state = pages[window.location.hash];
        app.state.module.init(app.state.html);
        renderState();
        console.log('hashchange = ' + window.location.hash);
    }

    return {
        
        init: function() {
            var promises = [];

            $(cont.data('pages')).find('button>a').each(function(i) {
                var href = $(this).attr("href");

                pages[href] = {
                    src: $(this).data("src"),
                    js: $(this).data("js"),
                };

                promises[promises.length] = $.ajax({
                    url: pages[href].src,
                    method: "GET",
                    dataType: "html",
                    success: function(html) {
                        pages[href].html = $(html);
                    }
                });

                promises[promises.length] = $.ajax({
                    url: pages[href].js,
                    method: "GET",
                    dataType: "script",
                    success: function(js) {
                        pages[href].module = app.currentModule;
                    }
                });
            });

            $.when.apply($, promises).then(
                function() {
                    addHashChange();
                }
            ).fail(function() {
                'Ajax-fail!!!!!!!!!!!!!'
            });

            function addHashChange() {
                $window.on('hashchange', changeState);
                if (!initialized) {
                    $window.trigger('hashchange');
                }
                initialized = true;
            }

            this.state = {};
            this.conf=config;
            window.location.hash = window.location.hash || "#/";
        },
        getAvatar: function() {
            var userTokenIsValid = Backendless.UserService.isValidLogin();

            if (userTokenIsValid) {
                var currentUser = Backendless.UserService.getCurrentUser();
                $('#user').html(currentUser.name + " " + currentUser.lastName);
                $('#btnProfile, #btnField, #logIn, #litB').removeClass('hide');
                $('#formAuto').addClass('hide');
                $('#miniAvatar').css('background-position', coordMini[currentUser.gender][currentUser.avatar]);
            }
            else {
                $('#btnProfile, #btnField, #logIn, #litB').addClass('hide');
                $('#formAuto').removeClass('hide');
            }
        },
        successLog: function(users, log){
            console.log(users);
            console.log(log);
            
            var next = log.willStart;
            for(var key in users){
                if(next == key){
                next = users[key];
            }
            }
            
            // console.log(arguments);
            // var to = data.from;
            // var from = data.next;

            //     console.log(to);
            //     for(var key in users){
            //         if(from == key){
            //             from = users[key];
            //         }
            //     }
            // if(log.goal){
            //     Backendless.initApp(APPLICATION_ID, SECRET_KEY, VERSION);
            //     var numb = log.goal.match(/[0-9]/g);
            //     sendGame["'goal'"]
                
            //     backGameStorage.save()
            // }
            // function daTa(data){
            //     console.log(data.data);
            // }
            // Backendless.enablePromises();   
            // console.log(users);
            // $.when(collection).then(daTa);
            // console.log();
            // console.log(log);
            
            
            Backendless.initApp(config.id, config.key, config.v);
            Backendless.enablePromises();
            
            // function currentGame(){
            
            
            
            // }
            // function findGame(data){
                
            // }
            // }
            
            
            var gameStorage = Backendless.Persistence.of("game");
            var dataQuery = new Backendless.DataQuery();
                
            
            
            function postvlog (args){
                args = args || {};
                this.game = users.game;
                this.from = args.from || users.start;
                this.to = args.to || next;
                
            }
            function postgoals (args){
                this.goals1 = args.goals1;
                this.goals2 = args.goals2;
                this.goals3 = args.goals3;
                this.goals4 = args.goals4;
            };
            function winnewpost(args){
                this.winner = args.winner,
                this.ended = args.ended
            };
            
            
            function errr(err){
                console.log( "Error message - " + err.message );
                console.log( "Error code - " + err.statusCode );
            }
            function requestLog(resp){
                
                console.log(resp);
                // var startGame = true;

                if(resp.to == log.user1){
                    alert("Ваш ход! Кликайте,чтобы ударить!");
                    $("#square").on("click", function(e) {
                        $("div[data-index]").each(function(i, el) {
                            // console.log($(el));
                            // console.log(e.target);
                            // console.log(el);
                            if(el == e.target){
                                var index = el.getAttribute("data-index");
                                console.log(index);
                                var clickTo = "user"+index;
                                console.log(clickTo);
                                for(var key in users){
                                    if(clickTo == key){
                                    clickTo = users[key];
                        
                                    } 
                    
                                }console.log(clickTo);
                                app.render(log, clickTo)
                                otrisovka(resp.to, clickTo);
                            }
                        })
                    })
                    return false;
                } else{
                    app.render(log, resp.to);
                    var to = resp.next;
                    var from = resp.to;
                    for(var key in users){
                    if(to == key){
                        to = users[key];
                    } 
                }
                    otrisovka(from, to);
                }

                    function otrisovka(from, to){
                    dataQuery.condition = "objectId = "+"'"+log.objectId+"'";
                    gameStorage.find( dataQuery ).then(function(data){
                    console.log(data);
                    var game = data.data[0];
                    var winner = game.winner;
                    
                    for(var key in users){
                    if(winner == users[key]){
                        winner = key;
                    } 
                    }
                    
                    
                    $("#goal1").text(game.goals1);
                    $("#goal2").text(game.goals2);
                    $("#goal3").text(game.goals3);
                    $("#goal4").text(game.goals4);
                    
                    if(resp.goal){
                    }
                    
                    if(game.ended){
                        alert(winner);
                        return false;
                    } else{
                      loglog(from, to);  
                    }
                    });
                    }

            }
            
            function loglog(from, to){
                
                
                
                var postLog = new postvlog({
                        game: log.game,
                        from: from,
                        to: to
                })
                
                console.log(postLog);
                
                
                
                setTimeout(function(){
                    Backendless.Persistence.of("log").save(postLog).then(requestLog).catch(errr);
                },1000);
                
                 
            }
            loglog();
        },
        render: function(log, to){
            var square = $('#square');
            var mess = $('#info');

            function Player(name, colour, avatar, id) {
                var _self = this;

                this.avatar = avatar;
                this.name = name;
                this.colour = colour;
                this.id = id;
                this.count = 0;
                this.goal = 0;

                this.punch = function() {
                    
                    // $(field.players.id).each(function(i, el) {
                    //     if($(el) == from){
                    //         _self.ball = false;
                    //     }
                    // })
                    // $(field.players.id).each(function(i, el) {
                    //     if($(el) == to){
                    //         // field.started = false;
                    //         // console.log(el);
                            
                    //     }
                    // })

                    // if (this.ball) {
                    //     var playerId = Math.ceil(Math.random() * this.players.length) - 1;
                    //     this.ball = false;

                    //     if (Math.random() * 2 > 1) {
                    //         field.players[playerId].addGoal();
                    //         this.addCount();
                    //         field.started = false;
                    //     }
                    //     else {
                    //         field.players[playerId].getBall();
                    //     }
                    // }
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
                    var ind = index + 1;
                    
                    var result = [
                        '<div class="player ',
                        this.colour,
                        '" data-index="',
                        ind,
                        '"><img src="',
                        this.avatar,
                        '"><br>',
                        this.name,
                        ball,
                        '</div>'
                    ];

                    return result.join('');
                };

                this.clickW = function(obj) {
                    console.log( obj);
                    obj = obj || this.field;
                    console.log(this.field);

                    obj.players.forEach(function(p) {
                        p.ball = false;
                    });

                    _self.getBall();
                    obj.render2();
                    mess.innerHTML = 'мяч у меня!' + _self.name;
                };
            };

            function Field(players, obj) {
                this.players = players;
                this.domObj = obj;
                // this.started = false;

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
                                _f.players[_i].clickW(_i, _f);
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
                    
                    console.log(domPlayers);
                    
                    // $(this.players).each(function(i, el) {
                    //     // console.log(el);
                    //     if(el.id == to){
                    //         console.log(el);
                    //         // var ev = el.click;
                            
                    //         field.players.forEach(function(p) {
                    //             p.ball = false;
                    //         });
                    //         el.getBall();
                    //         field.render2();
                    //         // $(el[i]).click;
                    //     }
                    // })
                    // $(field.players.id).each(function(i, el) {
                    //     if($(el) == to){
                    //         // field.started = false;
                    //         console.log(el);
                            
                    //     }
                    // })
                    

                    // for (var i = 0; i < domPlayers.length; i++) {
                    //     domPlayers[i].addEventListener('click', {
                    //         handleEvent: this.players[i].click,
                    //         field: _self
                    //     });
                    // }
                    
                };

                this.start = function() {
                    // console.log(startGame);
                    // if (!startGame) {
                        // var p_Id = Math.ceil(Math.random() * this.players.length) - 1;
                        // started = true;
                        
                        // this.players[startUser].getBall();
                        $(this.players).each(function(i, el) {
                            if(el.id == to){
                                console.log(el)
                                el.getBall();
                                mess.prepend('<div>--начнём с id = "' + el.id + '</div>');
                            }
                        
                        
                        })
                    // }
                    // else {
                    //     mess.prepend('<div>--Игра уже идет!</div>');
                    // }
                    // console.log("начнём с id = " + startUser);
                    
                    this.render();
                }
            }
            
            var p1 = new Player('Cap', 'green', 'assets/images/cap.png', log.user1);
            var p2 = new Player('IronMan', 'red', 'assets/images/ironman.png', log.user2);
            var p3 = new Player('SpiderMan', 'yellow', 'assets/images/spiderman.png', log.user3);
            var p4 = new Player('Puh', 'blue', 'assets/images/puh.png', log.user4);
            var pl = [p1, p2, p3, p4];
            
            var field = new Field([p1, p2, p3, p4], square);
            
            
            field.start();

            // var startGame = $('#startGame').on('click', function() {
                
            // });
        }
        
    };

})(jQuery, $('#app'));

app.init();

// var userTokenIsValid = Backendless.UserService.isValidLogin();
// var userId = Backendless.UserService.loggedInUser();
// var currentUser = Backendless.UserService.getCurrentUser();