app.currentModule = (function($) {

    var config = {
        url: 'https://api.backendless.com/v1/data/Users',
        id: 'DCE54221-04BE-2940-FF08-14B2BC0FFC00',
        key: 'E8FCB4B6-2D60-EA57-FF4B-2880988EE300',
        v: 'v1'
    }

    return {
        init: function(obj, callback) {
            console.log("Инициализируем модуль для формы");
            obj = obj || new Object(null);
            callback = callback || function() {
                return false;
            }

            Backendless.initApp(config.id, config.key, config.v);

            var dp = obj.find("#datepicker");
            dp.datepicker({
                dateFormat: 'dd.mm.yy',
                changeYear: true,
                yearRange: "1920:" + new Date().getFullYear()
            });
             
            var otool = obj.find("label");

            $(otool).tooltip({
                    // position: {
                    // my: "right",
                    // at: "right+5 top-5",
                    // collision: "none",
                    
                    // },
                    track: true
            });


            

            var email = obj.find("#reglog");
            var password = obj.find("#regpass");
            var name = obj.find("#fname");
            var lastName = obj.find("#lname");
            var age = obj.find("#datepicker");
            var gender = obj.find("input[type=radio]");


            obj.find("#registrBtn").click(function(e) {
                e.preventDefault();
                Backendless.initApp(config.id, config.key, config.v);

                var d = dp.val();
                var birth_date = d.split('.');
                birth_date = new Date(birth_date[2], birth_date[1] - 1, birth_date[0]);
                birth_date = birth_date.getTime();
                
                var gen_der;
                $(gender).each(function(i, el) {
                    if(el.checked){
                        gen_der = el.value;
                    }
                });

                var e_mail = /^[?0-9a-zA-Z_-]+@\w+\.\w{2,}(\.\w{2,})*$/gi.test(email.val());



                function userRegistered(user) {
                    alert("User has been registered! Please log in.");
                    obj.find('input[type=text]').each(function(i, el) {
                        $(el).val("");
                    });
                    location = "#/";
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

                        if (!e_mail) {
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
                        if (!gen_der) {
                            exFields.push(obj.find("#gender"));
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
                                // $(el).addClass("error");
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
                user.gender = gen_der;
                user.avatar = 0;
                user.color = "green";



                Backendless.UserService.register(user, new Backendless.Async(userRegistered, gotError));
            })
            console.log();
            obj.find('input').each(function(i, el) {
                $(el).focusin(function() {
                    $('span[name="' + $(this).attr("name") + "sp" + '"]').remove();
                    if ($(this).hasClass("error")) {
                        $(this).removeClass("error");
                    }
                })
            })
            // $(otool).each(function(i, el) {
            //     $(el).focusin(function() {
            //         console.log($(this).attr("title"));
            //     })
            // })
            
        }
    }
})(jQuery);