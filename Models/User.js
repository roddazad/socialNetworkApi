const mongoose = require("mongoose");
const { Schema, Types } = require('mongoose');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // validate: [validateEmail, "Please put in a 
    //valid email address"],
  },
  thoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: "thought",
    },
  ],
  friends: [{
    name: String,
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}]
},
{
  toJSON: {
    virtuals: true,
  },
  id: false,
}
);

userSchema.virtual("friendCount").get(function (){
  return this.friends.length;
});

const User = mongoose.model('user', userSchema);

module.exports = User;