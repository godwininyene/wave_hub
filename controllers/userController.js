const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
// const User = require('./../models/userModel')
const User = require('./../models/User')
const multer = require('multer');
const sharp = require('sharp');


const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null, true)
    }else{
        cb(new AppError("Not an image! Please upload only images.", 400), false)
    }
}

const upload = multer({
    storage:multerStorage,
    fileFilter:multerFilter
})

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async(req, res, next)=>{
    if(!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({quality: 90})
    .toFile(`public/images/users/${req.file.filename}`);
    next();
})

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });

    return newObj;
};

exports.getMe = (req, res, next)=>{
    // req.params.id = req.user._id;
    req.params.id = req.user.id;
    next();
}

exports.updateMe = catchAsync(async (req, res, next) => {
    //1)Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword route!', 400))
    }
    //2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    if(req.file) filteredBody.photo = req.file.filename
    //3) Update user document
    // const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    //     new: true,
    //     runValidators: true
    // });

    const user = await User.findByPk(req.user.id);
    const updatedUser = await user.update(filteredBody, {validate:true})
    
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
});
exports.getAllUsers = catchAsync(async(req, res, next)=>{
    // const users = await User.find();
    const users = await User.findAll();
    res.status(200).json({
        status:"success",
        result:users.length,
       data:{
        users
       }
    })
});

exports.getUser = catchAsync(async(req, res, next)=>{
    // const user = await User.findById(req.params.id)
    const user = await User.findByPk(req.params.id)
    if(!user){
        return next(new AppError('No user was found with that ID', '', 404));
    }
    res.status(200).json({
        status:"success",
        user
    });
});
exports.createUser = catchAsync(async(req, res, next) =>{
    if(req.file) req.body.photo = req.file.filename
    const user = await User.create(req.body);
    res.status(200).json({
        status:"success",
        user
    })
})