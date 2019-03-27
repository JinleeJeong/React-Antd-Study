module.exports = function (sequelize, DataTypes) {

    const branches = sequelize.define('branches', {
        id_br: { field: 'id_br', type: DataTypes.STRING(50), allowNull: false , primaryKey : true},
        name_br: { field: 'name_br', type: DataTypes.STRING(100)},
        token_br : { field : 'token_br', type : DataTypes.STRING(100)},
        ip_br : { field: 'ip_br', type: DataTypes.STRING(50)},
        colorbit : { field: 'colorbit', type: DataTypes.INTEGER},
        fps : { field: 'fps', type: DataTypes.INTEGER},

        b_blockbrowser : { field: 'b_blockbrowser', type: DataTypes.BOOLEAN},
        b_blockotherapps : { field: 'b_blockotherapps', type: DataTypes.BOOLEAN},
        b_blockremove : { field: 'b_blockremove', type: DataTypes.BOOLEAN},
        b_blockforcestop : { field: 'b_blockforcestop', type: DataTypes.BOOLEAN},

    }, {
      underscored: true,
      dateStrings: true,
      freezeTableName: true,
      timestamps: false,

      tableName: 'branches'
    });

    return branches;
  };
  