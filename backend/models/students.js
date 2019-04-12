module.exports = function (sequelize, DataTypes) {

    const students = sequelize.define('students', {
        id_st: { field: 'id_st', type: DataTypes.STRING(50), allowNull: false , primaryKey : true},
        name_st: { field: 'name_st', type: DataTypes.STRING(100)},
        id_tc : { field : 'id_tc', type : DataTypes.STRING(50)},
        id_br : { field: 'id_br', type: DataTypes.STRING(50)},
    }, {
      underscored: true,
      dateStrings: true,
      freezeTableName: true,
      timestamps: false,

      tableName: 'students'
    });

    students.associate = function(models) {
      students.belongsTo(models.branches, {
        foreignKey : "id_br",
      })
      students.belongsTo(models.teachers, {
        foreignKey : "id_tc",
      })
      students.hasOne(models.stsettings, {
        foreignKey : "id_st",
      })
      students.hasMany(models.stlogs, {
        foreignKey : "id_st",
      })
    }
  
    return students;
  };
  