const uuid = require('uuid');
const BrowserFingerprint = require('browser-fingerprint');

// Initialize the fingerprinting library
const fingerprint = new BrowserFingerprint();

// Function to generate a unique session ID
const generateSessionId = req=> {
  const fingerprintData = fingerprint.getFingerprint(req);
  const sessionId = uuid.v4();
  return `${sessionId}:${fingerprintData}`;
}

// Function to check if a user has already viewed a post
async function hasUserViewedPost(req, postId) {
    const sessionId = generateSessionId(req);
    const viewedPost = await ViewedPost.findOne({
      where: {
        postId,
        sessionId,
      },
    });
    return viewedPost !== null;
}

// Route to handle post views
app.get('/posts/:postId', async (req, res) => {
    const postId = req.params.postId;
    if (!await hasUserViewedPost(req, postId)) {
      const post = await Post.findByPk(postId);
      post.viewCount += 1;
      await post.save();
      const viewedPost = await ViewedPost.create({ postId, sessionId: generateSessionId(req) });
    }
    res.send(`You are viewing post ${postId}`);
  });