import mongoose from 'mongoose';
import dns from 'node:dns/promises';
dns.setServers(['1.1.1.1', '1.0.0.1']);
const connectDB = async () => {
  try {
    console.log(process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error:${error.message}`);
    process.exit(1);
  }
};
export default connectDB;
