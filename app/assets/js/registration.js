app.currentModule = (function($) {
    return {
        init: function(obj, callback) {
            obj = obj || new Object(null);
            callback = callback || function() {
                return false;
            }

            var dp = obj.find("#datepicker");
            dp.datepicker({
                dateFormat: 'dd.mm.yy',
                changeYear: true,
                yearRange: "1920:" + new Date().getFullYear()
            });

            var email = obj.find("#reglog");
            var password = obj.find("#regpass");
            var name = obj.find("#fname");
            var lastName = obj.find("#lname");
            var age = obj.find("#datepicker");
            var gender = obj.find("#gender");
            
            
            obj.find(".close").on('click', closeModal);
            
            function closeModal() {
                $(obj).find('#formRegistr').on('submit', function(e){
                    e.preventDefault();                    
                });
                $(obj).find('#formRegistr')[0].reset();
                window.location.hash = '#/';
            }
            
            obj.find("#registrBtn").click(function(e) {
                e.preventDefault();

                var d = dp.val();
                var birth_date = d.split('.');
                birth_date = new Date(birth_date[2], birth_date[1] - 1, birth_date[0]);
                birth_date = birth_date.getTime();

                function userRegistered(user) {
                    alert("Поздравляем с регистрирацией!");
                    obj.find('input[type=text]').each(function(i, el) {
                        $(el).val("");
                    });
                    window.location.hash = "#/";
                }

                function gotError() {
                    $(".error").each(function(i, el) {
                        $(el).removeClass("error");
                    });
                    $(".errMess").each(function(i, el) {
                        el.remove();
                    });

                    try {
                        var exFields = [];

                        if (!email.val()) {
                            exFields.push(email);
                        }

                        if (!password.val()) {
                            exFields.push(password);
                        }
                        if (!name.val()) {
                            exFields.push(name);
                        }
                        if (!lastName.val()) {
                            exFields.push(lastName);
                        }
                        if (!age.val()) {
                            exFields.push(age);
                        }
                        if (!gender.val()) {
                            exFields.push(gender);
                        }
                        if (exFields.length > 0) {
                            throw new formError(exFields);
                        }
                    }

                    catch (e) {
                        if (e.type === "myFormError") {
                            e.styled();
                        }
                        else {
                            throw e;
                        }
                    }

                    function formError(amir) {

                        this.type = "myFormError";
                        this.styled = function() {
                            $(amir).each(function(i, el) {
                                $(el).addClass("error");
                                var msgdiv = $("<span>Неверно заполнено поле " + $(el).attr("name") + "!</span>").css("color", "red").addClass("errMess").attr("name", '' + $(el).attr("name") + "sp" + '');
                                $(el).after(msgdiv);
                            });
                        }
                    }
                }

                var user = new Backendless.User();
                user.email = email.val();
                user.password = password.val();
                user.name = name.val();
                user.lastName = lastName.val();
                user.age = birth_date;
                user.gender = gender.val();
                user.avatar = 0;
                user.color = "green";

                Backendless.UserService.register(user, new Backendless.Async(userRegistered, gotError));
            });
        
            obj.find('input[type=text]').each(function(i, el) {
                $(el).focusin(function() {
                    $('span[name="' + $(this).attr("name") + "sp" + '"]').remove();
                    if ($(this).hasClass("error")) {
                        $(this).removeClass("error");
                    }
                })
            })
        }
    }
})(jQuery);