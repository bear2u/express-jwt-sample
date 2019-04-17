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