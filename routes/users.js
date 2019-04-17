import express from 'express';
import passport from 'passport'
import User from '../models/user';
import jwt from 'jsonwebtoken';
import { isLoggedIn, isNotLoggedIn, isTokenLoggedIn } from '../middleware/auth'

const router = express.Router();

router.post('/', isNotLoggedIn, async (req, res, next) => {
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

router.get('/:id', isTokenLoggedIn(passport), async (req, res, next) => {
  const id = req.params.id
  console.log(id)
  res.json({id})

})

/* GET users listing. */
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


module.exports = router;
