var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('resource');
});


/**
 * Get All
 */
router.get('/all', function(req, res, next) {
  res.send({
    replays: [ {
      name: "Tiago",
      wins: "100",
      losses: 5
    }, {
      name: "Julian",
      wins: "100",
      losses: 5
    }]
  });
});


module.exports = router;
