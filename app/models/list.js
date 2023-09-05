

const { DataTypes, Model } = require('sequelize');
const client = require('../database');

// on fait hériter notre nouvelle classe de Model
class List extends Model {};

// on définit notre classe
List.init({

    name: DataTypes.TEXT,
    position: DataTypes.SMALLINT
}, {
    sequelize: client,
    tableName: 'list'
});


module.exports = List;