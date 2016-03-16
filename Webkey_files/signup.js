function validatePassword() {
    var pass2 = document.getElementById("inputPasswordSu").value;
    var pass1 = document.getElementById("inputConfirmPasswordSu").value;
    if (pass1 != pass2)
        document.getElementById("inputConfirmPasswordSu").setCustomValidity("Passwords don't match");
    else
        document.getElementById("inputConfirmPasswordSu").setCustomValidity('');
}

function SignupController(webkey) {
    this.APP = webkey;
    this.init();
}

SignupController.prototype = {

    APP: void 0,

    spinner: void 0,

    init: function() {
        var self = this;
        $("#inputPasswordSu").on("change", validatePassword)
        $("#inputConfirmPasswordSu").on("change", validatePassword)

        $("#loginNav").on("click", function(e) {
            e.preventDefault();
            self.APP.showView("login")
        });

        $("#signUpForm").on("submit", function(e) {
            e.preventDefault();
            var auth = {
                username: $("#inputUsernameSu").val(),
                password: $("#inputPasswordSu").val()
            };

            $("#signupContainer").children().hide()
            self.spinner = new Spinner().spin($("#signupContainer")[0]);
            $("input").val("");

            self.APP.API.sendSignUp(auth);
        });
    },

    onMessage: function(msg) {
        if (msg.type == "SIGNUP") {
            this.APP.showView("login");
        }
    },

    onError: function(err) {
        if (this.spinner != void 0) {
            $("#signupContainer").children().show()
            this.spinner.stop();
            this.spinner = void 0;
        }
        $(".webkey-error").text(err).show();
    },

    showView: function() {
        $(".webkey-error").hide();
        $("#signupContainer").show();
    },

    hideView: function() {
        if (this.spinner != void 0) {
            this.spinner.stop();
            this.spinner = void 0;
            $("#signupContainer").children().show()
        }
        $(".webkey-error").hide();
        $("#signupContainer").hide();
    }
};
