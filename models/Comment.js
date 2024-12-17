const{DataTypes, Model} = require('sequelize');
const sequelize = require('./../utils/sequelize');

class Comment extends Model{
    static associate(models) {
        Comment.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
    }
}

Comment.init(
    //Model Attributes
    {
        author:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                notNull: { msg: "Please provide your name." },
                notEmpty: { msg: 'Name cannot be empty!' }
            }
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                notNull: { msg: "Please provide your email." },
                notEmpty: { msg: 'Email cannot be empty!' },
                isEmail: { msg: 'Please provide a valid email address' }
            },
        },
        comment:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                notNull: { msg: "Please provide your email." },
                notEmpty: { msg: 'Email cannot be empty!' },
            }
        },
        postId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate:{
                notNull: { msg: 'Comment  must belong to a post.'},
                notEmpty: { msg: 'Comment cannot be empty!' },
            }
        },
        status:{
            type:DataTypes.ENUM('pending', 'approved', 'disapproved'),
            defaultValue:'pending',
            validate:{
                isIn:{
                    args:[['pending', 'approved', 'disapproved']],
                    msg:'Invalid status. Must be one of: pending, approved, disapproved'
                }
            }
        }
    },
    //Other model options
    {
        sequelize,
        modelName:"Comment"
    }
);
module.exports = Comment;
