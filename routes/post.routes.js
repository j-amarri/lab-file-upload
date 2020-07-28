const express = require('express');
const Post = require('../models/Post.model');
const postRouter = new express.Router();

const routeGuard = require('../configs/route-guard.config');

const multer = require('multer');
const cloudinary = require('cloudinary');
const multerStorageCloudinary = require('multer-storage-cloudinary');
const { route } = require('./index.routes');
const { response } = require('express');

// config multer and cloudinary
const storage = new multerStorageCloudinary.CloudinaryStorage({
  cloudinary: cloudinary.v2
});
const upload = multer({ storage });

postRouter.get('/create', routeGuard, (req, res) => {
  res.render('posts/create-post');
});

// pass the upload middleware
postRouter.post('/create', upload.single('picture'), routeGuard, (req, res, next) => {
  // retrieve all the form data
  const { content, description } = req.body;
  console.log(req.body);
  Post.create({
    content,
    creatorId: req.session.currentUser._id,
    picPath: req.file.path,
    picName: description
  })
    .then(post => {
      res.redirect('/');
    })
    .catch(error => {
      next(error);
    });
});

postRouter.get('/', (req, res, next) => {
  Post.find()
    .then(posts => {
      res.render('posts/post-list', { posts });
    })
    .catch(error => {
      next(error);
    });
});

postRouter.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Post.findById(id)
    .populate('creator')
    .then(post => {
      if (post) {
        res.render('posts/post-single', { post });
      } else {
        next();
      }
    })
    .catch(error => {
      next(error);
    });
});

module.exports = postRouter;
