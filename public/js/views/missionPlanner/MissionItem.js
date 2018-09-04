define(function(){
 return function MissionItem(map, newType, newPosition, newIndex) {
     
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

    self.remove = function () {
        marker.setMap(null);
    }
}
});