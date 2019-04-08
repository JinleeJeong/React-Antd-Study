module.exports = function (sequelize, DataTypes) {

      const applist = sequelize.define('applist', {
        idx: { field: 'idx', type: DataTypes.INTEGER, primaryKey : true, autoIncrement: true},
        id_app: { field: 'id_app', type: DataTypes.STRING(100), allowNull: false, unique: true},
        name_app: { field: 'name_app', type: DataTypes.STRING(50)},
        b_ingang : { field : 'b_ingang', type : DataTypes.BOOLEAN, defaultValue : false},
        b_disabled : { field: 'b_disabled', type: DataTypes.BOOLEAN, defaultValue : true},
      }, {
        underscored: true,
        dateStrings: true,
        freezeTableName: true,
        timestamps: false,

        tableName: 'applist'
      });

      return applist;
    };
    