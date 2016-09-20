var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var User = require(require('path').join(__dirname, '..', 'models', 'user'));

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.route('/register')
  .post((req, res, next)=>{

  })

module.exports = router;
