const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
var { User } = require('../models');


// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL:'http://localhost:8001/auth/google/callback'
// },
// function(accessToken, refreshToken, profile, cb) {
  
//   console.log(profile);
//   User.create({
//     email: "namgiho@gmail.com" ,
//     nick: "ASDASDW",
//     password:"123",
//     provider: "google",
//     snsId: "ASDAWX",
//     }, 
//     function (err, User) {

//     return cb(null, User);
//   });
// }
// ));

module.exports = (passport) => {
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:'http://localhost:8001/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const exUser = await User.findOne({ where: { snsId: profile.id, provider: 'google' } });
    if (exUser) {
      done(null, exUser);
    } else {
      const newUser = await User.create({
        email: profile._json && profile._json.kaccount_email,
        nick: profile.displayName,
        snsId: profile.id,
        provider: 'google',
      });
      done(null, newUser);
    }
  } catch (error) {
    console.error(error);
    done(error);
  }
}));
};