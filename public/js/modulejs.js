var moduleJS = (function () {
    var lib = {
        test: "js/views/missionPlanner/test.js",
        MissionPlanner: "js/views/missionPlanner/MissionPlanner.js",
        MissionItem: "js/views/missionPlanner/MissionItem.js",
        MapApi: "js/views/missionPlanner/MapApi.js"
    };

    function moduleJS(module) {
        var toLoad = lib[module];
        if (!toLoad) {
            return undefined;
        }

        var script = $.ajax(toLoad, {
            complete: function (response) {
                return eval(response.responseText);
            },
            dataType: 'text',
            async: false
        })
        return eval(script.responseText);
    }

    return moduleJS;
})();