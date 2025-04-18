const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController')

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewsController.getOverview);
router.get('/author/:slug/:author_id', viewsController.getAuthorPosts);
router.get('/category/:cat_name/:cat_id', viewsController.getPostsByCategory);
router.get('/post/:slug', viewsController.getPost);
router.get('/about', viewsController.getAbout);
router.get('/contact-us', viewsController.getContact);
router.get('/privacy-policy', viewsController.getPrivacyPolicy);
router.get('/login', viewsController.getLoginForm);

// Protect all routes after this middleware
router.use(authController.protectAdminPages);
router.get('/dashboard', viewsController.getDashboard);
router.get('/manage_posts', viewsController.getManagePost);
router.get('/manage_categories', viewsController.getCategories);
router.get('/manage_comments', viewsController.getComments);
router.get('/manage_subscribers', viewsController.getSubscribers);
router.get('/manage_users', viewsController.getUsers);
router.get('/me', viewsController.getAccount);

// router.post('/submit-user-data', authController.protect, viewsController.updateUserData)

module.exports = router;

