import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  console.log('⏳ Connecting to MongoDB Atlas...');
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from your .env file!');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      retryWrites: true,
      w: 'majority',
      tls: true,
      dbName: 'pharmacy_erp',
    });
    
    console.log('🍃 MongoDB Atlas Connected Successfully!');

    // Clear existing users
    await User.deleteMany();
    console.log('🧹 Cleaned up old users table...');

    // Create default System Owner account
    await User.create({
      name: 'System Owner',
      email: 'admin@pharmacy.com',
      password: 'adminpassword123',
      role: 'Owner'
    });

    console.log('✅ Default Owner created successfully!');
    console.log('📧 Email: admin@pharmacy.com');
    console.log('🔑 Password: adminpassword123');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Connection Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();