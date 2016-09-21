var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next)=>{
  //console.log(req.session.user);
  res.render('details');
});

router.get('/sendDirect', (req, res, next)=>{
  //console.log(req.session.user);
  res.render('sendDirect');
});

module.exports = router;
