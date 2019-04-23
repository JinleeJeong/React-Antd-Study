var models = require('../models');
module.exports = function (sequelize, DataTypes) {

    const managers = sequelize.define('managers', {
        id_user: { field: 'id_user', type: DataTypes.STRING(50), allowNull: false , primaryKey : true},
        id_br: { field: 'id_br', type: DataTypes.STRING(100)},
        token_mgr : { field : 'token_mgr', type : DataTypes.STRING(200)},

    }, {
      underscored: true,
      dateStrings: true,
      freezeTableName: true,
      timestamps: false,

      tableName: 'managers'
    });
    managers.associate = function(models) {
      managers.belongsTo(models.branches, {
        foreignKey : "id_br",
      })
    }
    return managers;
  };
  