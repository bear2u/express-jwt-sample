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