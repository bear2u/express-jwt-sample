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

## Passpoart 설정

```bash
npm install --save passport passport-local --save
```

`passport-local`은 `email + password` 로 로그인시 이용된다. 

