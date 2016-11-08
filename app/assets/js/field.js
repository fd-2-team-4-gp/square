app.currentModule = (function($) {
    // var gameConfig = {
    //     url: 'https://api.backendless.com/v1/data/game'
    // };
        var APPLICATION_ID = 'DCE54221-04BE-2940-FF08-14B2BC0FFC00',
        SECRET_KEY = 'E8FCB4B6-2D60-EA57-FF4B-2880988EE300',
        VERSION = 'v1';
    
    return {
        init: function(obj, callback) {
            //console.log("Инициализируем модуль поля");
            obj = obj || new Object(null);
            callback = callback || function() {
                // return false;
            }
            
            app.getAvatar();
            
        $(obj).find("#startGame").click(function(e){
            $("div[class*=player]").detach();
            $("#ball").detach();
            $("#square").undelegate("div", "click");
        // var count = prompt('До скольки голов будем играть?', '5')            

        function game (args){
            args = args || {};
            this.maxGoal = args.maxGoal || "";
        }
        
        
        Backendless.initApp(APPLICATION_ID, SECRET_KEY, VERSION);
        Backendless.enablePromises();
        // var gameStorage = ;
        
        
        function successGame(data){
            console.log(data);
            
            function Player(name, colour, avatar, id) {
                
                this.avatar = avatar;
                this.name = name;
                this.colour = colour;
                this.id = id;
                
                
                this.render = function(index) {
                    // var ball = '';

                    // if (this.ball) {
                    //     ball = '<div class="ball"></div>';
                    // }
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
                        '</div>'
                    ];

                    return result.join('');
                };
                
            }
            var p1 = new Player('Cap', 'green', 'assets/images/cap.png', data.user1);
            var p2 = new Player('IronMan', 'red', 'assets/images/ironman.png', data.user2);
            var p3 = new Player('SpiderMan', 'yellow', 'assets/images/spiderman.png', data.user3);
            var p4 = new Player('Puh', 'blue', 'assets/images/puh.png', data.user4);
            
            var players = [p1,p2,p3,p4];
            var ballCoords = {
                user1: {
                    top: 160,
                    left: 160
                        },
                user2: {
                    top: 160,
                    left: 360
                },
                user3: {
                    top: 360,
                    left: 160
                },
                user4: {
                    top: 360,
                    left: 360
                }
            };
            data.ballCoords = ballCoords;
            console.log(data);
            
            function creat(){
                var result = players.map(
                        function(p, index) {
                            return p.render(index);
                        }
                    ).join('');
                var ball = $("<div id='ball'></div>");
                $("#square").append(result, ball);
                
                // $("div[class*=user]").each(function(i, el) {
                // // //   if($(el).hasClass('"'+data.willStart+'"')){
                          
                // // //   }
                // console.log($(el).position());
                // })
                var sq = $("#square").offset();
                
                // var top = sq.top + ballCoords.user1.top;
                // var left = sq.left + ballCoords.user1.left;
                // $("#ball").offset({
                //     top: sq.top + ballCoords.user1.top,
                //     left: left
                //         })
                for (var key in ballCoords){
                    
                    if(key == data.willStart){
                        
                        $("#ball").offset({
                            top: sq.top + ballCoords[key].top,
                            left: sq.left + ballCoords[key].left
                        })
                    }
                }
                
                
            }
            creat();
            
            
           
            
            
            
            
            
            

            
            
            
            // app.render(data, to);
            app.successLog(data);
            
        }
        
        
        
        function err (err){
            console.log(err.message);
            alert("nope");
        }
        
        var gameStart = new game ({
            maxGoal: 1
        });
        
        Backendless.Persistence.of("game").save(gameStart).then(successGame).catch(err);
        // })
        
        // var field = $('<div id="' + gameData.objectId + '">поле ' + '</div>');
            //     $('#resultFields').html('');
            //     $('#resultFields').append(field);
            
            
            // var id = Backendless.UserService.getCurrentUser().objectId;
            //показать все поля, созданные текущим игроком       
            
            // $(obj).find("#showAllFields").on('click', function(e) {
            //     // console.log(app.conf);
            //     $.ajax({
            //         url: gameConfig.url,
            //         method: "GET",
            //         dataType: "json",
            //         headers: {
            //             "application-id": app.conf.id,
            //             "secret-key": app.conf.key
            //         },
            //         success: getUserFields,
            //         error: function(xhRequest, ErrorText, thrownError) {
            //             console.log(xhRequest, ErrorText, thrownError);
            //         },
            //     });
            // });

            // function getUserFields(data) {
            //     fields = data.data;
            //     var userFields = fields.filter(function(item) {
            //         return item.ownerId === id;
            //     });

            //     userFields.forEach(function(item, i, arr) {
            //         var field = $('<div data-id="' + item.objectId + '" id="f' + i + '">поле ' + i + '</div>').on('click', function(e){ console.log(e.target) });
            //         $('#resultFields').append(field);
            //     });
            // }

            // //создать новое поле
            
            // $(obj).find("#createField").on('click', function(e) {
                

            //     function game(args) {};

            //     var contactObject = new game({
            //         maxGoal: count
            //     });

            //     var newfield = Backendless.Persistence.of(game).save(contactObject);
                
            });

            // function showNewField(data) {

            //     var field = $('<div id="' + data.objectId + '">поле ' + data.name + '</div>');
            //     $('#resultFields').append(field);

            // }
        
            

            callback();
        }
    }
})(jQuery);