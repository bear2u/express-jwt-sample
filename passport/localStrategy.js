import passport from 'passport'
import passport_local from 'passport-local'

const LocalStrategy = passport_local.Strategy

module.exports = () => {
    passport.serializeUser((user, done) => {
        console.log('111', user)
        done(null, user)
    })

    passport.deserializeUser((user, done) => {
        console.log('222', user)
        done(null, user);
    })

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: false
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

