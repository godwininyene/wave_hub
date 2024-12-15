const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken')
// const User = require('../models/userModel');
const User = require('./../models/User')
const AppError = require('../utils/appError');
const {promisify} = require('util') 

const signToken = user =>{
    return jwt.sign({id:user.id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRESIN
    })
}

const createSendToken = (user, req, res, statusCode)=>{
    const token = signToken(user);

    const cookieOption = {
        httpOnly:true,
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRESIN * 24 * 60 * 60 * 1000)

    }
    // Set 'secure' flag in production or if the request is secure
    if (process.env.NODE_ENV === 'production' || req.secure) {
        cookieOption.secure = true;
    }
    //Send the cookie
    res.cookie('jwt', token, cookieOption);

    //Remove Password from output
    user.password = undefined;
    user.passwordConfirm = undefined;

    res.status(statusCode).json({
        status:"success",
        token,
        data:{
            user
        }
    })
}


exports.signup = catchAsync(async(req, res, next)=>{   
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    createSendToken(user, req, res, 201)
});

exports.login = catchAsync(async(req, res, next)=>{
    //1) Get POSTed email and password
    const{email, password} = req.body;

    // 2) Check if there is email and password
    if(!email || !password){
        return next(new AppError('Please provide email and password', '', 401))
    }

    // 3) Check if user exist and passord is correct
    // const user = await User.findOne({email: email}).select('+password');
    const user = await User.scope('withPassword').findOne({
        where: { email }
    });

    if( !user || !(await user.correctPassword(password, user.password))){
        return next(new AppError("Password or email is incorrect", '', 401))
    }

    // 4) Everything is okay, send token to client
    createSendToken(user, req, res, 200)
});

exports.logout = (req, res, next)=>{
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly:true
    });
    res.status(200).json({status: 'success'})
}

exports.protect = catchAsync(async(req, res, next) =>{
    // 1) Get token and check if it there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }else if(req.cookies.jwt){
        token = req.cookies.jwt;
    }

    if(!token){
        return next(new AppError('You are not log in! Please log in to get access', '', 401))
    }

    // 2) validate token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  
    // 3) Check if user still exist
    // const currentUser = await User.findById(decoded.id)
    const currentUser = await User.findByPk(decoded.id);
    if(!currentUser){
        return next(new AppError('The user belonging to this token does no longer exist.', '', 401))
    }

    // 4) Check if user change password after token was issued
   if( currentUser.changePasswordAfter(decoded.iat)){
    return next(new AppError('User recently changed password. Please log in again.', '', 401))
   }

    //GRANT ACCESS TO  PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
});

exports.isLoggedIn = async(req, res, next) =>{
    if(req.cookies.jwt){
        try{
            // 1) verify token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
        
            // 2) Check if user still exist
            // const currentUser = await User.findById(decoded.id)
            const currentUser = await User.findByPk(decoded.id)
            if(!currentUser){
                return next()
            }

            // 3) Check if user change password after token was issued
            if( currentUser.changePasswordAfter(decoded.iat)){
                return next()
            }
            //THERE IS A LOGGED IN USER
            res.locals.user = currentUser;
            
            return next();
        }catch(err){
            return next()
        }
    }
    next();
};

exports.protectAdminPages = (req, res, next)=>{
    if(!res.locals.user) return res.redirect('/login?message=You must login to continue');
    next();
}

exports.restrictTo = (...roles)=>{
    return(req, res, next)=>{
        if(!roles.includes(req.user.role) ){
            return next(new AppError("You do not have the permission to perform this operation", '', 403))
        }
        next()
    }
};

exports.updatePassword =catchAsync(async(req, res, next)=>{
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('', {passwordCurrent:'Your current password is wrong.'}, 401));
    }

    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // User.findByIdAndUpdate will NOT work as intended!

    // 4) Log user in, send JWT
    createSendToken(user, req, res, 200)
})
