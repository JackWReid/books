const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new mongoose.Schema({
  publicId: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isOnboarded: {
    type: Boolean,
    required: true,
  },
  relations: {
    following: Array,
    followers: Array,
  },
  reading: {
    current: {
      dateBegan: {
        type: Date,
      },
      sentiments: {
        type: String,
      },
      bookId: {
        type: String,
      }
    },
    finished: {
      type: Array,
    }
  }
});

UserSchema.pre('save', function(callback) {
  const user = this;
  if (!user.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(error, salt) {
    if (error) return callback(error);

    bcrypt.hash(user.password, salt, null, function(error, hash) {
      if (error) return callback(error);
      user.password = hash;
      callback();
    });
  });
});

UserSchema.methods.verifyPassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(error, isMatch) {
    if (error) return callback(error);
    callback(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
