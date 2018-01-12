'use strict';
module.exports = (sequelize, DataTypes) => {
  var coin = sequelize.define('coin', {
    walletId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    owned: DataTypes.STRING,
    purchasedate: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.coin.belongsTo(models.wallet);
      }
    }
  });
  return coin;
};