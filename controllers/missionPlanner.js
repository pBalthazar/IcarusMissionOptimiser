const util = require('util');
const request = require('request');
var PythonShell = require('python-shell');
// setup a default "scriptPath"
PythonShell.defaultOptions = { scriptPath: 'pythonScript/' };

exports.getMissionPlanner = (req, res) => {
  res.render('missionPlanner/missionPlanner2', {
    title: 'Mission Planning',
    google_map_api_key: process.env.GOOGLE_MAP_API_KEY
  });
};

exports.executePython = (req, res) => {

  console.log('Executing Python Script...');

  var options = {
    mode: 'json',
    pythonOptions: ['-u'],
    args: ['value1', 'value2', 'value3']
  };

  console.log('Executing Python Script...');
  PythonShell.run('script1.py', options, function (err, results) {
    if (err) throw err;
    console.log('Finished!!');
    console.log('results: %j', results[0]);
    var qq = results[0];
    console.log(qq.result1);
  });
};
