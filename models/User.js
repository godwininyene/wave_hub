const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/sequelize');
const bcrypt = require('bcryptjs')

class User extends Model{
    async correctPassword(candidatePassword, userPassword){
        return await bcrypt.compare(candidatePassword, userPassword)
    }
    changePasswordAfter(JWTtime){
        //User has change password
        if (this.passwordChangedAt) {
            const changeTimeStamp = new Date(this.passwordChangedAt).getTime() / 1000;
            return changeTimeStamp > JWTtime;
        }
        return false; // User has not changed password
    }
}

User.init(
    //Model Attriubtes
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
       
        name:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                notNull: { msg: 'A user must have a name' },
                notEmpty: { msg: 'A user must have a name' }
            }
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            validate: {
                notNull: { msg: 'A user must have an email' },
                isEmail: { msg: 'Please provide a valid email address' }
            },
            unique:true
        },
        photo: {
            type: DataTypes.STRING,
            defaultValue: 'default.jpg'
        },

        role: {
            type: DataTypes.ENUM('user', 'admin', 'author'), // ENUM for specific roles
            defaultValue: 'user',
            validate: {
              isIn: {
                args: [['user', 'admin', 'author']],
                msg: 'Role is either: user, admin, or author'
              }
            }
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notNull: { msg: 'Please provide your password' },
              len: {
                args: [8],
                msg: 'The password field must be at least 8 characters'
              }
            }
        },

        passwordConfirm: {
            type: DataTypes.VIRTUAL,
            allowNull: false, 
            validate: {
              notNull: { msg: 'Please confirm your password' },
              isMatch(value) {
                if (value !== this.password) {
                  throw new Error('The password confirmation does not match');
                }
              }
            }
        },

        passwordChangedAt: {
            type: DataTypes.DATE
        }
    }, 

    //Other Model Options
    {
        sequelize,
        modelName:'User',
        hooks:{
            beforeSave: async (user) => {
                // 1. Hash password if it's new or changed
                if (user.changed('password')) {
                    user.password = await bcrypt.hash(user.password, 12);
                    // // 2. Set passwordChangedAt only when updating existing users
                    if (!user.isNewRecord) {
                      user.passwordChangedAt = Date.now() - 1000;
                    }
                }
            }
        },
         // Exclude password by default in queries
        defaultScope: {
            attributes: { exclude: ['password'] }
        },
        // Custom scopes (e.g., if you want to include password in specific queries)
        scopes: {
            withPassword: {
                attributes: { include: ['password'] }
            }
        },
    }
)

User.sync({ alter: true })
.then(() => console.log('Tables created successfully!'))
.catch(error => console.error('Error creating tables:', error));
module.exports = User;