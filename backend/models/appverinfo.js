module.exports = function (sequelize, DataTypes) {

    const appverinfo = sequelize.define('appverinfo', {
        idx: { field: 'idx', type: DataTypes.INTEGER, autoIncrement: true},
        version: { field: 'version', type: DataTypes.STRING(50), allowNull: false, primaryKey : true},
        type: { field: 'type', type: DataTypes.INTEGER},
        url : { field : 'url', type : DataTypes.STRING(100)},
        b_activated : { field: 'b_activated', type: DataTypes.BOOLEAN, defaultValue : false},
    }, {
      underscored: true,
      dateStrings: true,
      freezeTableName: true,
      timestamps: false,

      tableName: 'appverinfo'
    });

    return appverinfo;
  };
  