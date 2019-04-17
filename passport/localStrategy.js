
import passportLocal from 'passport-local'
import User from '../models/user'

const LocalStrategy = passportLocal.Strategy

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        console.log('serializeUser :', user)
        done(null, user._id)
    })

    passport.deserializeUser((id, done) => {
        console.log('deserializeUser, ', id)
        User.findById(id)
            .then((user) => done(err,user))
    })

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',        
    }, (email, password, done) => {
        console.log(email, password)

        return User.findOne({email, password})
            .then( user => {
                console.log(user)
                if(!user)
                    return done(null, false, {message: 'not found user'})                
                return done(
                    null,
                    user
                )
            })
            .catch(err => done(err))        
    }));
}

