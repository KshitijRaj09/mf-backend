const Post = require("../Models/Post");
const User = require("../Models/User");

//create a post
const createPost = async (req, res) => {
   const newPost = new Post({
      ...req.body,
      userId: req.userid,
      username: req.username,
   });
   try {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
   } catch (err) {
      res.status(500).json(err);
   }
};

//update a post
const updatePost = async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.userid) {
         await post.updateOne({$set: {...req.body, userId: req.userid}});
         res.status(200).json("The post has been updated");
      } else {
         res.status(403).json("You can update only your post");
      }
   } catch (err) {
      res.status(500).json(err);
   }
};

//delete a post
const deletePost = async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.userid) {
         await post.deleteOne();
         res.status(200).json("The post has been deleted");
      } else {
         res.status(403).json("You can delete only your post");
      }
   } catch (err) {
      res.status(500).json(err);
   }
};

//like / dislike a post
const likeDislikePost = async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);
      if (!post.likes.includes(req.userid)) {
         await post.updateOne({$push: {likes: req.userid}});
         res.status(200).json("The post has been liked");
      } else {
         await post.updateOne({$pull: {likes: req.userid}});
         res.status(200).json("The post has been disliked");
      }
   } catch (err) {
      res.status(500).json(err);
   }
};

//get a post
const getPost = async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);
      res.status(200).json(post);
   } catch (err) {
      res.status(500).json(err);
   }
};

//get timeline posts
const getTimeLinePost = async (req, res) => {
   try {
      const currentUser = await User.findById(req.userid);
      const userPosts = await Post.find({userId: req.userid}).sort({
         createdAt: -1,
      });
      const friendPosts = await Promise.all(
         currentUser.followings.map((friendId) => {
            return Post.find({userId: friendId}).sort({
               createdAt: -1,
            });
         })
      );
      res.json(userPosts.concat(...friendPosts));
   } catch (err) {
      res.status(500).json(err);
   }
};

module.exports = {
   createPost,
   updatePost,
   deletePost,
   likeDislikePost,
   getPost,
   getTimeLinePost,
};
