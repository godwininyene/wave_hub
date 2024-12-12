const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'A user must have a name']
    },
    email:{
        type:String,
        required:[true, 'A user must have an email'],
        validate:[validator.isEmail, 'Please provide a valid email address'],
        unique:true
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    role:{
        type:String,
        enum:{
            values:['user', 'admin', 'author'],
            message:'Role is either: admin or author. Got {VALUE}'
        },
        default:'user'
    },

    password:{
        type:String,
        required:[true, 'Please provide your password'],
        minlength:[8, 'The password field must be at least 8 characters.'],
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true, 'Please confirm your password'],
        validate:{
            validator:function(el){
                return el === this.password
            },
            message:'The password field confirmation does not match.'
        }
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    },
    passwordChangedAt:Date

});

//Middlewares
userSchema.pre('save', async function(next){
    //Only run this function if password is actually modified
    if(!this.isModified("password")) return next()

    // Hash the password with a cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    //Delete the passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

//Instance Methods
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changePasswordAfter = function(JWTtime){
    //User has change password
    if(this.passwordChangedAt){
        const changeTimeStamp = new Date(this.passwordChangedAt).getTime() / 1000
        return changeTimeStamp > JWTtime
    }
    //User has not change password
    return false;
}

const User = mongoose.model("User", userSchema);

module.exports = User;