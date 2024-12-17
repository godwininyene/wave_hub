const {DataTypes, Model} = require('sequelize');
const sequelize = require('./../utils/sequelize');
const slugify = require('slugify');

class Post extends Model{
    static associate(models) {
        Post.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' })// One-to-Many (User can have many posts;
        Post.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' }) // One-to-Many (Category can have many posts;
        Post.hasMany(models.Comment, { foreignKey: 'postId', as: 'comments' }) // One-to-Many (Post can have many comments;
    }
}
Post.init(
    //Model Attributes
    {
        authorId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate:{
                notNull:{msg: 'A post must belong to an author!'}
            },
            references: {
                model: 'Users', 
                key: 'id'
            },
        },
        categoryId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate:{
                notNull:{msg:'A post must belong to a category'}
            },
            references:{
                model:"Categories",
                key:'id'
            }
        },
        title:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                notNull:{msg:'A post must have a title'},
                notEmpty: { msg: 'A post title cannot be empty!' }
            },
            unique:true
        },
        slug:{
            type:DataTypes.STRING,
            unique:true
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
              notNull: { msg: 'A post must have content!' },
              notEmpty: { msg: 'A post content cannot be empty!' }
            }
        },
        coverImage: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notNull: { msg: 'A post must have a cover image!' },
              notEmpty: { msg: 'Cover image cannot be empty!' }
            }
        },
        viewers: {
            type: DataTypes.JSON, // Stores an array of viewers 
            allowNull:false,
            defaultValue: []
            
        },
        tags:DataTypes.STRING,
        status: {
            type: DataTypes.ENUM('published', 'pending', 'draft'),
            defaultValue: 'published',
            validate: {
              isIn:{
                args:[['published', 'pending', 'draft']],
                msg: 'Invalid status. Must be one of: published, pending, draft'
              }
            }
        },
        commentCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        viewCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
    },
    //Other model options 
    {
        sequelize,
        modelName:"Post",
        getterMethods: {
            viewers() {
                try {
                  const rawData = this.getDataValue('viewers'); 
                  if (!rawData) return []; // Handle empty string, null, or undefined
              
                  let parsedData = rawData;
                  // Step 1: If the rawData is a string, parse it once
                  if (typeof rawData === 'string') {
                    parsedData = JSON.parse(rawData);
                  }
                  // Step 2: If after parsing, it is still a string, parse it again
                  if (typeof parsedData === 'string') {
                    parsedData = JSON.parse(parsedData);
                  }
                  if (!Array.isArray(parsedData)) return []; 
                  return parsedData; 
                } catch (error) {
                  console.error('Error parsing viewers JSON:', error.message);
                  return []; 
                }
            }
              
        },
        setterMethods: {
            viewers(value) {
              try {
                if (!Array.isArray(value)) {
                  throw new Error('viewers must be an array');
                }
                const stringifiedValue = JSON.stringify(value);
                this.setDataValue('viewers', stringifiedValue); // Save the stringified value
              } catch (error) {
                console.error('Error in setter for viewers:', error.message);
              }
            }
        },
        hooks:{
            beforeSave:(post)=>{
                // If the title is updated or created, generate a new slug and trim the title
                if (post.title) {
                    post.title = post.title.trim();
                    post.slug = slugify(post.title, {lower:true})
                }
                if (post.content) {
                    post.content = post.content.trim();
                }
            },
            beforeUpdate:(post)=>{
                // If the title is updated or created, generate a new slug and trim the title
                if (post.title) {
                    post.title = post.title.trim();
                    post.slug = slugify(post.title, {lower:true})
                }
                if (post.content) {
                    post.content = post.content.trim();
                }
            }
        }
    }
)
module.exports = Post;

