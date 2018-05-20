const MissionItem = moduleJS('MissionItem')
const MapApi = moduleJS('MapApi');

this.MissionPlanner = function (view, mapDocumentElement) {
    let self = this;
    self.markerList = [];
    self.flightPath;
    self.mapInstance;
    self.actionMapType = "select";
    self.missionItemList = [];

    self.initMap = function () {
        let self = this;
        self.mapInstance = new MapApi(mapDocumentElement, { lat: 41, lng: -72 }, 7);
        self.mapInstance.registerObs(this);
    }

    self.onMissionItemDrag = function (mItem) {
        linkMissionItemOnMap();
        notifyView(mItem.getTitle(), mItem.getPosition());
    }

    self.addMissionItem = function (myLatLng) {
        let tmpself = self;
        let mItem = new MissionItem(self.mapInstance, self.actionMapType, myLatLng, self.missionItemList.length + 1);
        mItem.register(tmpself);
        self.missionItemList.push(mItem);
        linkMissionItemOnMap();
        notifyView(mItem.getTitle(), mItem.getPosition());
    }

    self.notify = function (v1, v2) {
        let self = this;
        notifyView(v1, v2);
    }

    function notifyView(v1, v2) {
        let self = this;
        view.update(v1, v2);
    }

    function linkMissionItemOnMap() {
        let markerListCoordinates = [];

        self.missionItemList.forEach(function (m) {
            markerListCoordinates.push(m.getPosition());
        });

        if (self.flightPath) {
            self.flightPath.setMap(null);
        }

        self.flightPath = self.mapInstance.linkPoints(markerListCoordinates);
    }
}

MissionPlanner.prototype.onMapClick = function (event) {
    let self = this;
    let lat = event.latLng.lat();
    let long = event.latLng.lng();
    let myLatLng = { lat: lat, lng: long };

    if (self.actionMapType != "select") {
        self.addMissionItem(myLatLng);
    }
}

MissionPlanner.prototype.onMissionItemClick = function (mItem) {
    let self = this;
    self.notify(mItem.getTitle(), mItem.getPosition());
}

MissionPlanner.prototype.onMarkerClick = function (marker) {
    let self = this;
    self.notify(marker.title, marker.position());
}

MissionPlanner.prototype.onMapCenterChange = function () {
    console.log("Center of the map changed!");
}

MissionPlanner.prototype.onSelectType = function () {
    let self = this;
    self.actionMapType = "select";
    self.mapInstance.setCursor('default');
}

MissionPlanner.prototype.onLandType = function () {
    let self = this;
    self.actionMapType = "land";
    self.mapInstance.setCursor('crosshair');
}

MissionPlanner.prototype.onTakeoffType = function () {
    let self = this;
    self.actionMapType = "takeoff";
    self.mapInstance.setCursor('crosshair');
}

MissionPlanner.prototype.onWaypointType = function () {
    let self = this;
    self.actionMapType = "waypoint";
    self.mapInstance.setCursor('crosshair');
}

MissionPlanner.prototype.onChargeType = function () {
    let self = this;
    self.actionMapType = "charge";
    self.mapInstance.setCursor('crosshair');
}