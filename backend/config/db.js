import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pharmacy_erp';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      retryWrites: true,
      w: 'majority',
      tls: false,
      dbName: 'pharmacy_erp',
    });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('TLS') || error.message.includes('ECONNRESET') || error.message.includes('ENOTFOUND')) {
      console.error('💡 If this is an Atlas cluster, verify your IP is whitelisted in Network Access and that the Atlas username/password are correct.');
    }
    process.exit(1);
  }
};

export default connectDB;