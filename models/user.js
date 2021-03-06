'use strict';
var bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    username:{
      type: DataTypes.STRING,
      allowNull: false
    },
    password:{
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6, 75],
          msg: 'Password must be between 6 and 75 characters long'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invalid email address format'
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        isNumeric: {
          msg: 'Invalid phone number format'
        },
        len: {
          args: [10,11],
          msg: 'Invalid phone number format'
        }
      },
      allowNull: false
    },
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    dob: DataTypes.DATE,
    bio: DataTypes.STRING,
    phoneverified: DataTypes.STRING,
    carrier: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: function(pendingUser, options){
        if(pendingUser && pendingUser.password){
          var hash = bcrypt.hashSync(pendingUser.password, 10);
          pendingUser.password = hash;
        }
      }
    }
  });
  user.associate = function (models) {
    models.user.hasMany(models.wallet);
  };
  user.prototype.isValidPassword = function(passwordTyped){
    return bcrypt.compareSync(passwordTyped, this.password);
  }

  user.prototype.toJSON = function(){
    var user = this.get();
    delete user.password;
    return user;
  }
  return user;
};
