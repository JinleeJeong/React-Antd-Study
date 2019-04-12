module.exports = function (sequelize, DataTypes) {

    const tcsettings = sequelize.define('tcsettings', {
        id_tc: { field: 'id_tc', type: DataTypes.STRING(50), allowNull: false , primaryKey : true},
        token_tc : { field : 'token_tc', type : DataTypes.STRING(200)},
        thumburl_tc : { field: 'thumburl_tc', type: DataTypes.STRING(100)},
        ip_tc: { field: 'ip_tc', type : DataTypes.STRING(100)},

    }, {
      underscored: true,
      dateStrings: true,
      freezeTableName: true,
      timestamps: false,

      tableName: 'tcsettings'
    });

    tcsettings.associate = function(models) {
      tcsettings.belongsTo(models.teachers, {
        foreignKey : "id_tc",
      })
    }
    return tcsettings;
  };
  