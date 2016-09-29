var app = (function($, cont) {

    var config = {
        url: 'https://api.backendless.com/v1/data/Users',
        id: 'DCE54221-04BE-2940-FF08-14B2BC0FFC00',
        key: 'E8FCB4B6-2D60-EA57-FF4B-2880988EE300',
        v: 'v1'
    }

    var coordMini = {
        m: ['-600px 0', '-653px 0', '-704px 0', '-756px 0'],
        w: ['-600px -63px', '-653px -63px', '-704px -63px', '-756px -63px']
    }

    Backendless.initApp(config.id, config.key, config.v);

    var loggedInUser = Backendless.UserService.loggedInUser();
    var currentUser = Backendless.UserService.getCurrentUser();

    if (loggedInUser === undefined) {
        $('#btnProfile, #btnField, #logIn').addClass('hide');
        $('#formAuto').removeClass('hide');
    }
    else {
        $('#user').html(currentUser.name + " " + currentUser.lastName);
        $('#btnProfile, #btnField, #logIn').removeClass('hide');
        $('#formAuto').addClass('hide');
        $('#miniAvatar').css('background-position', coordMini[currentUser.gender][currentUser.avatar]);
    }

    $("#formAuto").on('submit', sendData);

    function sendData(e) {

        e.preventDefault();

        var login = $("#login").val();
        var password = $("#password").val();

        Backendless.enablePromises();

        Backendless.UserService.login(login, password, true).then(success).catch(gotError);

        function success(user) {
            $('#user').html(user.name + " " + user.lastName);
            $('#formAuto').addClass('hide');
            $('#logIn, li.hide').removeClass('hide');
            $("#formAuto")[0].reset();
        }

        function gotError(err) {
            console.log("error message - " + err.message);
            console.log("error code - " + err.statusCode);
        }
    };

    $('#logOut').on('click', logOut);

    function logOut(e) {
        e.preventDefault();

        Backendless.enablePromises();

        Backendless.UserService.logout().then(success).catch(gotError)

        function success() {
            window.location.hash = '#/';
            $('#formAuto').removeClass('hide');
            $('#btnProfile, #btnField, #logIn').addClass('hide');
        }

        function gotError(err) {
            console.log("error message - " + err.message);
            console.log("error code - " + err.statusCode);
        }
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

        $('a.active').removeClass('active');
        $('a[href="' + window.location.hash + '"]').addClass('active');
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

            this.state = {}
            window.location.hash = window.location.hash || "#/";

            function addHashChange() {
                $window.on('hashchange', changeState);
                if (!initialized) {
                    $window.trigger('hashchange');
                }
                initialized = true;
            }
        }
    };
})(jQuery, $('#app'));

app.init();