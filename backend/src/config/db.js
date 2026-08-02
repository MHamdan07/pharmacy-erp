import mongoose from 'mongoose';
import dns from 'dns';

// Ensure IPv4 DNS resolution for MongoDB Atlas SRV query resolution in Node 17+ and Serverless environments
if (dns && typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

let cachedPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (!cachedPromise) {
    const primaryUri = process.env.MONGO_URI;
    const defaultAtlasUri = 'mongodb+srv://entermh07_db_user:password12345@cluster0.0g9n9mz.mongodb.net/pharmacy_erp?retryWrites=true&w=majority&appName=Cluster0';
    const fallbackUri = 'mongodb://127.0.0.1:27017/pharmacy_erp';

    const uriToUse = primaryUri || defaultAtlasUri || fallbackUri;

    cachedPromise = mongoose.connect(uriToUse, {
      serverSelectionTimeoutMS: 10000,
      bufferCommands: false
    }).then(conn => {
      console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
      return conn;
    }).catch(err => {
      cachedPromise = null;
      console.error(`❌ MongoDB Connection Error: ${err.message}`);
      throw err;
    });
  }

  return cachedPromise;
};

export default connectDB;