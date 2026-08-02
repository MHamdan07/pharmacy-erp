import mongoose from 'mongoose';
import dns from 'dns';

// Ensure IPv4 DNS resolution for MongoDB Atlas SRV query resolution in Node 17+ and Serverless environments
if (dns && typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const primaryUri = process.env.MONGO_URI;
  const defaultAtlasUri = 'mongodb+srv://entermh07_db_user:password12345@cluster0.0g9n9mz.mongodb.net/pharmacy_erp?retryWrites=true&w=majority&appName=Cluster0';
  const fallbackUri = 'mongodb://127.0.0.1:27017/pharmacy_erp';

  const uriToUse = primaryUri || defaultAtlasUri || fallbackUri;

  try {
    const conn = await mongoose.connect(uriToUse, {
      serverSelectionTimeoutMS: 15000
    });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

export default connectDB;