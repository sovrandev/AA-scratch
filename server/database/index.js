const mongoose = require('mongoose');

// Set mongoose mode to strict and deactive auto indexing
mongoose.set('strictQuery', true);
mongoose.set('autoIndex', false);

const connectDB = async() => {
    try {
        // Use environment variable for MongoDB URI with proper credentials
        const conn = await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            authSource: 'admin'  // Explicitly specify auth source
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch(err) {
        console.error(`ERROR: ${err.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;
