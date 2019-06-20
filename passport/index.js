    
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const google = require('./googleStrategy');
const { User } = require('../models');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({ where: { id } })
      .then(user => done(null, user))
      .catch(err => done(err));
  });
  google(passport);
  local(passport);
  kakao(passport);
};