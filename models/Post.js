const {DataTypes, Model} = require('sequelize');
const sequelize = require('./../utils/sequelize');
const slugify = require('slugify');
const User = require('./User'); 
const Category = require('./Category'); 
const Comment = require('./Comment'); 

class Post extends Model{}
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
                
                if (typeof rawData === 'string') {
                  const parsedData = JSON.parse(rawData); // Parse string to array
                  if (!Array.isArray(parsedData)) return []; 
                  return parsedData; 
                }
                if (Array.isArray(rawData)) return rawData; 
                
                return []; 
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

// Model Associations
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' }); // One-to-Many (User can have many posts)
Post.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' }); // One-to-Many (Category can have many posts)
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' }); // One-to-Many (Post can have many comments)

module.exports = Post;