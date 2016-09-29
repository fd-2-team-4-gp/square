app.currentModule = (function($) {
    //используем для связи с backendless
    var config = {
        url: 'https://api.backendless.com/v1/data/Users',
        id: 'DCE54221-04BE-2940-FF08-14B2BC0FFC00',
        key: 'E8FCB4B6-2D60-EA57-FF4B-2880988EE300',
        v: 'v1'
    }
    return {
        init: function(obj, callback) {
            console.log("Инициализируем модуль для профиля");
            obj = obj || new Object(null);
            callback = callback || function() {
                return false;
            }

            var coord = {
                m: ['-2px -2px', '-160px -2px', '-320px -2px', '-475px -2px'],
                w: ['-2px -195px', '-160px -195px', '-315px -195px', '-470px -195px']
            };
            var coordMini = {
                m: ['-600px 0', '-653px 0', '-704px 0', '-756px 0'],
                w: ['-600px -63px', '-653px -63px', '-704px -63px', '-756px -63px']
            }

            var currentUser = Backendless.UserService.getCurrentUser();
            var userToken = Backendless.LocalCache.get("user-token");
            var age = Math.floor((new Date() - currentUser.age) / 3.1536e10);
            var gender = currentUser.gender;
            console.log(currentUser.avatar);

            $(document).tooltip();
            $(obj).find("#datepicker")
                .removeClass("hasDatepicker")
                .datepicker("destroy");
            $(obj).find('#profileAvatar').css('background-color', currentUser.color);
            $(obj).find('#imgForAvatar').css('background-position', coord[gender][currentUser.avatar]);
            $(obj).find('#profileName').html(currentUser.name);
            $(obj).find('#profileSurname').html(currentUser.lastName);
            $(obj).find('#profileAge').html(age);
            $(obj).find('#profileEmail').html(currentUser.email);
            $(obj).find('#changeColor').css('background-color', currentUser.color);
            $(obj).find('#changeColor').css('color', currentUser.color);
            $(obj).find('#changeAvatar').on('click', changeAvatar);
            $(obj).find('#dialog button').on('click', hideDialog);
            $(obj).find('#changeColor').on('change', changeColor);
            $(obj).find("#datepicker").datepicker({
                changeYear: true,
                yearRange: "1920:" + new Date().getFullYear()
            }).on('change', changeUserBirthday);

            function changeAvatar(e) {
                e.preventDefault();
                $('#dialog').find('.chooseAvatars').each(function(i) {
                    $(this).css('background-position', coord[gender][i]);
                    $(this).on('click', function() {
                        currentUser.avatar = i;

                        Backendless.enablePromises();

                        Backendless.UserService.update(currentUser).then(success).catch(gotError);

                        function success(user) {
                            $(obj).find('#imgForAvatar').css('background-position', coord[user.gender][user.avatar]);
                            $('#miniAvatar').css('background-position', coordMini[user.gender][user.avatar]);
                        }

                        function gotError(err) {
                            console.log("error message - " + err.message);
                            console.log("error code - " + err.statusCode);
                        }

                        $("#dialog").addClass('hide');
                    })
                });
                $("#dialog").removeClass('hide');
            }

            function hideDialog(e) {
                $(obj).find("#dialog").addClass('hide');
            }

            function changeColor(e) {
                currentUser.color = $(this).val();
                Backendless.enablePromises();
                Backendless.UserService.update(currentUser).then(success).catch(gotError);

                function success(user) {
                    $(obj).find('#profileAvatar').css('background-color', currentUser.color);
                    $(obj).find('#changeColor').css('background-color', currentUser.color);
                    $(obj).find('#changeColor').css('color', currentUser.color);
                }

                function gotError(err) {
                    console.log("error message - " + err.message);
                    console.log("error code - " + err.statusCode);
                }
            }

            function changeUserBirthday(e) {
                Backendless.enablePromises();
                currentUser.age = new Date($(this).val()).getTime();

                function success(user) {
                    $(obj).find('#profileAge').html(Math.floor((new Date() - user.age) / 3.1536e10));
                    console.log(Math.floor((new Date() - user.age) / 3.1536e10));
                }

                function gotError(err) {
                    console.log("error message - " + err.message);
                    console.log("error code - " + err.statusCode);
                }

                Backendless.UserService.update(currentUser).then(success).catch(gotError);
            }
            callback();
        }
    }
})(jQuery);