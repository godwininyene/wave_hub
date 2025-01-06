// const Post = require('../models/postModel');
// const Comment = require('../models/commentModel');
// const User = require('./../models/userModel')
// const Category = require('../models/categoryModel');
const {Post, Comment, Category, User} = require('./../models');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const { Op } = require('sequelize');
const functions = require('./../utils/functions')


exports.getOverview = catchAsync(async(req, res, next)=>{
  // 1) Get posts data from collection
  // const posts = await Post.find().populate('category').sort("-createdAt");
  const posts = await Post.findAll({
    where:{status:"published"},
    include:[
      {
        model:Category,
        as:"category"
      }
    ],
    order: [['createdAt', 'DESC']]
  });
  // 2) Build template
  // 3) Render that template using posts data from 1)
  res.status(200).render('index', {
    title: 'The latest Articles from Nigeria and Around the World',
    posts
  });
});

exports.getAuthorPosts = catchAsync(async(req, res, next)=>{
  // 1) Get posts data from collection
  // const posts = await Post.find({ author: req.params.author_id }).populate('category').sort('-createdAt');
  // const author = await User.findById(req.params.author_id).select('name -_id');
  // const author_name = author?.name; // Extracts the name field

  const posts = await Post.findAll({
    where:{authorId: req.params.author_id, status: 'published'},
    order:[["createdAt", "DESC"]],
    include:[
      {model:Category, as: 'category'}
    ]
  });
 
  const author = await User.findByPk(req.params.author_id, {
    attributes:['name', 'id']    
  });
  const author_name = author?.name
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
  // const posts = await Post.find({ category: req.params.cat_id }).populate('category').sort('-createdAt');
  // const category = await Category.findById(req.params.cat_id).select('name -_id');
  // const category_name = category?.name; // Extracts the name field

  const posts = await Post.findAll({
    where:{categoryId : req.params.cat_id, status:"published"},
    order:[["createdAt", "DESC"]],
    include:[{model: Category, as:'category'}]

  });
  const category = await Category.findByPk(req.params.cat_id, {
    attributes:['name', 'id']
  })
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
  // const post = await Post
  // .findOne({ slug: req.params.slug })
  // .populate('category')
  // .populate({ path: 'author', select: 'name photo' })
  // .populate({ 
  //   path: 'comments', 
  //   match: { status: 'approved' },  // Filter comments to only those with status 'approved'
  //   select: 'comment author createdAt' 
  // });

  const post = await Post.findOne({
    where: { slug: req.params.slug },
    include: [
      { model: Category, as: 'category' },
      { model: User, as: 'author', attributes: ['name', 'photo', 'id'] },
      {
        model: Comment,
        as: 'comments',
        attributes: ['comment', 'author', 'createdAt'],
        order:[["createdAt", "DESC"]],
        where: { status: 'approved' },
        required: false // Make comments optional
      }
    ]
  });
 
  if (!post) {
    return next(new AppError('There is no post with that title.', '', 404));
  }

  //Update viewers
  // await Post.findOneAndUpdate({slug:req.params.slug}, {
  //   $addToSet:{viewers: req.connection.remoteAddress},
  //   // $inc:{viewCount: 1}
  // },{
  //   new:true
  // })
  // 
  functions.hasUserViewedPost(req, post.id)

  // 2) Get related posts data from collection
  // const posts = await Post
  //   .find({ slug: { $ne: req.params.slug }, category: post.category._id })
  //   .populate('category');
  const posts = await Post.findAll({
    where: {
      slug: { [Op.ne]: req.params.slug },  
      categoryId: post.category.id
    },
    include: [
      {
        model: Category,         
        as: 'category'
      }
    ]
  });

  // 3) Build template
  // 4) Render template using data from 1)
  res.status(200).render('post', {
    title:  `${post.title}`,
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

  // const stats = {
  //   posts: await Post.countDocuments(),
  //   published_posts: await Post.countDocuments({status: 'published'}),
  //   draft_posts: await Post.countDocuments({status: 'draft'}),
  //   comments: await Comment.countDocuments(),
  //   pending_comments: await Comment.countDocuments({status: 'pending'}),
  //   categories: await Category.countDocuments(),
  //   users: await User.countDocuments(),
    
  // }
  const stats = {
    posts: await Post.count({
      where: req.user.role === 'admin' ? {} : { authorId: req.user.id }
    }),
    published_posts: await Post.count({
      where: req.user.role === 'admin' 
        ? { status: 'published' } 
        : { status: 'published', authorId: req.user.id }
    }),
    draft_posts: await Post.count({
      where: req.user.role === 'admin' 
        ? { status: 'draft' } 
        : { status: 'draft', authorId: req.user.id }
    }),
    comments: await Comment.count({
      where: req.user.role === 'admin' ? {} : { authorId: req.user.id }
    }),
    pending_comments: await Comment.count({
      where: req.user.role === 'admin' 
        ? { status: 'pending' } 
        : { status: 'pending', authorId: req.user.id }
    }),
    categories: await Category.count(),
    users: await User.count(),
   
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
    // post = await Post.findById(req.query.p_id);
    post = await Post.findByPk(req.query.p_id);
   
    if (!post) {
      return next(new AppError('There is no post with that ID.', '', 404));
    }
  }
 
  // 1) Get posts data from collection
  // const posts = await Post
  // .find().populate('category')
  // .populate({path: 'author',  select:'name'})
  // .populate({path: 'comments', select:'author'})
  // .sort("-createdAt");

  const posts = await Post.findAll({
    order:[["createdAt", "DESC"]],
    where: req.user.role === 'admin' ? {} : { authorId: req.user.id },
    include:[
      {
        model:Category,
        as:'category'
      },
      {
        model:User,
        as:"author",
        attributes:['name']

      },
      {
        model:Comment,
        as:'comments',
        attributes:['author']
      }
    ]
  });

 
  res.status(200).render('admin/posts',{
    posts,
    post,
    source,
    title:'Manage posts'
  })
});

exports.getCategories = catchAsync(async(req, res, next)=>{
  // const categories = await Category.find();
  const categories = await Category.findAll();
  res.status(200).render('admin/categories',{
    title:'Manage categories',
    categories
  })
});

exports.getComments = catchAsync(async(req, res, next)=>{
  // 1) Get comments data from collection
  // const comments = await Comment.find().populate({path: 'post', select:'title slug'}).sort("-createdAt"); 
  const comments = await Comment.findAll({
    where: req.user.role === 'admin' ? {} : { authorId: req.user.id },
    order:[["createdAt", "DESC"]],
    include:[
      {
        model:Post,
        as:'post',
        attributes:['title', 'slug']
      }
    ]
  });
 
  res.status(200).render('admin/comments',{
    title:'Manage Comments',
    comments
  })
});

exports.getUsers = catchAsync(async(req, res, next)=>{
  const source = req.query.source;
  // const users = await User.find();
  const users = await User.findAll();
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