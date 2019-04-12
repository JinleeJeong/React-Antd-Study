module.exports = function (sequelize, DataTypes) {

    const stsettings = sequelize.define('stsettings', {
        id_st: { field: 'id_st', type: DataTypes.STRING(50), allowNull: false , primaryKey : true},
        devicename : { field : 'devicename', type : DataTypes.STRING(50)},
        os : { field: 'os', type: DataTypes.STRING(50)},
        ip_st: { field: 'ip_st', type : DataTypes.STRING(50)},
        ip_tc: { field: 'ip_tc', type : DataTypes.STRING(50)},
        b_lockscreen : { field : 'b_lockscreen', type : DataTypes.BOOLEAN},
        resolution : { field: 'resolution', type: DataTypes.STRING(50)},
        no_st : { field: 'no_st', type: DataTypes.INTEGER},
        token_st : { field: 'token_st', type: DataTypes.STRING(200)},
        osver : { field: 'osver', type: DataTypes.STRING(50)},
    }, {
      underscored: true,
      dateStrings: true,
      freezeTableName: true,
      timestamps: false,

      tableName: 'stsettings'
    });

    stsettings.associate = function(models) {
      stsettings.belongsTo(models.students, {
        foreignKey : "id_st",
      })
    }
    return stsettings;
  };
  