'use strict';
module.exports = (sequelize, DataTypes) => {
  var wallet = sequelize.define('wallet', {
    userId: DataTypes.INTEGER,
    address: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.wallet.belongsTo(models.user);
        models.wallet.hasMany(models.coin);
      }
    }
  });
  return wallet;
};