'use strict';
module.exports = (sequelize, DataTypes) => {
  var wallet = sequelize.define('wallet', {
    userId: DataTypes.INTEGER,
    address: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [10, 200],
          msg: 'Invalid wallet length'
        }
      }
    },
    value: DataTypes.STRING,
    valuehistory: DataTypes.STRING,
    type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  wallet.associate = function (models) {
    models.wallet.belongsTo(models.user);
    models.wallet.hasMany(models.coin);
  };
  return wallet;
};
