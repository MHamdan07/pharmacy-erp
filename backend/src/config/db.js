import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const primaryUri = process.env.MONGO_URI;
  const defaultAtlasUri = 'mongodb+srv://entermh07_db_user:password12345@cluster0.0g9n9mz.mongodb.net/pharmacy_erp?retryWrites=true&w=majority&appName=Cluster0';
  const fallbackUri = 'mongodb://127.0.0.1:27017/pharmacy_erp';

  const uriToUse = primaryUri || defaultAtlasUri || fallbackUri;

  const isSrv = uriToUse.startsWith('mongodb+srv://');
  const options = {
    serverSelectionTimeoutMS: 3000,
    connectTimeoutMS: 3000
  };

  // Only pass family: 4 for non-SRV URIs to prevent MongoParseError on Vercel
  if (!isSrv) {
    options.family = 4;
  }

  try {
    const conn = await mongoose.connect(uriToUse, options);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

export default connectDB;