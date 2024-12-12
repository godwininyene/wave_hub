const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController')
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Protect all routes after this middleware
router.use(authController.protect);

router.route('/create')
    .post(
        authController.restrictTo('admin'),
        userController.uploadUserPhoto, 
        userController.resizeUserPhoto, 
        userController.createUser
    )

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', authController.protect, userController.getMe, userController.getUser)
router
.patch('/updateMe',
    userController.uploadUserPhoto, 
    userController.resizeUserPhoto, 
    userController.updateMe
);


router.route('/')
.get(authController.restrictTo('admin'), userController.getAllUser)

router.route('/:id')
.get(userController.getUser)

module.exports = router;