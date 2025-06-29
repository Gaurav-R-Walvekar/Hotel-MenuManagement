const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment variables...\n');

const envContent = `# MongoDB Connection Configuration
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://gaurav2851997:yTNk3K86fnWChvwd@hotelmanagement.eork9td.mongodb.net/?retryWrites=true&w=majority&appName=HotelManagement

# Database name (will be created if it doesn't exist)
DB_NAME=hotelmanagement

# Server port
PORT=5000
`;

const envPath = path.join(__dirname, '.env');

try {
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists. Skipping creation.');
  } else {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
  }
  
  console.log('\n📋 Environment variables configured:');
  console.log('   - MONGODB_URI: Your MongoDB Atlas connection string');
  console.log('   - DB_NAME: hotelmanagement');
  console.log('   - PORT: 5000');
  
  console.log('\n🚀 You can now start your server with: npm start');
  
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  console.log('\n📝 Please manually create a .env file with the following content:');
  console.log(envContent);
} 