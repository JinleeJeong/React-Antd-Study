module.exports = function (sequelize, DataTypes) {

    var utc = new Date();
    utc.setHours(utc.getHours() + 9);

    const loginlogs = sequelize.define('loginlogs', {
        idx: { field: 'idx', type: DataTypes.STRING(100), allowNull: false , primaryKey : true},
        id_login: { field: 'id_login', type: DataTypes.STRING(50), allowNull: false},
        logintime : { field : 'logintime', type : DataTypes.DATE(), defaultValue : utc},
        logouttime : { field: 'logouttime', type: DataTypes.DATE(), defaultValue : utc},
    }, {
      underscored: true,
      dateStrings: true,
      freezeTableName: true,
      timestamps: false,

      tableName: 'loginlogs'
    });

    return loginlogs;
  };
  