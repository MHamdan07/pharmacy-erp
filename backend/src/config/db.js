import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const primaryUri = process.env.MONGO_URI;
  const fallbackUri = 'mongodb://127.0.0.1:27017/pharmacy_erp';

  try {
    const conn = await mongoose.connect(primaryUri || fallbackUri, {
      serverSelectionTimeoutMS: 15000,
      family: 4 // Use IPv4 to avoid ETIMEOUT on SRV DNS resolution
    });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Primary MongoDB Connection Failed: ${error.message}`);
    if (primaryUri) {
      console.log('🔄 Attempting fallback connection to local MongoDB (127.0.0.1:27017)...');
      try {
        const localConn = await mongoose.connect(fallbackUri, {
          family: 4
        });
        console.log(`🍃 Local MongoDB Connected: ${localConn.connection.host}`);
        return;
      } catch (localErr) {
        console.error(`❌ Local MongoDB also unavailable: ${localErr.message}`);
      }
    }
    console.error('💡 To fix MongoDB connection: Ensure your network allows outbound connections to MongoDB Atlas or start a local MongoDB service.');
  }
};

export default connectDB;