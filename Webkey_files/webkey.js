function WebkeyApp() {}
WebkeyApp.prototype = {
    views: {},

    API: void 0,

    currentView: "",

    init: function() {
        var self = this;
        this.API = new WebkeyApi();
        var proto = ('https:' == document.location.protocol ? 'wss://' : 'ws://');
//        this.API.setUrl([proto + window.location.hostname + WS_PORT])
        this.API.setUrl(['ws://10.0.0.18:8081'])

        this.addView("login", new LoginController(this));
        this.addView("signup", new SignupController(this));
        this.addView("phone", new PhoneController(this.API));
        this.addView("location", new LocationController(this.API));

        this.setNavbarState("LOGGED_OUT");
        this.showView("login");

        this.API.addHandler("AUTH", this.getView("login"));
        this.API.addHandler("SIGNUP", this.getView("signup"));

        this.API.addHandler("ARRAYBUFFER", this.getView("phone"));
        this.API.addHandler("SCREEN_OPTIONS", this.getView("phone"));
        this.API.addHandler("CONNECTED", this.getView("phone"));

        this.API.addHandler("LOCATION", this.getView("location"));


        this.API.addHandler("RESTART", {
            onMessage: function(data) {
                location.reload();
            }
        });

        this.API.addHandler("TOAST", {
            onMessage: function(data) {
                if (self.currentView != "login" && self.currentView != "signup") {
                    var opts = {
                        text: data.jsonPayload.text,
                        sticky: data.jsonPayload.sticky,
                        position: "middle-right"
                    }

                    switch (data.jsonPayload.type) {
                        case "INFO":
                            opts.type = "notice";
                            break;
                        case "WARNING":
                            opts.type = "warning";
                            break;
                        case "ERROR":
                            opts.type = "error";
                            break;
                    }
                    //$.fn.toastmessage('showToast', opts);

                } else {
                    if (data.jsonPayload.type == "ERROR")
                        self.getView(self.currentView).onError(data.jsonPayload.text);
                }
            }
        });


        $(".navbar-nav li").on("click", function() {
            $(".navbar-nav li").removeClass("active");
            $(this).addClass("active");
            self.showView(this.id.substr(0, this.id.length - 3))
        });
    },

    getView: function(name) {
        return this.views[name];
    },

    showView: function(name) {
        for (var k in this.views) {
            if (k === name) {
                if (this.currentView != name) {
                    this.views[k].showView();
                    this.currentView = name;
                }
            } else this.views[k].hideView();
        }
    },

    addView: function(name, view) {
        this.views[name] = view;
    },

    setNavbarState: function(state) {
        switch (state) {
            case "LOGGED_IN":
                $(".loggedIn").show();
                break;
            case "LOGGED_OUT":
                $(".loggedIn").hide();
                break;
        }
    }
};
