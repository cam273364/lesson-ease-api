
const mongoose = require('mongoose')

const { Schema } = mongoose;


const userSchema = new Schema({

  email: String, // String is shorthand for {type: String}
  password: String,
  firstName: String,
  bio: String,
  lastName: String,
  instructor: Boolean,
  venmo: String

  
});

const User = mongoose.model('User', userSchema);
module.exports = User;