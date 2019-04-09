const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
// Load Profile
const Profile = require('../../models/Profile');

// Load validation
const vaidateProfileInput = require('../../validation/profile');
// Load experience
const vaidateExperienceInput = require('../../validation/experience');

//
const vaidateEducationInput = require('../../validation/education');
// Load User
const User = require('../../models/User');

router.get('/test', (req, res) => res.json({ msg: 'Works Profile' }));

// Get current user profile
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar']) // join
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile';
        return res.status(404).json();
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route Get api/profile/handle/:handle
// @ desc Get profile by handle

router.get('/handle/:handle', (req, res) => {
  const errors = {};

  Profile.findOne({handle: req.params.handle})
  .populate('user', ['name', 'avatar'])  // join
  .then(profile => {
    if(!profile) {
      errors.noprofile = 'There is no profile for this user';
      res.status(404).json(errors);
    }
    res.json(profile);
  })
  .catch(err => res.status(404).json(err));
});


// @route Get api/profile/handle/:handle
// @ desc Get profile by userID

router.get('/handle/:user_id', () =>{
  Profile.findOne({user: req.params.user_id})
  .populate('user', ['name', 'avatar'])  // join
  .then(profile => {
    if(!profile) {
      errors.noprofile = 'There is no profile for this user';
      res.status(404).json(errors);
    }
    res.json(profile)

  })
  .catch(err => res.status(404).json({Profile: ' There is no user'}));
});

// @route Get api/profile/all
// @desc Get all ProfileSs
// @ access Public

router.get('/all', (req, res)=>{
  Profile.find()
  .populate('user', ['name', 'avatar'])
  .then(profiles => {
    if(!profiles) {
      errors.noprofile = 'There is no profile';
      return res.status(404).json(errors);
    }
    res.json(profiles);
  })
  .catch( err =>
    res.status(404).json({ profile: 'There is no profile' })) ;

})


router.post('/', passport.authenticate('jwt', { session: false }),
 (req, res) => {
   const { errors, isValid } = validateProfileInput(req.body);

   // Check validation
   if(!isValid) {
     return res.status(400).json(errors);
   }
   const profileFileds = {};
   profileFileds.user = req.user.id;

   if(req.body.handle) profileFileds.handle = req.body.handle;
   if(req.body.company) profileFileds.company = req.body.company;
   if(req.body.website) profileFileds.website = req.body.website;
   if(req.body.location) profileFileds.location = req.body.location;
   if(req.body.status) profileFileds.status = req.body.status;
   if(req.body.skills) profileFileds.skills = req.body.skills;
   if(req.body.bio) profileFileds.bio = req.body.bio;

   if(typeof req.body.skills !== 'undefined') {
     profileFileds.skills = req.body.skills.split(',');
   }
   //  social
   profileFileds.social = {};
   if(req.body.youtube) profileFileds.social.youtube = req.body.youtube;
   if(req.body.twitter) profileFileds.social.twitter = req.body.twitter;
   if(req.body.twitter) profileFileds.social.twitter = req.body.facebook;

   //Find
   Profile.findOne({user: req.user.id})

    .then(profile => {
      if(profile) {
        //update
        Profile.findOneAndUpdate({user: req.user.id},
          { user: req.user.id },
          { $set: profileFileds},
          { new: true}
         )
         .then (profile => res.json(profile));
      } else {
        //Create
        // Check handle exists
        Profile.findOne( {handle: profileFileds.handle}).then(profile =>{
          if (profile){
            errors.handle = 'That handle already exists';
            res.status(400).json(errors);
          }
          // Save profile
          new Profile(profileFileds).save().then(profile =>{
              res.json(profile);
          })
        })
      }
    })
 }
);


// @route Post api/profile/aexperience
// @desc Add experience to profile
// @ access Public

router.post('/experience', passport.authenticate('jwt', { session: false }),
 (req, res) => {
   const { errors, isValid } = validateExperienceInput(req.body);

   // Check validation
   if(!isValid) {
     return res.status(400).json(errors);
   }
   Profile.findOne({user:req.user.id})
   .then(profile => {
     const newExp = {
       title:req.body.title,
       company: req.body.company,
       location: req.body.location,
       from: req.body.from,
       to: req.body.to,
       current: req.body.current,
       description: req.body.description
     }
     profile.experience.unshift(newExp);

     profile.save().then(profile => res.json(profile));

   })
 });

// @route Post api/profile/education
// @ desc Add education to profiles
// @access Private
 router.post('/education', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // Check validation
    if(!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({user:req.user.id})
    .then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));

    })
  });


module.exports = router;
