import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const primaryUri = process.env.MONGO_URI;
  // Direct seedlist URI to avoid Vercel AWS Lambda SRV DNS lookup timeouts
  const defaultAtlasUri = 'mongodb://entermh07_db_user:password12345@ac-yl21gbg-shard-00-00.0g9n9mz.mongodb.net:27017,ac-yl21gbg-shard-00-01.0g9n9mz.mongodb.net:27017,ac-yl21gbg-shard-00-02.0g9n9mz.mongodb.net:27017/pharmacy_erp?ssl=true&replicaSet=atlas-13c59o-shard-0&authSource=admin&retryWrites=true&w=majority';
  const fallbackUri = 'mongodb://127.0.0.1:27017/pharmacy_erp';

  const uriToUse = primaryUri || defaultAtlasUri || fallbackUri;

  const options = {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    family: 4
  };

  try {
    const conn = await mongoose.connect(uriToUse, options);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

export default connectDB;