module.exports = function (sequelize, DataTypes) {

    const students = sequelize.define('students', {
        id_st: { field: 'id_st', type: DataTypes.STRING(50), allowNull: false , primaryKey : true},
        name_st: { field: 'name_st', type: DataTypes.STRING(50)},
        id_tc : { field : 'id_tc', type : DataTypes.STRING(50)},
        id_br : { field: 'id_br', type: DataTypes.STRING(50)},
        token_st : { field: 'token_st', type: DataTypes.STRING(100)},
    }, {
      underscored: true,
      dateStrings: true,
      freezeTableName: true,
      timestamps: false,

      tableName: 'students'
    });

    return students;
  };
  