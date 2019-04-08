var models = require('../models');
module.exports = function (sequelize, DataTypes) {

    var utc = new Date();
    utc.setHours(utc.getHours() + 9);

    const teachers = sequelize.define('teachers', {
        id_tc: { field: 'id_tc', type: DataTypes.STRING(50), allowNull: false , primaryKey : true},
        ip_tc: { field: 'ip_tc', type: DataTypes.STRING(100)},
        token_tc : { field : 'token_tc', type : DataTypes.STRING(100)},
        name_tc: { field: 'name_tc', type: DataTypes.STRING(100)},
        thumburl_tc : { field : 'thumburl_tc', type: DataTypes.STRING(100)}
    }, {
      underscored: true,
      dateStrings: true,
      freezeTableName: true,
      timestamps: false,

      tableName: 'teachers'
    });

    teachers.associate = function(models) {
      teachers.hasMany(models.students, {
        foreignKey : "id_tc",
        onDelete : 'cascade'
      })
      teachers.belongsTo(models.branches, {
        foreignKey : "id_br",
      })
    }

    return teachers;
  };
  