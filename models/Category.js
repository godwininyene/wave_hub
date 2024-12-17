const {DataTypes, Model} = require('sequelize');
const sequelize = require('./../utils/sequelize');

class Category extends Model{
    static associate(models){
        Category.hasMany(models.Post, {as: 'posts'})
    }
}
Category.init(
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
    //Other Model Options
    {
        sequelize,
        modelName:"Category",
        hooks: {
            beforeValidate: (category) => {
              if (category.name) {
                category.name = category.name.toLowerCase();
              }
            }
        }
    }
);

module.exports = Category