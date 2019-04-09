const express = require('express');
const router = express.Router();
const gravatar =  require('gravatar')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport')

//Load Input Validation
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

// Load USer model
const User = require('../../models/User')

router.get('/test', (req, res) => res.json({msg: "Works Users"}));

// Register users

router.post('/register', (req,res) => {

  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
  .then(user => {
    if (user) {
      errors.email = 'Email already exists'
      return res.status(400).json(errors);
    }
    else {
      const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      })

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password,salt, (err, hash) => {
          if(err) throw err;
          newUser.password = hash;
          newUser.save()
          .then(user => res.json(user))
          .catch(err => console.log(err))
        })
      })
    }
  })
});
 router.post('/login', (req, res) => {

   const {errors, isValid} = validateLoginInput(req.body)

   if(!isValid) {
     return res.status(400).json(errors);
   }

   const email = req.body.email;
   const password = req.body.password;

   //Find User by email
   User.findOne({email})
        .then(user => {
          if(!user) {
            errors.email = 'User not found'
            return res.status(404).json({email: "User email not found"})
          }
          // Check password
          bcrypt.compare(password, user.password)
            .then(isMatch => {
              if(isMatch) {
                //res.json({msg: 'Success'});
                //User matched
                const payload = { id: user.id, name:user.name};
                jwt.sign(payload,
                   keys.secretOrKey,
                   {expiresIn: 3600}),
                    (err, token) => {
                      res.json({
                        success: true,
                        token: 'Bearer ' + token
                      })
                };
              }
              else {
                errors.password = 'password incorrect'
                return res.status(400).json(errors)
              }
            })
        })
 });

router.get('/current', passport.authenticate('jwt', {session: false}), (req,res) => {
    res.json({msg: "Success"});
})



router.get('/test', (req, res) => res.json({ msg: 'Works Profile' }));

// Get current user profile
// router.post('/', passport.authenticate('jwt', { session: false }),
//  (req, res) => {
//    const profileFileds = {};
//    profileFileds.user = req.user.id;
//
//    if(req.body.handle) profileFileds.handle = req.body.handle;
//    if(req.body.company) profileFileds.company = req.body.company;
//    if(req.body.website) profileFileds.website = req.body.website;
//    if(req.body.location) profileFileds.location = req.body.location;
//    if(req.body.status) profileFileds.status = req.body.status;
//    if(req.body.skills) profileFileds.skills = req.body.skills;
//    if(req.body.bio) profileFileds.bio = req.body.bio;
//
//    if(typeof req.body.skills !== 'undefined') {
//      profileFileds.skills = req.body.skills.split(',');
//    }
//    //  social
//    profileFileds.social = {};
//    if(req.body.youtube) profileFileds.social.youtube = req.body.youtube;
//    if(req.body.twitter) profileFileds.social.twitter = req.body.twitter;
//    if(req.body.twitter) profileFileds.social.twitter = req.body.facebook;
//
//    //Find
//    Profile.findOne({user: req.user.id})
//     .then(profile => {
//       if(profile) {
//         //update
//         Profile.findOneAndUpdate({user: req.user.id},
//           { user: req.user.id },
//           { $set: profileFileds},
//           { new: true}
//          )
//          .then (profile => res.json(profile));
//       } else {
//         //Create
//         // Check handle exists
//         Profile.findOne( {handle: profileFileds.handle}).then(profile =>{
//           if (profile){
//             errors.handle = 'That handle already exists';
//             res.status(400).json(errors);
//           }
//           // Save profile
//           new Profile(profileFileds).save().then(profile =>{
//               res.json(profile);
//           })
//         })
//       }
//     })
//  }
// );


module.exports = router;
