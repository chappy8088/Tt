function LocationController(webkeyApi) {
    this.API = webkeyApi;
}

LocationController.prototype = {
    API: void 0,

    map: void 0,

    marker: void 0,

    init: function() {
        var MAP_ID = "map";

        if (this.map != void 0) {
            this.map.remove();
            this.map = void 0;
            this.marker = void 0;
        }

        var h = $(window).height(), offsetTop = 50; // Calculate the top offset
        $('#' + MAP_ID).css('height', (h - offsetTop));


        this.map = L.map(MAP_ID, {
            center: [20.0, 5.0],
            minZoom: 2,
            zoom: 2
        });

        L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
            subdomains: ['otile1', 'otile2', 'otile3', 'otile4']
        }).addTo(this.map);


        // ========= TESTING =============
        // var self = this;
        // var mockLocation = function() {
        //     self.setMarker(40 + Math.floor(Math.random() * 10), 40 + Math.floor(Math.random() * 10));
        //     setTimeout(mockLocation, 1000);
        // }
        // mockLocation();
        // ===============================
    },

    onMessage: function(msg) {
        this.setMarker(msg.jsonPayload.lat, msg.jsonPayload.lon);
    },

    onError: function(err) {

    },

    setMarker: function(lat, lon) {
        if (this.marker == void 0) {
            this.marker = L.marker([lat, lon]).addTo(this.map);
            this.map.setZoomAround([lat, lon], 14)
            this.map.panTo([lat, lon])
        } else {
            this.marker.setLatLng([lat, lon]);
        }
    },

    showView: function() {
        $("#locationContainer").show();
        this.init();
        this.API.startLocation();
    },

    hideView: function() {
        $("#locationContainer").hide();
        this.API.stopLocation();
    }
};
