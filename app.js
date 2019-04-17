import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';
import userRouter from './routes/users';

import passport from 'passport'
import localStrategy from './passport'

import connectToDb from './config/db';

connectToDb();

const app = express();

app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

localStrategy(passport);

app.use('/', indexRouter);
app.use('/users', userRouter);

export default app;