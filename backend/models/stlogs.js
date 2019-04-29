module.exports = function (sequelize, DataTypes) {

  var utc = new Date();
  utc.setHours(utc.getHours() + 9);

  const stlogs = sequelize.define('stlogs', {
      idx: { field: 'idx', type: DataTypes.BIGINT, primaryKey : true, autoIncrement: true},
      id_st: { field: 'id_st', type: DataTypes.STRING(50)},
      id_tc : { field : 'id_tc', type : DataTypes.STRING(50)},
      id_app : { field: 'id_app', type: DataTypes.STRING(100)},
      name_app: { field: 'name_app', type: DataTypes.STRING(50)},
      logtype: { field: 'logtype', type: DataTypes.INTEGER},
      logmsg : { field : 'logmsg', type : DataTypes.STRING(500)},
      endtime : { field: 'endtime', type: DataTypes.DATE(), defaultValue : utc},
      starttime : { field: 'starttime', type: DataTypes.DATE(), defaultValue : utc},
  }, {
    underscored: true,
    dateStrings: true,
    freezeTableName: true,
    timestamps: false,

    tableName: 'stlogs'
  });
  stlogs.associate = function(models) {
    stlogs.belongsTo(models.students, {
      foreignKey : "id_st",
    })
    stlogs.belongsTo(models.applist, {
      foreignKey : "id_app",
      targetKey : "id_app"
    })
  }
  return stlogs;
};
