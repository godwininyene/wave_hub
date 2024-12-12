const express = require('express');
const router = express.Router();
const categoryController = require('./../controllers/categoryController');
const authController = require('./../controllers/authController');

router.route('/')
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        categoryController.createCategory
    )
    .get(categoryController.getAllCategories)

router.route('/:id')
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        categoryController.deleteCategory
    )

module.exports = router;