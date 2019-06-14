const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models/user');


const router  = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    console.log('유저는 : '+User);
    const exUser = await User.find({ where: { email } });
    if (exUser) {
      req.flash('joinError', '이미 가입된 이메일입니다.');
      return res.redirect('/join');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

//회원가입 라우터 입니다 기존에 같은 이메일로 가입한 사용자가 있는지 조회한 뒤 있다면 flash 메서지를 설정하고 회원가입 페이지로 되돌려 보냅니다
//없다면 비밀번호를 암호화 하고 사용자 정보를 생성합니다 회원가입시 비밀번호는 암호화해서 저장해야 합니다 이번에는 bcrypt 모듈을 사용했습니다 
//(crypto 모듈의 pdkdf2 메서드를 사용해서 암호화 할수 있습니다 ) bcrypt 모듈의 hash 메서드를 사용하면 손쉽게 비밀번호를 암호화할 수 있습니다 bcrypt의 두번째 인자는 
//pdkdf2 의 반복 횟수와 비슷한 기능을 합니다 숫자가 커질수록 비밀번호를 알아냐기 어려워지지만 암호화 시간도 오래 걸럽니다 12 이상을 추천합니다 31까지 사용할수있습니다

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      req.flash('loginError', info.message);
      return res.redirect('/');
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

//로그인 라우터 입니다. passport.authenticate('local') 미들웨어가 로컬 로그인 전략을 수행합니다.
//미들웨어인데 라우터 미들웨어 안에 들어 있습니다 미들웨어에 사용자 정의 기능을 추가하고 싶을때 보통 이렇게 합니다 이럴때는 내부 미들웨어에 (req,res,next)
//인자로 제공해서 호출하면 됩니다
//전략코드는 잠시 후에 작성합니다. 전략이 성공하거나 실패하면  authenticate 메서드의 콜백 함수가 실행됩니다 콜백 함수의
//첫 번째 인자(authErr)  값이 있다면 실패한 것입니다 두번째 인자 값이 있다면 성공한 것이고 req.login 메서드를 호출합니다
//passport 는 req 객체에 login과 logout 메서드를 추가합니다 req.login은 passport.serializeUser 를 호출합니다
//req.login 에 제공하는 user 객체가 serializeUser로 넘어가게 됩니다

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});
//로그아웃 라우터입니다 req.logout 메서드는 req.user 객체를 제거하고 req.session.destroy 는 req.session 객체의 내용을 제거합니다 세션 정보를 지운후
//메인 페이지로 되돌아 갑니다 로그인 헤체되어 있을겁니다

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;