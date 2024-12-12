const Post = require('../models/postModel');
const Comment = require('../models/commentModel');
const catchAsync = require('./../utils/catchAsync');
const User = require('../models/userModel');
const Category = require('../models/categoryModel');
const AppError = require('../utils/appError');
// const client = require('./../utils/redis')


// exports.updateViewCount = async (req, res, next) => {
//   const postId = req.params.slug;
//   const uniqueVisitor = req.connection.remoteAddress; 
  
//   // Create a Redis set key for this post (all unique visitors for this post)
//   const redisKey = `post:${postId}:views`;

//   try {
//     // Check if this visitor is already in the Redis set for this post
//     const isMember = await client.sIsMember(redisKey, uniqueVisitor);

//     if (!isMember) {
//       // Increment view count in the database
//       await Post.findOneAndUpdate(
//         { slug: postId }, 
//         { $inc: { viewCount: 1 } }
//       );

//       // Add visitor to the Redis set
//       await client.sAdd(redisKey, uniqueVisitor);
//     }
//   } catch (error) {
//     console.error('Error updating view count:', error);
//   }
//   next();
// };

exports.getOverview = catchAsync(async(req, res, next)=>{
  // 1) Get posts data from collection
  const posts = await Post.find().populate('category').sort("-createdAt");
  // 2) Build template
  // 3) Render that template using posts data from 1)
  res.status(200).render('index', {
    title: 'The latest Articles from Nigeria and Around the World',
    posts
  });
});

exports.getAuthorPosts = catchAsync(async(req, res, next)=>{
  // 1) Get posts data from collection
  const posts = await Post.find({ author: req.params.author_id }).populate('category').sort('-createdAt');
  const author = await User.findById(req.params.author_id).select('name -_id');
  const author_name = author?.name; // Extracts the name field
  // 2) Build template
  // 3) Render that template using posts data from 1)
  res.status(200).render('author_posts', {
    title: `All ${req.params.slug} Posts`,
    posts,
    author_name
  });
});

exports.getPostsByCategory = catchAsync(async(req, res, next)=>{
  // 1) Get posts data from collection
  const posts = await Post.find({ category: req.params.cat_id }).populate('category').sort('-createdAt');
  const category = await Category.findById(req.params.cat_id).select('name -_id');
  const category_name = category?.name; // Extracts the name field
  // 2) Build template
  // 3) Render that template using posts data from 1)
  res.status(200).render('category_posts', {
    title: `All Posts in ${category_name} category`,
    posts,
    category_name
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  // 1) Get the data for the requested post (including only approved comments and replies)
  const post = await Post
    .findOne({ slug: req.params.slug })
    .populate('category')
    .populate({ path: 'author', select: 'name photo' })
    .populate({ 
      path: 'comments', 
      match: { status: 'approved' },  // Filter comments to only those with status 'approved'
      select: 'comment author createdAt' 
    });
  
  if (!post) {
    return next(new AppError('There is no post with that title.', '', 404));
  }

  //Update viewers
  await Post.findOneAndUpdate({slug:req.params.slug}, {
    $addToSet:{viewers: req.connection.remoteAddress},
    // $inc:{viewCount: 1}
  },{
    new:true
  })

  // 2) Get related posts data from collection
  const posts = await Post
    .find({ slug: { $ne: req.params.slug }, category: post.category._id })
    .populate('category');

  // 3) Build template
  // 4) Render template using data from 1)
  res.status(200).render('post', {
    title: `${post.title}`,
    post,
    posts
  });
});


exports.getAbout = (req, res, next)=>{
  res.status(200).render('about_us', {
      title:"About Us"
  });
}

exports.getPrivacyPolicy = (req, res, next)=>{
  res.status(200).render('privacy_policy', {
      title:"Privacy Poly"
  });
}

exports.getContact = (req, res, next)=>{
  res.status(200).render('contact-us', {
      title:"Contact Us"
  });
}



exports.getLoginForm = (req, res, next) => {
  const message = req.query.message || ''
  res.status(200).render('login', {
    title: 'Log into your account',
    message
  });
};

exports.getDashboard = async(req, res, next)=>{

  const stats = {
    posts: await Post.countDocuments(),
    published_posts: await Post.countDocuments({status: 'published'}),
    draft_posts: await Post.countDocuments({status: 'draft'}),
    comments: await Comment.countDocuments(),
    pending_comments: await Comment.countDocuments({status: 'pending'}),
    categories: await Category.countDocuments(),
    users: await User.countDocuments(),
    
  }
  res.status(200).render('admin/dashboard',{
    title:"Dashboard",
    stats
  })
}

exports.getManagePost = catchAsync(async(req, res , next)=>{
  const source = req.query.source;

  //Allowed for fetching post to be edited
  let post;
  if(req.query.p_id){
    post = await Post.findById(req.query.p_id);
    if (!post) {
      return next(new AppError('There is no post with that ID.', '', 404));
    }
  }
 
  // 1) Get posts data from collection
  const posts = await Post
  .find().populate('category')
  .populate({path: 'author',  select:'name'})
  .populate({path: 'comments', select:'author'})
  .sort("-createdAt");
  res.status(200).render('admin/posts',{
    posts,
    post,
    source,
    title:'Manage posts'
  })
});

exports.getCategories = catchAsync(async(req, res, next)=>{
  const categories = await Category.find();
  res.status(200).render('admin/categories',{
    title:'Manage categories',
    categories
  })
});

exports.getComments = catchAsync(async(req, res, next)=>{
  // 1) Get comments data from collection
  const comments = await Comment.find().populate({path: 'post', select:'title slug'}).sort("-createdAt"); 
 
  res.status(200).render('admin/comments',{
    title:'Manage Comments',
    comments
  })
});

exports.getUsers = catchAsync(async(req, res, next)=>{
  const source = req.query.source;
  const users = await User.find();
  res.status(200).render('admin/users',{
    source,
    users,
    title:"Manage users"
  })
});
exports.getAccount = catchAsync(async(req, res, next)=>{
  res.status(200).render("admin/profile", {
      title:"Your account "
  })
});

exports.updateUserData = catchAsync(async(req, res, next)=>{
  const updatedUser = await User.findByIdAndUpdate(req.user._id, {
    name:req.body.name,
    email:req.body.email
  }, {
    new:true,
    runValidators:true
  });
  
  res.status(200).render("admin/profile", {
    title:"Your account ",
    user:updatedUser
  });
})