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
  credentialsStored: [{
    phone: Number,
    password: {type: String, required: true}
  }], /* Credentials Array*/
});
User.methods.comparePassword = function(enteredPassword){
  return (bcrypt.compareAsync(enteredPassword, this.password))
};
User.pre('save', function(next){
  var user = this;
  if(!user.isModified('password'))
    return next();
  bcrypt.genSaltAsync(SALT)
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
