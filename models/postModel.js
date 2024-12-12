const mongoose = require('mongoose');
const slugify = require('slugify')

const postSchema = new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true, 'A post must belong to an author!']
    },
    authorSlug:String,
    category:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true, 'A post must belong to a category'],
        ref:"Category"
    },

    title:{
        type:String,
        required:[true, 'A post must have a title'],
        unique:true,
        trim:true
    },
    slug:String,

    content:{
        type:String,
        required:[true, 'A post must have a content'],
        trim:true
    },

    coverImage:{
        type:String,
        required:[true, 'A post must have a cover image']
    },
    viewers: [String],
    tags:String,
    status:{
        type:String,
        enum:{
            values:['published', 'pending', 'draft'],
            message:'Status is either: published, pending or draft. Got {VALUE}'
        },
        default:'published'
    },
    commentCount:{
        type:Number,
        default:0
    },
    viewCount:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    },
},{
    toJSON:{virtuals: true},
    toObject:{virtuals: true}
});

postSchema.virtual("comments", {
    foreignField:"post",
    localField:'_id',
    ref:"Comment"
})

postSchema.pre('save', function(next){
    this.slug = slugify(this.title, {lower: true})
    next();
});


const Post = mongoose.model("Post", postSchema);

module.exports = Post;