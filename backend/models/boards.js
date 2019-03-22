module.exports = function (sequelize, DataTypes) {
  // function formatDate(date) {
  //   var hours = date.getHours()+5;
  //   var minutes = date.getMinutes();
  //   hours = hours % 12;
  //   hours = hours ? hours : 12; // the hour '0' should be '12'
  //   minutes = minutes < 10 ? '0'+minutes : minutes;
  //   var strTime = hours + ':' + minutes;
  //   return date.getMonth()+1 + "/" + date.getDate()+1 + "/" + date.getFullYear() + "  " + strTime;
  // }
  // var d = new Date();
  // var e = formatDate(d);
 

    const boards = sequelize.define('Board', {
      Name: { field: 'Name', type: DataTypes.STRING(50), allowNull: false },
      App: { field: 'App', type: DataTypes.STRING(30), allowNull: false},
      key : { field: 'key', type: DataTypes.INTEGER, primaryKey : true, autoIncrement: true},
    }, {
      // don't use camelcase for automatically added attributes but underscore style
      // so updatedAt will be updated_at
      underscored: true,
      // disable the modification of tablenames; By default, sequelize will automatically
      // transform all passed model names (first parameter of define) into plural.
      // if you don't want that, set the following
      freezeTableName: true,
      timestamps: true,
      dateStrings: true,
      typeCast: true,
      // define the table's name
      tableName: 'board',
      
    });
    
    return boards;
  };
  