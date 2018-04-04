var LocalStrategy = require('passport-local').Strategy; 
var crypto = require('crypto');
var nodemailer = require('nodemailer'); 
var Teachers = require('../models/teachers');

module.exports = function (passport) { 
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  }); 

  passport.deserializeUser(function (id, done) {
    Teachers.findById(id, function (err, user) {
      done(err, user);
    });
  }); 

  passport.use('local-login', new LocalStrategy({ 
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true 
  },
    function (req, email, password, done) {
      if (email)
        email = email.toLowerCase();   
      process.nextTick(function () {
        Teachers.findOne({
          'email': email
        }, function (err, user) { 
          if (err) return done(err); 
          else if (!user) {
            return done(null, false, req.flash('loginMessage', 'No user found.'));
          }else if (!user.validPassword(password)) {
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
          }else if (!user.isEmailConfirmed()) {
            return done(null, false, req.flash('loginMessage', 'Your email has not been confirmed yet.'));
          }else
            return done(null, user);
        });
      });
    })); 

  passport.use('local-signup', new LocalStrategy({ 
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true 
  },
    function (req, email, password, done) {
      if (email)
        email = email.toLowerCase();  
      process.nextTick(function () { 
        if (!req.user) {
            Teachers.findOne({
            'email': email
          }, function (err, user) { 
            if (err)
              return done(err); 
            if (user) {
              return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            }else if (password !== req.body.password_confirmation){
              return done(null, false, req.flash('signupMessage', 'Passwords do not match.'));
            }else {

              var emailHash = crypto.randomBytes(20).toString("hex"); 
              var teachersUser = new User();
              teachersUser.email = email;
              teachersUser.password = teachersUser.generateHash(password);
              teachersUser.name = req.body.name;
              teachersUser.emailConfirmed = false;
              teachersUser.emailConfirmationToken = emailHash;

              teachersUser.save(function (err) {
                if (err) {
                  return done(err);
                }

                var smtpTransport = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: 'acostaadrian21@gmail.com',
                    pass: 'Acosta0365492'
                  }
                });
                var mailOptions = {
                  to: email,
                  from: 'Address Book',
                  subject: 'Email Verification',
                  text: "Please click in link below to confirm your email or copy and paste in your browser url bar \n\n http://" + req.headers.host + "/email-confirmation/" + emailHash,
                  html: "<p>Please click in the link below to <br/><a href='http://" + req.headers.host + "/email-confirmation/" + emailHash + "'>" +
                    "confirm email address" +
                    "</a>\n\n</p>"
                };
                smtpTransport.sendMail(mailOptions); 
                return done(false, newUser, req.flash('loginMessage', 'A verification email has been sent to '+email));
              });
            }
          }); 
        } else {  
            return done(null, req.user);
        }
      });
    }));
 
  passport.use('local-profile-update', new LocalStrategy({ 
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true 
  },
    function (req, email, password, done) {
      if (email)
        email = email.toLowerCase();  
      process.nextTick(function () { 
        if (!req.user) {
          return done(null, false, req.flash('updateProfileMessage', 'You must be logged in to update your profile information.'));
        }else if (!req.user.validPassword(password)) {
          return done(null, false, req.flash('updateProfileMessage', 'Oops! Wrong password.'));
        }else {
          var user = req.user;
          if (req.body.new_password && req.body.new_password_confirmation && req.body.new_password === req.body.new_password_confirmation) {
            user.password = user.generateHash(req.body.newPassword);
          }

          user.name = req.body.name;

          user.save(function (err) {
            if (err)
              return done(err);

            return done(null, user, req.flash('updateProfileMessage', 'Profile updated successfully!'));
            
          });
        }
      });
    }));
};