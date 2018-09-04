var moduleJS = (function () {
    var lib = {
        test: "js/views/missionPlanner/test.js",
        MissionPlanner: "js/views/missionPlanner/MissionPlanner.js",
        MissionItem: "js/views/missionPlanner/MissionItem.js",
        MapApi: "js/views/missionPlanner/MapApi.js"
    };

    function moduleJS(modules, callback) {
        var promises = [];

        modules.forEach(function(module) {

            function loadScript(module) {
            return new Promise(
                function (resolve, reject) {
                    var toLoad = lib[module];
                    if (toLoad) {
                        var scriptTag = document.createElement('script');
                        scriptTag.onload = function () {
                            //do stuff with the script
                            console.log('onload');
                            resolve(true);
                        };
                        scriptTag.src = toLoad;
                        document.head.appendChild(scriptTag);


                    } else {
                        var reason = new Error('mom is not happy');
                        reject(reason); // reject
                    }
            
                }
            );
        }
            promises.push(loadScript(module));
        });

        Promise.all(promises)
        .then(function () {
            console.log('all promises done'); 
            callback();
        })

        // var toLoad = lib[module];
        // if (!toLoad) {
        //     return undefined;
        // }

    //     // var scriptTag = document.createElement('script');
    //     // scriptTag.onload = function () {
    //     //     //do stuff with the script
    //     // };
    //     // scriptTag.src = toLoad;
    //     // document.head.appendChild(scriptTag);

    // var script = document.createElement('script');
    // script.src = toLoad;
    // script.type = "text/javascript";
    // script.async = false;                                 // <-- this is important
    // document.getElementsByTagName('head')[0].appendChild(script);

    // $.holdReady(true);
    // $.getScript(toLoad, function() {
    //      $.holdReady(false);
    // });
        // var script = $.ajax(toLoad, {
        //     complete: function (response) {
        //         var s = document.createElement('script');
        //         s.src = 'data:text/javascript,' + encodeURIComponent('alert("lorem ipsum")')
        //         document.body.appendChild(s);
        //         return eval(response.responseText);
        //     },
        //     dataType: 'text',
        //     async: false
        // })
        // return eval(script.responseText);

    }
    

    return moduleJS;
})();