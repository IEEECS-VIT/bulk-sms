var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next)=>{
  res.render('login', {loggedIn: req.session.user != null});
});

router.get('/senddirect', (req, res, next)=>{
  //console.log(req.session.user);
  res.render('sendDirect', {loggedIn: req.session.user != null});
});

module.exports = router;
