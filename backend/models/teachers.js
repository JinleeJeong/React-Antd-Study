var models = require('../models');
module.exports = function (sequelize, DataTypes) {

    var utc = new Date();
    utc.setHours(utc.getHours() + 9);

    const teachers = sequelize.define('teachers', {
        id_tc: { field: 'id_tc', type: DataTypes.STRING(50), allowNull: false , primaryKey : true},
        id_br : { field : 'id_br', type: DataTypes.STRING(50)},
        name_tc: { field: 'name_tc', type: DataTypes.STRING(50)}
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
      teachers.hasOne(models.tcsettings, {
        foreignKey : "id_tc",
      })
      teachers.belongsTo(models.branches, {
        foreignKey : "id_br",
      })
    }

    return teachers;
  };
  