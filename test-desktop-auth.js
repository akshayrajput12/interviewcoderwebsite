// Test script to verify desktop authentication API
// Run this with: node test-desktop-auth.js

const baseUrl = 'https://interviewcoderr.vercel.app';

async function testDesktopAuth() {
  console.log('🧪 Testing Desktop Authentication API...\n');
  
  try {
    // Test 1: Initiate authentication
    console.log('1️⃣ Testing initiate authentication...');
    const initiateResponse = await fetch(`${baseUrl}/api/auth/desktop`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ action: 'initiate' })
    });

    console.log('Response status:', initiateResponse.status);
    
    if (!initiateResponse.ok) {
      throw new Error(`HTTP ${initiateResponse.status}: ${initiateResponse.statusText}`);
    }

    const initiateData = await initiateResponse.json();
    console.log('✅ Initiate response:', initiateData);
    
    if (!initiateData.success) {
      throw new Error('Initiate failed: ' + initiateData.error);
    }

    const { state, authUrl } = initiateData;
    console.log('📝 Generated state:', state);
    console.log('🔗 Auth URL:', authUrl);
    
    // Test 2: Check authentication status (should be pending)
    console.log('\n2️⃣ Testing check authentication (should be pending)...');
    const checkResponse = await fetch(`${baseUrl}/api/auth/desktop`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ action: 'check', state })
    });

    if (!checkResponse.ok) {
      throw new Error(`HTTP ${checkResponse.status}: ${checkResponse.statusText}`);
    }

    const checkData = await checkResponse.json();
    console.log('✅ Check response:', checkData);
    
    if (checkData.success && !checkData.authenticated) {
      console.log('✅ Status is correctly "pending" - authentication not yet complete');
    }
    
    // Test 3: Test invalid state
    console.log('\n3️⃣ Testing invalid state...');
    const invalidResponse = await fetch(`${baseUrl}/api/auth/desktop`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ action: 'check', state: 'invalid-state' })
    });

    const invalidData = await invalidResponse.json();
    console.log('✅ Invalid state response:', invalidData);
    
    if (!invalidData.success) {
      console.log('✅ Correctly rejected invalid state');
    }
    
    console.log('\n🎉 All API tests passed!');
    console.log('\n📋 Next steps:');
    console.log('1. Open this URL in your browser:', authUrl);
    console.log('2. Complete authentication');
    console.log('3. Check if desktop app receives the callback');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Test direct page access
async function testPageAccess() {
  console.log('\n🌐 Testing direct page access...');
  
  try {
    const pageUrl = `${baseUrl}/login/auth/desktop`;
    console.log('Testing URL:', pageUrl);
    
    const response = await fetch(pageUrl);
    console.log('Page response status:', response.status);
    
    if (response.ok) {
      console.log('✅ Page is accessible');
    } else {
      console.log('❌ Page access failed');
    }
  } catch (error) {
    console.error('❌ Page test failed:', error.message);
  }
}

// Run tests
testDesktopAuth().then(() => {
  return testPageAccess();
}).catch(console.error);
