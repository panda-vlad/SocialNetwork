const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

const Post = require('../../models/Post')
// validator

const validatePostInput = require('../../validator/post.js')

router.get('/test', (req, res) => res.json({msg: "Works Posts"}));

router.post('/',passport.authenticate('jwt', {session: false}), (req,res)=>{
  const {errors, isValid} = validatePostInput(req.body);

  if(!isValid) {
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.name, // ???
    user: req.user.id
  })
  newPost
  .save()
  .tnen(post => res.json(post));
})

module.exports = router;
