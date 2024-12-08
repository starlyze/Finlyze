import mongoose, {ConnectOptions} from 'mongoose';
import {mongoURI} from './secrets';

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI!, {
      dbName: "finlyze"
    });
    console.log('Connected to DB');
  } catch (err) {
    console.error(err);
  }
}
