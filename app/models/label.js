

const { DataTypes, Model } = require('sequelize');
const client = require('../database');

// on fait hériter notre nouvelle classe de Model
class Label extends Model {};

// on définit notre classe
Label.init({

    name: DataTypes.TEXT,
    color: DataTypes.STRING
}, {
    sequelize: client,
    tableName: 'label'
});


module.exports = Label;