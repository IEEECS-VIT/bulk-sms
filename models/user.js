var mongoose = require('mongoose');
var Promise = require('bluebird');
var bcrypt;
if(process.platform == 'win32'){
  bcrypt = Promise.promisifyAll(require('bcryptjs'));
} else{
  bcrypt = Promise.promisifyAll(require('bcrypt'));
}

var SALT = 2;

var User = new mongoose.Schema({
  _id: String, //email of the user
  password: {type: String, required: true},
  name: String,
  phone: Number,
  credentialsStored: Array, /* of _ids of each credential,
                          credential being the phone and pwd
                          of the Way2SMS numbers */
});
User.methods.comparePassword = function(enteredPassword){
  return (bcrypt.compareAsync(enteredPassword, this.password))
};
User.pre('save', (next)=>{
  var user = this;
  if(!user.isModified('password'))
    return next();

  bcrypt.getSaltAsync(SALT)
  .then((salt)=>{
    return bcrypt.hashAsync(user.password, salt);
  })
  .then((hash)=>{
    user.password = hash;
    next();
  })
  .catch(next);
});

module.exports = mongoose.model('User', User);
