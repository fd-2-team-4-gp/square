app.currentModule = (function($) {
    return {
        init: function(obj, callback) {
            // console.log("Инициализируем модуль для профиля");
            obj = obj || new Object(null);
            callback = callback || function() {
                return false;
            }
            
            app.getAvatar();

            var coord = {
                m: ['-2px -2px', '-160px -2px', '-320px -2px', '-475px -2px'],
                w: ['-2px -195px', '-160px -195px', '-315px -195px', '-470px -195px']
            };
            var coordMini = {
                m: ['-600px 0', '-653px 0', '-704px 0', '-756px 0'],
                w: ['-600px -63px', '-653px -63px', '-704px -63px', '-756px -63px']
            }

            var currentUser = Backendless.UserService.getCurrentUser();

            $(document).tooltip();

            $(obj).find("#datepicker")
                .removeClass("hasDatepicker")
                .datepicker("destroy");

            $(".changeBirthday").tooltip({
                position: {
                    my: "right+10 center",
                    at: "left center"
                }
            });

            // var position = $( "#BotChangeSurname" ).tooltip( "option", "position" );
            // console.log(position);

            var age = Math.floor((new Date() - currentUser.age) / 3.1536e10);
            var gender = currentUser.gender;

            $(obj).find('#profileAvatar').css('background-color', currentUser.color);
            $(obj).find('#imgForAvatar').css('background-position', coord[gender][currentUser.avatar]);
            $(obj).find('#profileName').html(currentUser.name);
            $(obj).find('#changeName').val(currentUser.name);
            $(obj).find('#profileSurname').html(currentUser.lastName);
            $(obj).find('#changeSurname').val(currentUser.lastName);
            $(obj).find('#profileAge').html(age);
            $(obj).find('#profileEmail').html(currentUser.email);
            $(obj).find('#changeColor').css('background-color', currentUser.color);
            $(obj).find('#changeColor').css('color', currentUser.color);

            // изменение аватарки

            $(obj).find('#changeAvatar').on('click', changeAvatar);

            function changeAvatar(e) {
                e.preventDefault();
                $('#dialog').find('.chooseAvatars').each(function(i) {
                    $(this).css('background-position', coord[gender][i]);
                    $(this).on('click', function() {
                        currentUser.avatar = i;

                        Backendless.UserService.update(currentUser, new Backendless.Async(userUpdated, gotError));


                        function userUpdated(user) {
                            $(obj).find('#imgForAvatar').css('background-position', coord[user.gender][user.avatar]);
                            $('#miniAvatar').css('background-position', coordMini[user.gender][user.avatar]);
                        }

                        function gotError(err) {
                            console.log("fail update!\nerror message - " + err.message + "\nerror code - " + err.statusCode);
                        }

                        $("#dialog").addClass('hide');
                    })
                });
                $("#dialog").removeClass('hide');
            }
            
            // закрытие модального окна выбора аватарки

            $(obj).find('#dialog button').on('click', hideDialog);
                        
            function hideDialog(e) {
                $(obj).find("#dialog").addClass('hide');
            }

            // изменение цвета поля

            $(obj).find('#changeColor').on('change', changeColor);

            function changeColor(e) {
                currentUser.color = $(this).val();

                Backendless.UserService.update(currentUser, new Backendless.Async(userUpdated, gotError));

                function userUpdated(user) {
                    $(obj).find('#profileAvatar').css('background-color', currentUser.color);
                    $(obj).find('#changeColor').css('background-color', currentUser.color);
                    $(obj).find('#changeColor').css('color', currentUser.color);
                }

                function gotError(err) {
                    console.log("fail update!\nerror message - " + err.message + "\nerror code - " + err.statusCode);
                }
            }

            // изменение дня рождения
            
            $(obj).find("#datepicker").datepicker({
                changeYear: true,
                yearRange: "1920:" + new Date().getFullYear()
            }).on('change', changeUserBirthday);

            function changeUserBirthday(e) {

                currentUser.age = new Date($(this).val()).getTime();

                Backendless.UserService.update(currentUser, new Backendless.Async(userUpdated, gotError));

                function userUpdated(user) {
                    $(obj).find('#profileAge').html(Math.floor((new Date() - user.age) / 3.1536e10));
                }

                function gotError(err) {
                    console.log("fail update!\nerror message - " + err.message + "\nerror code - " + err.statusCode);
                }
            }

            // смена фамилии

            $(obj).find("#BotChangeSurname").on('click', function() {
                $("#changeSurname").css("display", "inline");
                $("#profileSurname").css("display", "none");
            });

            $(obj).find("#changeSurname").on('change', changeUserSurname);

            $(obj).find("#changeSurname").on('blur', function() {
                $("#changeSurname").css("display", "none");
                $("#profileSurname").css("display", "inline");
            });

            function changeUserSurname(e) {

                currentUser.lastName = new $(this).val();

                Backendless.UserService.update(currentUser, new Backendless.Async(userUpdated, gotError));

                function userUpdated(user) {
                    $(obj).find('#profileSurname').html(currentUser.lastName);
                    $("#changeSurname").css("display", "none");
                    $("#profileSurname").css("display", "inline");
                }

                function gotError(err) {
                    console.log("fail update!\nerror message - " + err.message + "\nerror code - " + err.statusCode);
                }
            }

            // смена имени

            $(obj).find("#BotChangeName").on('click', function() {
                $("#changeName").css("display", "inline");
                $("#profileName").css("display", "none");
            });

            $(obj).find("#changeName").on('blur', function() {
                $("#changeName").css("display", "none");
                $("#profileName").css("display", "inline");
            });

            $(obj).find("#changeName").on('change', changeUserName);

            function changeUserName(e) {

                currentUser.name = new $(this).val();

                Backendless.UserService.update(currentUser, new Backendless.Async(userUpdated, gotError));

                function userUpdated(user) {
                    $(obj).find('#profileName').html(currentUser.name);
                    $("#changeName").css("display", "none");
                    $("#profileName").css("display", "inline");
                }

                function gotError(err) {
                    console.log("fail update!\nerror message - " + err.message + "\nerror code - " + err.statusCode);
                }
            }
            callback();
        }
    }
})(jQuery);