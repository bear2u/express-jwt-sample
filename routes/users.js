import express from 'express';
import passport from 'passport'

const router = express.Router();

/* GET users listing. */
router.post('/', passport.authenticate('local', {
  failureRedirect: '/'
}), function(req, res, next) {
  res.json({ok: 'ok2'})
  // res.redirect('/login_success');
});

router.get('/login_success', ensureAuthenticated, (req, res) => {
  res.send(req.user);
})

function ensureAuthenticated(req, res ,next) {
  if (req.isAuthenticated()) { return next(); }

  res.json({status: 'login failed'})
}

module.exports = router;
