import mongoose from 'mongoose';
import config from '.';

mongoose.Promise = global.Promise;

const connectToDb = async () => {
    try {
        await mongoose.connect(config.mongoUrl, {useNewUrlParser: true, useCreateIndex: true});
        console.log('Connected to mongo!!!')        
    }
    catch (err) {
        console.error('Could not connect to MongoDB', err)        
    }
}

export default connectToDb;