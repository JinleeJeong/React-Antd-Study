var moment = require('moment');
module.exports = function (sequelize, DataTypes) {

      var utc = new Date();
      utc.setHours(utc.getHours() + 9);

      const users = sequelize.define('User', {
        Name: { field: 'Name', type: DataTypes.STRING(50), allowNull: false },
        App: { field: 'App', type: DataTypes.STRING(30), allowNull: false},
        key : { field: 'key', type: DataTypes.INTEGER, primaryKey : true, autoIncrement: true},
        Amount : { field : 'Amount', type : DataTypes.INTEGER, allowNull : true, defaultValue : 0},
        Teacher : { field : 'Teacher', type : DataTypes.STRING(50)},
        created : { field : 'created', type: DataTypes.DATE(), defaultValue: utc},
        created_at : {type: DataTypes.DATE(), defaultValue : new Date()}
      }, {
        // don't use camelcase for automatically added attributes but underscore style
        // so updatedAt will be updated_at
        underscored: true,
        dateStrings: true,
        // disable the modification of tablenames; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        freezeTableName: true,
        timestamps: true,
        // define the table's name
        tableName: 'user'
      });

      return users;
    };
    