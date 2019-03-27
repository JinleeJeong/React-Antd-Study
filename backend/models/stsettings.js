module.exports = function (sequelize, DataTypes) {

    const stsettings = sequelize.define('stsettings', {
        id_st: { field: 'id_st', type: DataTypes.STRING(50), allowNull: false , primaryKey : true},
        id_tc: { field: 'id_tc', type: DataTypes.STRING(50)},
        devicename : { field : 'devicename', type : DataTypes.STRING(50)},
        os : { field: 'os', type: DataTypes.STRING(50)},
        ip_st: { field: 'ip_st', type : DataTypes.STRING(50)},
        ip_tc: { field: 'ip_tc', type : DataTypes.STRING(50)},
        b_lockscreen : { field : 'b_lockscreen', type : DataTypes.BOOLEAN},
        resolution : { field: 'resolution', type: DataTypes.STRING(50)},
        b_thumb_ad: { field: 'b_thumb_ad', type: DataTypes.BOOLEAN},
        b_thumb_tc: { field: 'b_thumb_tc', type: DataTypes.BOOLEAN},
    }, {
      underscored: true,
      dateStrings: true,
      freezeTableName: true,
      timestamps: false,

      tableName: 'stsettings'
    });

    return stsettings;
  };
  