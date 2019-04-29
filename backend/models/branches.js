var models = require('../models');
module.exports = function (sequelize, DataTypes) {

    const branches = sequelize.define('branches', {
        id_br: { field: 'id_br', type: DataTypes.STRING(50), allowNull: false , primaryKey : true},
        name_br: { field: 'name_br', type: DataTypes.STRING(100)},
        token_br : { field : 'token_br', type : DataTypes.STRING(200)},
        ip_br : { field: 'ip_br', type: DataTypes.STRING(50)},
        colorbit : { field: 'colorbit', type: DataTypes.INTEGER},
        fps : { field: 'fps', type: DataTypes.INTEGER},

        b_blockbrowser : { field: 'b_blockbrowser', type: DataTypes.BOOLEAN},
        b_blockotherapps : { field: 'b_blockotherapps', type: DataTypes.BOOLEAN},
        b_blockremove : { field: 'b_blockremove', type: DataTypes.BOOLEAN},
        b_blockforcestop : { field: 'b_blockforcestop', type: DataTypes.BOOLEAN},
        thumburl_br : {field : 'thumburl_br', type: DataTypes.STRING(100)},
        os_br : {field : 'os_br', type: DataTypes.STRING(50)},
        mac_br : {field : 'mac_br', type: DataTypes.STRING(100)},
    }, {
      underscored: true,
      dateStrings: true,
      freezeTableName: true,
      timestamps: false,

      tableName: 'branches'
    });
    branches.associate = function(models) {
      branches.hasMany(models.students, {
        foreignKey : "id_br",
        onDelete : 'cascade'
      })
      branches.hasMany(models.teachers, {
        foreignKey : "id_br",
        onDelete : 'cascade'
      })
      branches.hasMany(models.managers, {
        foreignKey : "id_br",
        onDelete : 'cascade'
      })
    }
    return branches;
  };
  