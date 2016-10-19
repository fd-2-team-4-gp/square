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
            alert("Авторизация не удалась! Попробуйте снова.");
            $("#login").val("");
            $("#password").val("");
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
        successLog: function(log){
            // console.log(users);
            console.log(log);
            
            var next = log.willStart;
            for(var nextkey in log){
                if(next == nextkey){
                next = log[nextkey];
            }
            }
            
            
            $("#square").delegate("div", "click", function(e) {
                        // console.log(fr);
                        $("div[data-index]").each(function(i, el) {
                            if(el == e.target){
                                var index = el.getAttribute("data-index");
                                
                                var clickTo = "user"+index;
                                
                                for(var clickkey in log){
                                    if(clickTo == clickkey){
                                    clickTo = log[clickkey];
                        
                                    } 
                    
                                }console.log(clickTo);
                                
                                otrisovka(log.user1, clickTo);
                            }
                        })
            })
            
            Backendless.initApp(config.id, config.key, config.v);
            Backendless.enablePromises();
            
            
            var gameStorage = Backendless.Persistence.of("game");
            var dataQuery = new Backendless.DataQuery();
                
            
            function otrisovka(from, to){
                    dataQuery.condition = "objectId = "+"'"+log.objectId+"'";
                    gameStorage.find( dataQuery ).then(function(data){
                    
                    var game = data.data[0];
                    console.log(game);
                    var winner = game.winner;
                    
                    for(var winkey in game){
                    if(winner == game[winkey]){
                        winner = winkey;
                    } 
                    }
                    
                    $("#goal1").text(game.goals1);
                    $("#goal2").text(game.goals2);
                    $("#goal3").text(game.goals3);
                    $("#goal4").text(game.goals4);
                    
                    // if(resp.goal){
                    // }
                    
                    if(game.ended){
                        alert("Победа " + winner + "!");
                        return false;
                    } else{
                      loglog(from, to);  
                    }
                    });
                    }
            function postvlog (args){
                args = args || {};
                this.game = args.game || log.objectId;
                this.from = args.from || next;
                this.to = args.to || null;
                
            }
            function errr(err){
                console.log( "Error message - " + err.message );
                console.log( "Error code - " + err.statusCode );
            }
            function requestLog(resp){
                
                app.render(log, resp.to);
                
                
                if(resp.to == log.user1){
                    alert("Ваш ход! Кликайте,чтобы ударить!");
                    $("#square").trigger("click");
                    return false;
                } else{
                    
                    var to = resp.next;
                    var from = resp.to;
                    for(var tokey in log){
                        if(to == tokey){
                        to = log[tokey];
                        } 
                    }
                    otrisovka(from, to);
                }

                    

            }
            
            function loglog(from, to){
                
                
                
                var postLog = new postvlog({
                        game: log.objectId,
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
            var us;
            var sq = $("#square").offset();
            for (var bar in log){
                if(log[bar] == to){
                    us = bar;
                }
            }
            for (var jar in log.ballCoords){
                    
                    if(jar == us){
                        
                        $("#ball").offset({
                            top: sq.top + log.ballCoords[jar].top,
                            left: sq.left + log.ballCoords[jar].left
                        })
                    }
            }
            
            

        }
        
    };

})(jQuery, $('#app'));

app.init();

// var userTokenIsValid = Backendless.UserService.isValidLogin();
// var userId = Backendless.UserService.loggedInUser();
// var currentUser = Backendless.UserService.getCurrentUser();