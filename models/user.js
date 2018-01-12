'use strict';
var bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
    var user = sequelize.define('user', {
        username: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        password: {
            type: DataTypes.TEXT,
            validate: {
                len: {
                    args: [6, 32],
                    msg: 'Password must be between 6 and 32 characters long'
                }
            }
        },
        email: {
            type: DataTypes.TEXT,
            validate: {
                isEmail: {
                    msg: 'Invalid email address format'
                }
            }
        },
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        dob: DataTypes.DATE,
        bio: DataTypes.STRING,
        phone: {
            type: DataTypes.TEXT,
            validate: {
                isNumeric: {
                    msg: 'Invalid phone number format'
                },
                len: {
                    args: [10, 11],
                    msg: 'Invalid phone number format'
                }
            },
            allowNull: false
        }
    }, {
        hooks: {
            beforeCreate: function(pendingUser, options) {
                if (pendingUser && pendingUser.password) {
                    var hash = bcrypt.hashSync(pendingUser.password, 10);
                    pendingUser.password = hash;
                }
            }
        },
        classMethods: {
            associate: function(models) {
                models.user.hasMany(models.wallet);
            }
        }
    });

    user.prototype.isValidPassword = function(passwordTyped) {
        return bcrypt.compareSync(passwordTyped, this.password);
    }

    user.prototype.toJSON = function() {
        var user = this.get();
        delete user.password;
        return user;
    }
    return user;
};