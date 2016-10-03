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
                $('#btnProfile, #btnField, #logIn').removeClass('hide');
                $('#formAuto').addClass('hide');
                $('#miniAvatar').css('background-position', coordMini[currentUser.gender][currentUser.avatar]);
            }
            else {
                $('#btnProfile, #btnField, #logIn').addClass('hide');
                $('#formAuto').removeClass('hide');
            }
        }
    };

})(jQuery, $('#app'));

app.init();

// var userTokenIsValid = Backendless.UserService.isValidLogin();
// var userId = Backendless.UserService.loggedInUser();
// var currentUser = Backendless.UserService.getCurrentUser();