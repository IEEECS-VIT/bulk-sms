var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var User = require(require('path').join(__dirname, '..', 'models', 'user'));
var passport = require('passport');
var requestify = require('requestify');
var smsHistory = require(require('path').join(__dirname, '..', 'models', 'smsHistory'));

router.route('/register')
  .post((req, res, next)=>{
    Promise.try(()=>{
      /*var phoneRegex = new RegExp('^[789]\d{9}');
      var emailRegex = new RegExp('^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$');
      console.log(emailRegex.test(req.body.email));
      console.log(phoneRegex.test(req.body.phone));
      if(phoneRegex.test(req.body.phone) && emailRegex.test(req.body.email))*/
        return true;
      /*else{
        var error = 'Invalid Phone Number or Email';
        error.status = 403;
        throw error;
      }*/

    }).then((response)=>{
      if(response){
        var newUser = new User({
          _id: req.body.email,
          password: req.body.password,
          name: req.body.name,
          phone: req.body.phone,
          credentialsStored: []
        })
        return Promise.all([
          newUser.save()
        ])
      }
    }).then(()=>{
      res.render('login', {loggedIn: req.session.user !== null});
    }).catch(next);
  })

router.route('/login')
  .post(passport.authenticate('local',{failureRedirect: '/'}), (req ,res, next)=>{
    req.session.user = req.user;
    res.redirect('/');
  });
router.route('/logout')
  .get((req, res, next)=>{
    req.logout();
    res.clearCookie();
    req.session.user = req.user;
    return res.redirect('/');
  })

router.route('/addcredentials')
  .get((req, res, next)=>{
    if(req.session.user)
      res.render('details', {loggedIn: req.session.user !== null});
    else {
      var error = new Error('Not Logged In!');
      error.status = 401;
      throw error;
    }
  })
  .post((req, res, next)=>{
    var user = req.session.user;
    for(var i = 0;i<req.body.length; i++){
      var phonei = req.body['user' + (i+1)];
      var pwdi = req.body['pwd' + (i+1)];
      var credentials = {
        'phone': phonei,
        'password': pwdi
      }
      User.update({_id: user._id}, {$push: {'credentialsStored': credentials}}, {'new': true}, function(err, added){
        if(err){
          console.log(err);
        } else{
          console.log('Pushed');
        }
      });
    }
    res.send('Credentials Stored');
  })
router.get('/viewcredentials', (req, res, next)=>{
  User.findById(req.session.user._id, (err, user)=>{
    if(err){
      console.log(err);
    } else{
      res.render('viewcredentials', {loggedIn: req.session.user !== null, credentials: user.credentialsStored});
    }
  })
})

router.route('/sendsms')
  .get((req, res, next)=>{
    if(req.session.user != null){
      res.render('sendsms', {loggedIn: true});
    } else{
      var error = new Error('Not Logged In!');
      error.status = 401;
      throw error;
    }
  })
  .post((req, res, next)=>{
    if(req.session.user){
      var user = req.session.user;
      var credentials = user.credentialsStored;
      var message = req.body.message;
      var recipientsList = req.body.recipientsList.split(',');
      var smsPerAccount = recipientsList.length / credentials.length;
      if(smsPerAccount > 25){
        res.send('Free Quota Violation. Please Add More Credentials And Try Again!');
      }
      var index = 0;
      for(var i=0;i<credentials.length;i++){
        requestify.post('https://way2smsapi.herokuapp.com/send', {
          'username': credentials[i].phone,
          'password': credentials[i].password,
          'mobile': recipientsList.slice(index, index + smsPerAccount),
          'message': message
        })
        .then(function(response){
          response.getBody();
          console.log(response);
        })
        .catch(next);
        index += smsPerAccount;
      }
      var smsData = new smsHistory({
        sentFrom: req.session.user._id,
        recipients: recipientsList,
        when: new Date(),
        message: req.body.message
      })
      smsData.save();
      /*var remainingSMS = [];
      for(var i in credentials){
        requestify.post('https://way2smsapi.herokuapp.com/login', {
          'username': credentials[i].phone,
          'password': credentials[i].password
        })
        .then(function(response){
          var resp = JSON.stringify(eval('('+response.body+')'));
          resp = JSON.parse(resp);
          if(resp.message === "Logged In Successfully"){
            remainingSMS.push(25 - (+resp.sent));
          }
        })
        .catch(next);
      }*/
      //res.send(remainingSMS);
    }
    else {
      var error = new Error('Not Logged In!');
      error.status = 401;
      throw error;
    }
  })
module.exports = router;
