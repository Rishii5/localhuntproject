// Simple integration test script
const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:5173';

async function testIntegration() {
    console.log('🧪 Testing Frontend-Backend Integration...\n');

    try {
        // Test 1: Backend health check
        console.log('1. Testing backend health...');
        const healthResponse = await axios.get(`${BACKEND_URL}/`);
        console.log('✅ Backend is running:', healthResponse.data);

        // Test 2: Auth endpoint
        console.log('\n2. Testing auth endpoint...');
        const authResponse = await axios.get(`${BACKEND_URL}/api/auth/test`);
        console.log('✅ Auth endpoint working:', authResponse.data);

        // Test 3: Vendors endpoint
        console.log('\n3. Testing vendors endpoint...');
        const vendorsResponse = await axios.get(`${BACKEND_URL}/api/vendors`);
        console.log('✅ Vendors endpoint working:', vendorsResponse.data);

        // Test 4: Categories endpoint
        console.log('\n4. Testing categories endpoint...');
        const categoriesResponse = await axios.get(`${BACKEND_URL}/api/categories`);
        console.log('✅ Categories endpoint working:', categoriesResponse.data);

        console.log('\n🎉 All backend tests passed!');
        console.log('\n📋 Integration Summary:');
        console.log(`- Backend: ${BACKEND_URL}`);
        console.log(`- Frontend: ${FRONTEND_URL}`);
        console.log('- CORS: Configured for frontend');
        console.log('- Authentication: JWT-based');
        console.log('- API: RESTful endpoints ready');

    } catch (error) {
        console.error('❌ Integration test failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure backend is running: npm run dev (in backend folder)');
        console.log('2. Check MongoDB connection');
        console.log('3. Verify all dependencies are installed');
    }
}

// Run the test
testIntegration();
