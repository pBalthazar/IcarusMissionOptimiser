define([
    'js/views/missionPlanner/MissionItem.js',
    'js/views/missionPlanner/MapApi.js'
], function (MissionItem, MapApi) {
    
    function MissionPlanner(view, mapDocumentElement) {
        let self = this;
        self.markerList = [];
        self.flightPath;
        self.mapInstance;
        self.actionMapType = "select";
        self.missionItemList = [];
        self.selectedMissionItem = null;

        self.initMap = function () {
            let self = this;
            self.mapInstance = new MapApi(mapDocumentElement, { lat: 41, lng: -72 }, 7);
            self.mapInstance.registerObs(this);
        }

        self.onMissionItemDrag = function (mItem) {
            self.linkMissionItemOnMap();
            notifyView(mItem.getTitle(), mItem.getPosition());
        }

        self.addMissionItem = function (myLatLng) {
            let tmpself = self;
            let mItem = new MissionItem(self.mapInstance, self.actionMapType, myLatLng, self.missionItemList.length + 1);
            mItem.register(tmpself);
            self.missionItemList.push(mItem);
            self.linkMissionItemOnMap();
            self.selectedMissionItem = mItem;
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

        self.linkMissionItemOnMap = function () {
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
        self.selectedMissionItem = mItem;
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

    MissionPlanner.prototype.onRemoveMissionItem = function () {
        let self = this;
        self.removeMissionItem(self.selectedMissionItem);
        self.linkMissionItemOnMap();
    }

    MissionPlanner.prototype.importMission = function (obj) {
        let self = this;
        if (obj instanceof Object) {
            self.resetMissionPlanner();
            let lastLatLng = null;
            if (obj.mission && obj.mission.items) {
                obj.mission.items.forEach(function(missionItem) {
                    let latLong = { lat: missionItem.params[4], lng: missionItem.params[5] }
                    self.addMissionItem(latLong);
                    lastLatLng = latLong;
                });
                if (lastLatLng) {
                    self.centerMap(lastLatLng);
                }
            }
        }
    }

    MissionPlanner.prototype.removeMissionItem = function (mItemToRemove) {
        let self = this;
        mItemToRemove.remove();
        self.missionItemList = self.missionItemList.filter(function(mItem) {
            return mItem !== mItemToRemove;
        });
    }

    MissionPlanner.prototype.resetMissionPlanner = function () {
        let self = this;
        self.missionItemList.forEach(function (mItem) {
            self.removeMissionItem(mItem);
        });
        self.linkMissionItemOnMap();
    }

    MissionPlanner.prototype.centerMap = function (latLong) {
        let self = this;
        self.mapInstance.centerMap(latLong);
    }

    return MissionPlanner;
});