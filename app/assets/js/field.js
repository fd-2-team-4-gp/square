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
            
            // app.getAvatar();
            
        $(obj).find("#startGame").click(function(e){
        var count = prompt('До скольки голов будем играть?', '5');            

        function game (args){
            args = args || {};
            this.maxGoal = args.maxGoal || "";
        }
        
        
        Backendless.initApp(APPLICATION_ID, SECRET_KEY, VERSION);
        Backendless.enablePromises();
        var gameStorage = Backendless.Persistence.of("game");
        
        
        function successGame(data){
            // console.log(data);
            var startGame = false;
            
            var users = {
                user1: data.user1,
                user2: data.user2,
                user3: data.user3,
                user4: data.user4,
                game: data.objectId,
                maxGoal: data.maxGoal,
                ended: data.ended
            };
            var goals = {
                goals1: data.goals1,
                goals2: data.goals2,
                goals3: data.goals3,
                goals4: data.goals4
            }

            var start = data.willStart;
            
            for(var key in users){
                if(start == key){
                    start = users[key];
                }
            }
            users.start = start;
            var to = users.start;
            
            var field = $('<div id="' + gameData.objectId + '">поле ' + '</div>');
                $('#resultFields').html('');
                $('#resultFields').append(field);
            app.render(data, to);
            app.successLog(users, data);
            
        }
        
        
        
        function err (err){
            console.log(err.message);
            alert("nope");
        }
        
        var gameStart = new game ({
            maxGoal: count
        });
        
        var gameData = gameStorage.save(gameStart).then(successGame).catch(err);
        // })
            var id = Backendless.UserService.getCurrentUser().objectId;
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

            function showNewField(data) {

                var field = $('<div id="' + data.objectId + '">поле ' + data.name + '</div>');
                $('#resultFields').append(field);

            }
        
            

            callback();
        }
    }
})(jQuery);