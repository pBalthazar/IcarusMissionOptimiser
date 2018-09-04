define(function() {
    
    return function MapApi(mapDocumentElement, initPosition, initZoom) {
        var self = this;
        var center = initPosition; // { lat: 36.0907578, lng: -119.5948303 }
        var zoom = initZoom;
        var observers = [];
        var googleMap = new google.maps.Map(mapDocumentElement, {
            center: center,
            zoom: zoom
        });
    
        googleMap.addListener('center_changed', function () {
            observers.forEach(function (obs) {
                if (obs.onMapCenterChange) {
                    obs.onMapCenterChange();
                }
            });
        });
    
        google.maps.event.addListener(googleMap, 'click', function (event) {
            observers.forEach(function (obs) {
                if (obs.onMapClick) {
                    obs.onMapClick(event);
                }
            });
        });
    
        self.getGoogleMap = function () {
            return googleMap;
        }
    
        self.registerObs = function (obs) {
            self = this;
            observers.push(obs);
        }
    
        self.setCursor = function (type) {
            if (type == "default") {
                googleMap.set('draggableCursor', '');
            } else {
                googleMap.set('draggableCursor', 'crosshair');
            }
        }

        self.centerMap = function (latLng) {
            googleMap.setCenter(latLng); 
            googleMap.setZoom(10);
        }
    
        self.linkPoints = function (pointsList) {
            self = this;
            var flightPath = new google.maps.Polyline({
                path: pointsList,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
    
            flightPath.setMap(googleMap);
    
            return flightPath;
        }
    }
});