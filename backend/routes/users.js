var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('resource');
});


/**
 * Returns all users
 */
router.get('/all', function(req, res, next) {
  res.send({
    users: [ {
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
