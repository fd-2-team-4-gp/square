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

            //всплывающая подсказка(работает сос всеми элементами, у кого есть атрибут "title")
            $(document).tooltip();

            $(".changeBirthday").tooltip({
                position: {
                    my: "right+10 center",
                    at: "left center"
                }
            });

            // var position = $( "#BotChangeSurname" ).tooltip( "option", "position" );
            // console.log(position);

            // предварительно удаляем обработчик событий (баг - при переходе по пунктам меню перестаёт срабатывать вилджет datapicker) 
            $(obj).find("#datepicker")
                .removeClass("hasDatepicker")
                .datepicker("destroy");

            //данный пользователя(авторизированного)
            var currentUser = Backendless.UserService.getCurrentUser();
            var userToken = Backendless.LocalCache.get("user-token");
            console.log(currentUser);
            //на сервере, дата рождения в милисекундах, высчитываем количество полных лет относительно текучего времени

            var age = Math.floor((new Date() - currentUser.age) / 3.1536e10);
            var gender = currentUser.gender;
            console.log(currentUser.avatar);


            $(document).tooltip();
            $(obj).find("#datepicker")
                .removeClass("hasDatepicker")
                .datepicker("destroy");

            //заносим данные авторизированного игрока в профиль 

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

            //ставим обработчик на кнопку изменения автара            
            $(obj).find('#changeAvatar').on('click', changeAvatar);
            $(obj).find('#dialog button').on('click', hideDialog);
            $(obj).find('#changeColor').on('change', changeColor);
            $(obj).find("#datepicker").datepicker({
                changeYear: true,
                yearRange: "1920:" + new Date().getFullYear()
            }).on('change', changeUserBirthday);

            // будущий функционал изменения аватара

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

            //ставим обработчик на кнопку выбора цвета
            $(obj).find('#changeColor').on('change', changeColor);

            //выбираем цвет поля игрока
            function changeColor(e) {
                //меняем значение свойства age пользователя currentUser                
                currentUser.color = $(this).val();

                Backendless.enablePromises();
                // отправляем запрос на обновление свойств currentUser
                Backendless.UserService.update(currentUser).then(success).catch(gotError);
                // если запрос прошёл удачно, обновляем HTML данные профиля               

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

            //вилджет календаря
            $(obj).find("#datepicker").datepicker({
                changeYear: true,
                yearRange: "1920:" + new Date().getFullYear()
            }).on('change', changeUserBirthday);

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

            // смена фамилии

            $(obj).find("#BotChangeSurname").on('click', function() {

                // var position = $("#BotChangeSurname").tooltip("position");
                // console.log(position);

                console.log('смена фамилии');
                $("#changeSurname").css("display", "inline");
                $("#profileSurname").css("display", "none");
            });

            $(obj).find("#changeSurname").on('change', changeUserSurname);

            function changeUserSurname(e) {
                Backendless.enablePromises();
                currentUser.lastName = new $(this).val();

                function success(user) {
                    $(obj).find('#profileSurname').html(currentUser.lastName);
                    console.log(currentUser.lastName);
                }
                $("#changeSurname").css("display", "none");
                $("#profileSurname").css("display", "inline");

                function gotError(err) {
                    console.log("error message - " + err.message);
                    console.log("error code - " + err.statusCode);
                }

                Backendless.UserService.update(currentUser).then(success).catch(gotError);
            }

            //смена имени

            $(obj).find("#BotChangeName").on('click', function() {
                console.log('gydewgyfcuhs');
                $("#changeName").css("display", "inline");
                $("#profileName").css("display", "none");
            });

            $(obj).find("#changeName").on('change', changeUserName);

            function changeUserName(e) {
                Backendless.enablePromises();
                currentUser.name = new $(this).val();

                function success(user) {
                    $(obj).find('#profileName').html(currentUser.name);
                    console.log(currentUser.name);
                }
                $("#changeName").css("display", "none");
                $("#profileName").css("display", "inline");

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