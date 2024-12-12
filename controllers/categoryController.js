const catchAsync = require("../utils/catchAsync");
const Category = require('./../models/categoryModel');
const AppError = require('./../utils/appError')

exports.createCategory = catchAsync(async(req, res, next) =>{
    const category = await Category.create(req.body);

    res.status(200).json({
        status:"success",
        data:{
            category
        }
    });
});

exports.getAllCategories = catchAsync(async(req, res, next)=>{
    const categories = await Category.find();
    res.status(200).json({
        status:"success",
        result:categories.length,
        data:{
            categories
        }
    });
});

exports.deleteCategory = catchAsync(async(req, res, next)=>{
    const category = await Category.findByIdAndDelete(req.params.id);

    if(!category){
        return next(new AppError('No category was found with that ID', '', 404));
    }

    res.status(204).json({
        status:"success",
        data:null
    })
})