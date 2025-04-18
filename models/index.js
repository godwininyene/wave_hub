const User = require('./User');
const Post = require('./Post');
const Category = require('./Category');
const Comment = require('./Comment');
const Subscriber = require('./Subscriber');

const models = {
  User,
  Post,
  Category,
  Comment,
  Subscriber
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});
module.exports = models;