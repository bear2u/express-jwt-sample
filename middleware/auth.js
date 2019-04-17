exports.isTokenLoggedIn = (passport) => passport.authenticate('jwt')

exports.isLoggedIn = (req, res, next) => {

    console.log(req)

    if (req.isAuthenticated()) { next(); return;}

    res.status(403).json({code: 1, msg: 'login failed' })
}

exports.isNotLoggedIn = (req, res, next) => {
    console.log('isNotLoggedIn : ', req.isAuthenticated())
    if(!req.isAuthenticated()){
        next()
    } else {
        res.redirect('/')
    }
}