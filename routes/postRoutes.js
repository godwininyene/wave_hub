const express = require('express');
const authController = require('./../controllers/authController');
const postController = require('./../controllers/postController')
const commentRouter = require('./commentRoutes');
const router = express.Router();


router.use('/:postId/comments', commentRouter)

router
    .route('/top-5-popular')
    .get( postController.aliasPopularPosts, postController.getAllPosts)


router
    .route('/top-5-recent')
    .get( postController.aliasRecentPosts, postController.getAllPosts)

   
    
// Endpoint to handle extra image upload
router.post('/upload',  
    postController.uploadExtra,
    postController.resizeCoverPhoto, 
    (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/images/posts/${req.file.filename}`;
    res.status(201).json({
        uploaded: true,
        url: imageUrl
    });
});
    
   
    
router.route('/')
    .post(
        authController.protect, 
        authController.restrictTo('admin', 'author'),
        postController.uploadCoverPhoto,
        postController.resizeCoverPhoto,
        postController.createPost
    )
    .get(postController.getAllPosts)

router.route('/:id')
    .get(postController.getPost)
    .patch(
        authController.protect,
        authController.restrictTo('admin', 'author'),
        postController.uploadCoverPhoto,
        postController.resizeCoverPhoto,
        postController.updatePost
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        postController.deletePost
    )


module.exports = router;