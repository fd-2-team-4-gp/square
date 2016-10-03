app.currentModule = (function($) {
    return {
        init: function(obj, callback) {
            // console.log("Инициализируем модуль для главной страницы");
            obj = obj || new Object(null);
            callback = callback || function() {
                return false;
            }
            var coordMini = {
                m: ['-600px 0', '-653px 0', '-704px 0', '-756px 0'],
                w: ['-600px -63px', '-653px -63px', '-704px -63px', '-756px -63px']
            }

            var userTokenIsValid = Backendless.UserService.isValidLogin();

            if (userTokenIsValid) {
                var currentUser = Backendless.UserService.getCurrentUser();
                $('#user').html(currentUser.name + " " + currentUser.lastName);
                $('#btnProfile, #btnField, #logIn').removeClass('hide');
                $('#formAuto').addClass('hide');
                $('#miniAvatar').css('background-position', coordMini[currentUser.gender][currentUser.avatar]);
            }
            else {
                $('#btnProfile, #btnField, #logIn').addClass('hide');
                $('#formAuto').removeClass('hide');
            }
            callback();
        }
    }
})(jQuery);