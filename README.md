# express,jwt,es6,mongodb starterkit 만들기

## Express generater

```bash
npm install -g express-generator
express myApp --no-view

cd myApp
npm install		
```

```bash
// bin/www.js
/**
 * Module dependencies.
 */
import app from '../app';
import debugLib from 'debug';
import http from 'http';
const debug = debugLib('your-project-name:server');
// generated code below.
```

```bash
// routes/index.js
import express from 'express';
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
export default router;
```

```bash
// app.js
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/', indexRouter);
export default app;
```

## ES6

```bash
$ npm install babel-cli --save-dev
$ npm install babel-preset-env --save-dev
```

> .babelrc

```json
{
  "presets": ["env"]
}
```

```bash
// package.json

"dev": "nodemon --exec babel-node -- ./bin/www"
```

```bash
npm run dev		
```

## passport 설정

```bash
npm install --save passport passport-local --save
```

`passport-local`은 `email + password` 로 로그인시 이용된다. 

## bcrpt 

```
npm install --save bcrypt
```

비밀번호 입력시 `bcrypt`을 통해서 키를 만들고 그 키를 비교를 할 수 있다. 

## App.js 설정

```javascript
import passport from 'passport'

...
app.use(passport.initialize());
...
```

## Passport JS

1. `passport` 폴더를 만들어서 `index.js` 와 `localStrategy.js` 파일을 만든다. 

```javascript
// passport/index.js

import localStrategy from './localStrategy'

module.exports = (passport) => {
    localStrategy(passport)
}
```

```javascript
// passport/localStrategy.js


import passportLocal from 'passport-local'
const LocalStrategy = passportLocal.Strategy

module.exports = (passport) => {

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',        
    }, (email, password, done) => {
        console.log(email, password)
        if(email === 'test@test.com' && password ==='1234') {
            return done(
                null,
                {
                    email
                }
            )
        } else {
            return done(
                null,
                false,
                {
                    message: '비밀번호가 틀렸음'
                }
            )
        }
    }));
}


```

우선 DB 연결없이 간단한 로그인 처리를 진행했다.  `done` 은 기본적으로 `(error, 성공시, 실패시)` 값을 리턴한다. 

그럼 `app.js`에서 `passport 전략`을 적용해보자.

```javascript
// app.js

import passport from 'passport'
import localStrategy from './passport'

localStrategy(passport);
```

`router` 에도 적용해보자. 

```javascript
// routes/user.js

router.post('/', function(req, res, next) {
  const { email, password } = req.body;  
  passport.authenticate('local', (authError, user, info) => {    
    res.json(user)
  })(req, res, next);  
});

```

## Mongodb 초기화

이제 실제 DB에 적용해볼려고 한다. 

우선 모듈을 설치를 하자

```bash
npm install --save mongoose
```



우선 몽고DB는 [mlab](https://mlab.com/) 을 이용할 예정이다. 

1. config 파일 설정(`db uri `, `jwt encryption`등)
2. mongo db 연결

```javascript
// db/index.js

require('dotenv').config();//instatiate environment variables

let CONFIG = {} //Make this global to use all over the application

CONFIG.app          = process.env.APP   || 'dev';
CONFIG.port         = process.env.PORT  || '3000';

CONFIG.mongoUrl = process.env.MONGO_URL

CONFIG.jwt_encryption  = process.env.JWT_ENCRYPTION || 'jwt_please_change';
CONFIG.jwt_expiration  = process.env.JWT_EXPIRATION || '10000';

module.exports = CONFIG;
```

```javascript
// db/index.js

import mongoose from 'mongoose';
import config from '.';

mongoose.Promise = global.Promise;

const connectToDb = async () => {
    try {
        await mongoose.connect(config.mongoUrl, {useNewUrlParser: true, useCreateIndex: true});
        console.log('Connected to mongo!!!')        
    }
    catch (err) {
        console.error('Could not connect to MongoDB', err)        
    }
}

export default connectToDb;
```

마지막으로 `app.js` 에 db 부분을 초기화를 한다

```javascript
//app.js

import connectToDb from './config/db';

....
connectToDb();
```

추가적으로 model 을 추가해준다.

```javascript
// model/user.js

import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import passportLocalMongoose from  'passport-local-mongoose';

let userSchema = new Schema({    
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email', usernameUnique: true});

let User = mongoose.model('User',userSchema);

export default User;
```



## mongodb + passport 적용

```javascript
import express from 'express';
import passport from 'passport'
import User from '../models/user';

const router = express.Router();

router.post('/', async (req, res, next) => {
  // email 체크
  const { email, password } = req.body;

  const user = await User.find({email})

  if(!user || user.length > 0) {    
    res.json({code: 1, message: 'duplicate user'})
  } else {        
    const user = new User({email, password})
    // console.log(user)
    User.create(user)
      .then((user) => {
        res.json({code: 0, user})
      })
      .catch(err => {
        res.json({code: 1, err})
      })    
  }    
})

/* GET users listing. */
router.post('/login', function(req, res, next) {
  const { email, password } = req.body;  
  passport.authenticate('local', (authError, user, info) => {    
    console.log(authError, user, info)
    if(!user){
      res.json({code: 1, info})
      return;
    }

    res.json(user)
  })(req, res, next);  
});
```

## jsonwebtoken

- 로그인시 토큰을 생성해서 리턴값에 추가한다

```javascript
routes/users.js
...
import jwt from 'jsonwebtoken';
...

router.post('/login', isNotLoggedIn, function(req, res, next) {  
  passport.authenticate('local', (authError, user, info) => {    
    console.log(authError, user, info)
    if(!user){
      res.json({code: 1, info})
      return;
    }

    return req.login(user, {session: false}, (err) => {      
      if (err) {
        res.send(err)
      }

      console.log('user:', user)
      const token = jwt.sign({id: user._id}, process.env.jwt_encryption)      
      res.json({user, token})
  })    
  })(req, res, next);  
});


```

```javascript
// middleware

exports.isTokenLoggedIn = (passport) => passport.authenticate('jwt')	
```

```javascript
//jwtStrategy

import passportJWT from 'passport-jwt';
import User from '../models/user'

const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

module.exports = (passport) => {
    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.jwt_encryption
    }, (jwtPayload, done) => {
        console.log('jwtPayload :', jwtPayload.id)
        return User.findById(jwtPayload.id)
            .then(user => {
                console.log('#15', user)
                return done(null, user)
            })
            .catch(err => {
                return done(err)
            })
    }))
}

```





