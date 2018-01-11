'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    username: DataTypes.TEXT,
    password: DataTypes.TEXT,
    email: DataTypes.TEXT,
    phone: DataTypes.TEXT,
    firstname: DataTypes.TEXT,
    lastname: DataTypes.TEXT,
    dob: DataTypes.DATE,
    bio: DataTypes.TEXT,
    following: DataTypes.TEXT,
    followers: DataTypes.TEXT,
    currencies: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  user.prototype.toJSON = function(){
    var user = this.get();
    return user;
  }
  return user;
};