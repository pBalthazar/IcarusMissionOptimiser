const util = require('util');
const request = require('request');

exports.getMissionPlanner = (req, res) => {
  res.render('missionPlanner/missionPlanner2', {
    title: 'Mission Planning',
    google_map_api_key: process.env.GOOGLE_MAP_API_KEY
  });
};
