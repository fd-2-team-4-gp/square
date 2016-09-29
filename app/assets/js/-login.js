app.currentModule = (function($) {

    var config = {
        url: 'https://api.backendless.com/v1/data/Users',
        id: 'DCE54221-04BE-2940-FF08-14B2BC0FFC00',
        key: 'E8FCB4B6-2D60-EA57-FF4B-2880988EE300',
        v: 'v1'
    }
    
    return {
        init: function(obj, callback) {
            obj = obj || new Obj(null);
            callback = callback || false;

            Backendless.initApp(config.id, config.key, config.v);
           // console.log(obj.find("#sendAuto"));
            obj.find("#sendAuto").click(function(e) {
                e.preventDefault();
                Backendless.initApp(config.id, config.key, config.v);

                var login = obj.find("#autolog").val();
                var password = obj.find("#autopass").val();
                console.log(login, password);

                function userLoggedIn(user) {
                    var megauser = Backendless.UserService.getCurrentUser();

                    if (megauser != null) {
                        alert("Вы зашли как " + megauser["name"] + megauser["lastName"]);
                    }
                    else {
                        alert("User hasn't been logged");
                    }
                }

                function gotError(err) // see more on error handling
                {
                    alert("Неправильный логин или пароль!");
                    obj.find("#autolog").val("");
                    obj.find("#autopass").val("");
                }
                Backendless.UserService.login(login, password, true, new Backendless.Async(userLoggedIn, gotError));
            });
        }
    }
})(jQuery);