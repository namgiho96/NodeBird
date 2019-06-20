//로그인 전략!
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    //LocalStrategy 의 첫번째 인자로 주어진 객체는 전략에 관한 설정을 하는 곳입니다 usernameField 와 passwordField에는 일치하는 
    //req.body 의 속성명을 적어주면 됩니다 reqbody.email에 이메일이 req.body.password 에 비밀번호가 담겨 들어오므로 email과 password를 각각 넣어줬습니다
  }, async (email, password, done) => {
    try {
      console.log(User.email);
      const exUser = await User.findOne({ where: { email } });
      if (exUser) {
        const result = await bcrypt.compare(password, exUser.password);
        if (result) {
          done(null, exUser);
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      } else {
        done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
    } catch (error) {
      console.error(error);
      done(error);
      
    }
  }));
  //실제 젼략을 수행하는 async 함수입니다 LocalStrategy의  
};