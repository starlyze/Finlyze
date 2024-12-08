import mongoose, {ConnectOptions} from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as ConnectOptions);
    console.log('Connected to DB');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
