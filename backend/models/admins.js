module.exports = function (sequelize, DataTypes) {

    var admins = sequelize.define('admins', {
      idx: { field: 'idx', type: DataTypes.INTEGER, allowNull: false },
      id_ad: { field: 'id_ad', type: DataTypes.STRING, primaryKey : true, allowNull: false},
      name_ad : { field: 'name_ad', type: DataTypes.STRING, },
      token_ad : {field : 'token_ad', type : DataTypes.STRING},
    }, {
      underscored: true,
      dateStrings: true,
      timestamps: false,

      tableName: 'admins'
    });

    return admins;
  };
  