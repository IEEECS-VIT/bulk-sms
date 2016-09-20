var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var User = require(require('path').join(__dirname, '..', 'models', 'user'));
//User Credential Addition Page Here
router.route('/').get((req, res, next)=>{
  User.find({}, (err, users)=>{
    res.json(users);
  })
});

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
        let newUser = new User({
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
      res.redirect('/users');
    }).catch(next);
  })

module.exports = router;
