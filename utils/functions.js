const crypto = require('crypto');
const Post = require('./../models/Post')

// Function to generate a unique fingerprint
const generateFingerPrint = req=> {
  // Combine data from headers and IP to create a unique identifier
  const fingerprintData = {
    userAgent: req.headers['user-agent'] || '',
    accept: req.headers['accept'] || '',
    acceptEncoding: req.headers['accept-encoding'] || '',
    acceptLanguage: req.headers['accept-language'] || '',
    ip: req.ip || req.connection.remoteAddress || '',
  };
  // Create a hash of the combined data
  const fingerprintString = JSON.stringify(fingerprintData);
  const fingerprintHash = crypto
    .createHash('sha256')
    .update(fingerprintString)
    .digest('hex');
  return fingerprintHash
}

// Function to check if a user has already viewed a post
exports.hasUserViewedPost = async(req, postId)=> {
  const fingerprintHash = generateFingerPrint(req);
  const viewedPost = await Post.findByPk(postId);
  const viewers = viewedPost.viewers
  if (!viewers.includes(fingerprintHash)) {
    viewers.push(fingerprintHash);
    viewedPost.setDataValue('viewers', JSON.stringify(viewers)); // Avoid setter hooks
    viewedPost.viewCount += 1;
    await viewedPost.save({ hooks: false }); // Disable to prevent Sequelize from re-calling the getter
  }
}