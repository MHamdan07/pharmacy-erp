import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const primaryUri = process.env.MONGO_URI;
  const fallbackUri = 'mongodb://127.0.0.1:27017/pharmacy_erp';
  const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';

  const uriToUse = primaryUri || (!isProduction ? fallbackUri : null);

  if (!uriToUse) {
    const errorMsg = '❌ MONGO_URI is missing. Please set MONGO_URI in your Vercel Environment Variables with your MongoDB Atlas connection string.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const conn = await mongoose.connect(uriToUse, {
      serverSelectionTimeoutMS: 15000,
      family: 4 // Use IPv4 to avoid ETIMEOUT on SRV DNS resolution
    });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (!isProduction && primaryUri) {
      console.log('🔄 Attempting fallback connection to local MongoDB (127.0.0.1:27017)...');
      try {
        const localConn = await mongoose.connect(fallbackUri, { family: 4 });
        console.log(`🍃 Local MongoDB Connected: ${localConn.connection.host}`);
        return;
      } catch (localErr) {
        console.error(`❌ Local MongoDB also unavailable: ${localErr.message}`);
      }
    }
    throw error;
  }
};

export default connectDB;