const mongoose = require('mongoose');
const Post = require('./postModel')
const validator = require('validator');

const commentSchema = new mongoose.Schema({
    author:{
        type: String,
        required:[true, "Please provide your name."]
    },

    email:{
        type: String,
        required:[true, "Please provide your email."],
        validate:[validator.isEmail, 'Please provide a valid email address'],
    },
    comment:{
        type:String,
        required:[true, 'Comment cannot be empty'],
        trim:true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true, 'Comment  must belong to a post.'],
        ref:'Post'
    },
    status:{
        type:String,
        enum:{
            values:['pending', 'approved', 'disapproved'],
            message:'Comment status is either: pending, approved, or disapproved. Got {VALUE}'
        },
        default:'pending'
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    }
});




commentSchema.statics.calCommentCounts = async function(postId){
    const result = await this.aggregate([
        {
            $match:{post: postId}
        },
        {
            $group:{
                _id:'$post',
                nComments:{$sum: 1}
            }
        }
    ]);

    await Post.findByIdAndUpdate(postId, {
        commentCount:result[0].nComments
    })
}

// commentSchema.post('save', function(){
//     this.constructor.calCommentCounts(this.post);
// });

commentSchema.pre(/^findOneAnd/, async function(next){
    this.r = await this.model.findOne(this.getQuery()); // Fetch the original document
    next();
});

commentSchema.post(/^findOneAnd/, async function(doc, next) {
    this.r.constructor.calCommentCounts(this.r.post); 
    next();
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;