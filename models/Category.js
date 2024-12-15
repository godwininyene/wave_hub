const {DataTypes} = require('sequelize');
const sequelize = require('./../utils/sequelize');
const Post = require('./../models/Post')

const Category = sequelize.define("Category", 
    //Model Attributes
    {
        name:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                notNull:{msg: 'A category must have a name'}
            },
            unique:true
        }
    },
    //Other model options
    {
        hooks: {
            beforeValidate: (category) => {
              if (category.name) {
                category.name = category.name.toLowerCase();
              }
            }
        }
    }
);
//Associations
// Category.hasMany(Post);
module.exports = Category