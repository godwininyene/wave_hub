const{DataTypes, Model} = require('sequelize');
const sequelize = require('./../utils/sequelize');

class Subscriber extends Model{

}

Subscriber.init(
    //Model Attributes
    {
        name:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                notNull:{msg:"Please provide your name!"},
                notEmpty:{msg:"Name cannot be empty"}
            }
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true,
            validate:{
                notNull:{msg:"Please provide your email"},
                isEmail:{msg:"Please provide a valid email."}
            }
        }
    },
    //Other Model Options
    {
        sequelize
    }
)

// Subscriber.sync({alter:true})
// .then(() => console.log('Tables created successfully!'))
// .catch(error => console.error('Error creating tables:', error));

module.exports = Subscriber;