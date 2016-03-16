function LoginController(webkey) {
    this.APP = webkey;
    this.init();
}

LoginController.prototype = {

    API: void 0,

    spinner: void 0,

    init: function() {
        var self = this;

        $("#loginForm").on("submit", function(e) {
            e.preventDefault();
            var auth = {
                username: $("#inputUsername").val(),
                password: $("#inputPassword").val()
            };

            $("#loginContainer").children().hide()
            self.spinner = new Spinner().spin($("#loginContainer")[0]);
            $("input").val("");

            self.APP.API.sendAuth(auth);
        });

        $("#signupNav").on("click", function(e) {
            e.preventDefault();
            self.APP.showView("signup");
        });
    },

    onMessage: function(msg) {
        if (msg.type == "AUTH") {
            this.APP.setNavbarState("LOGGED_IN");
            this.APP.showView("phone");
        }
    },

    onError: function(err) {
        if (this.spinner != void 0) {
            $("#loginContainer").children().show()
            this.spinner.stop();
            this.spinner = void 0;
        }
        $(".webkey-error").text(err).show();
    },

    showView: function() {
        $(".webkey-error").hide();
        $("#loginContainer").show();
    },

    hideView: function() {
        if (this.spinner != void 0) {
            $("#loginContainer").children().show()
            this.spinner.stop();
            this.spinner = void 0;
        }
        $(".webkey-error").hide();
        $("#loginContainer").hide();
    }
};
