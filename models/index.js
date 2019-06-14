const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);

db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);
//User 모델과  Post 모델은 1:N 관계에 있으므로 hasMany 와 belongsTo 로 연결되어 있습니다 시퀄라이즈는 Post 모델에 userId 컬럼을 추가합니다.
db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
//Post와 Hashtag 모델에서 N:M 관계가 나옵니다 게시글 하나는 해시태그를 여러개 가질수 있고, 해시태그 하나
//도 게시글을 여러개 가질수 있습니다 해시태그 검색 기능을 생각하면 됩니다 따라서 게시글 모델과 해시태그 모델은 N:M 관계
//에 있습니다 시퀄라이즈에서는 N:M 관계를 belongsToMany 메서드로 정의합니다.

db.User.belongsToMany(db.User, {
  foreignKey: 'followingId',
  as: 'Followers',
  through: 'Follow',
});
db.User.belongsToMany(db.User, {
  foreignKey: 'followerId',
  as: 'Followings',
  through: 'Follow',
});

//같은 테이블 끼리도 N:M 관계를 가질수 있습니다 팔로잉 기능도 N:M 관계입니다 사용자 한 명이 팔로워를 여러 명 가질수도
//있고 여러 명을 팔로잉할수도 있습니다. User 모델과 User 모델 간에 N:M 관계가 있는 것입니다.

module.exports = db;