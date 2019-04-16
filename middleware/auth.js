export const ensureAuthenticated = (req, res ,next) => {
    if (req.isAuthenticated()) { return next(); }

    res.json({status: 'login failed'})
}