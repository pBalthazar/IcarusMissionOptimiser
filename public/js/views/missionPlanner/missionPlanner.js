// script.js
console.log('You are awesome');

function MissionItem(map, newType, newPosition, newIndex) {
    self = this;
    var instance = this;
    var observers = [];
    var type = newType;
    var position = newPosition;
    var index = newIndex;

    var marker = new google.maps.Marker({
        position: position,
        map: map.getGoogleMap(),
        title: type,
        label: String(index),
        draggable: true
        })
    
    marker.addListener('click', function(){
        observers.forEach(function(obs) {
            if(obs.onMissionItemClick) {
                obs.onMissionItemClick(instance);
            }
        });
    });

    marker.addListener('drag', function(event){
        position = {lat: event.latLng.lat(), lng: event.latLng.lng()};
        observers.forEach(function(obs) {
            if(obs.onMissionItemDrag) {
                obs.onMissionItemDrag(instance);
            }
        });
    });

    self.register = function(obs) {
        observers.push(obs);
    }

    self.getTitle = function() {
        return type;
    }

    self.getPosition = function() {
        return position;
    }
}

function MapApi(mapDocumentElement, initPosition, initZoom) {
    self = this;

    var center = initPosition; // { lat: 36.0907578, lng: -119.5948303 }
    var zoom = initZoom;
    var observers = [];

    var googleMap = new google.maps.Map(mapDocumentElement, {
        center: center,
        zoom: zoom 
    });

    googleMap.addListener('center_changed', function() {
        observers.forEach(function(obs) {
            if(obs.onMapCenterChange) {
                obs.onMapCenterChange();
            }
          });
    });

    google.maps.event.addListener(googleMap, 'click', function(event){
        observers.forEach(function(obs) {
            if(obs.onMapClick) {
                obs.onMapClick(event);
            }
          });
    });

    self.getGoogleMap = function() {
        return googleMap;
    }

    self.registerObs = function (obs) {
        self = this;
        observers.push(obs);
    }

    self.setCursor = function(type) {
        if(type == "default") {
            googleMap.set('draggableCursor', '');
        } else {
            googleMap.set('draggableCursor', 'crosshair');
        }
    }

    self.linkPoints = function(pointsList) {
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

function MissionPlanner(view, mapDocumentElement) {
    self = this;
    self.markerList = [];

    var flightPath;
    var mapInstance;
    var actionMapType = "select";
    var missionItemList = [];

    self.initMap = function () {
        self= this;
        mapInstance = new MapApi(mapDocumentElement, { lat: 41, lng: -72 }, 7);
        mapInstance.registerObs(this);
    }    

    self.onMapCenterChange = function() {
        // do nothing
    }

    self.onMapClick = function(event) {
        self= this;
        var lat = event.latLng.lat();
        var long = event.latLng.lng();
        var myLatLng = {lat: lat, lng: long};
 
        if(actionMapType != "select"){
            addMissionItem(myLatLng);
        }
    }

    self.onSelectType = function(){
        self= this;
        actionMapType = "select";
        mapInstance.setCursor('default');
    }

    self.onLandType = function(){
        self= this;
        actionMapType = "land";
        mapInstance.setCursor('crosshair');
    }

    self.onTakeoffType = function(){
        self= this;
        actionMapType = "takeoff";
        mapInstance.setCursor('crosshair');
    }

    self.onWaypointType = function(){
        self= this;
        actionMapType = "waypoint";
        mapInstance.setCursor('crosshair');
    }

    self.onChargeType = function(){
        self= this;
        actionMapType = "charge";
        mapInstance.setCursor('crosshair');
    }

    self.onMarkerClick = function(marker) {
        self= this;
        notifyView(marker.title, marker.position());
    }

    self.onMarkerDrag = function(marker) {
        self = this;
        refreshPathDrawing();
        notifyView(marker.title, marker.position());
    }

    self.onMissionItemClick = function(mItem) {
        console.log("onMissionItemClick");
        notifyView(mItem.getTitle(), mItem.getPosition());
    }

    self.onMissionItemDrag = function(mItem) {
        linkMissionItemOnMap();
        notifyView(mItem.getTitle(), mItem.getPosition());
    }

    function addMissionItem(myLatLng) {
        tmpself = self;
        var mItem = new MissionItem(mapInstance, actionMapType, myLatLng, missionItemList.length+1);
        mItem.register(tmpself);
        missionItemList.push(mItem);
        linkMissionItemOnMap();
        notifyView(mItem.getTitle(), mItem.getPosition());
    }

    function linkMissionItemOnMap () {
        var markerListCoordinates = [];
        
        missionItemList.forEach(function(m) {
            markerListCoordinates.push(m.getPosition());
        });

        if (flightPath) {
            flightPath.setMap(null);
        }

        flightPath = mapInstance.linkPoints(markerListCoordinates);
    }

    function notifyView(v1, v2) {
        self = this;
        view.update(v1, v2);
    }
}
