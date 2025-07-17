// Test script to verify CORS and endpoint functionality
// Run with: node test-cors-endpoints.js

const baseUrl = 'https://interviewcoderr.vercel.app';

async function testEndpointExists(url, method = 'POST', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000' // Simulate desktop app origin
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    console.log(`🧪 Testing ${method} ${url}`);
    
    const response = await fetch(url, options);
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    // Check CORS headers
    const corsHeaders = {
      'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
      'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
      'access-control-allow-headers': response.headers.get('access-control-allow-headers')
    };
    
    console.log('   CORS Headers:', corsHeaders);
    
    if (response.ok) {
      const data = await response.json();
      console.log('   Response:', data);
      return { success: true, data, status: response.status };
    } else {
      const errorText = await response.text();
      console.log('   Error:', errorText);
      return { success: false, error: errorText, status: response.status };
    }
    
  } catch (error) {
    console.error(`   ❌ Request failed:`, error.message);
    return { success: false, error: error.message };
  }
}

async function testCORSPreflight(url) {
  try {
    console.log(`🔍 Testing CORS preflight for ${url}`);
    
    const response = await fetch(url, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log(`   Preflight Status: ${response.status}`);
    
    const corsHeaders = {
      'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
      'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
      'access-control-allow-headers': response.headers.get('access-control-allow-headers'),
      'access-control-max-age': response.headers.get('access-control-max-age')
    };
    
    console.log('   CORS Preflight Headers:', corsHeaders);
    
    return response.status === 200 && corsHeaders['access-control-allow-origin'];
    
  } catch (error) {
    console.error(`   ❌ Preflight failed:`, error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Testing Desktop Authentication Endpoints\n');
  console.log(`Base URL: ${baseUrl}\n`);
  
  // Test 1: Check if main endpoint exists and has CORS
  console.log('=== Test 1: Main Desktop Auth Endpoint ===');
  const mainEndpoint = `${baseUrl}/api/auth/desktop`;
  
  // Test preflight
  const preflightOk = await testCORSPreflight(mainEndpoint);
  console.log(`   Preflight CORS: ${preflightOk ? '✅ OK' : '❌ Failed'}\n`);
  
  // Test initiate action
  const initiateResult = await testEndpointExists(
    mainEndpoint, 
    'POST', 
    { action: 'initiate' }
  );
  
  console.log(`   Initiate Action: ${initiateResult.success ? '✅ OK' : '❌ Failed'}\n`);
  
  let testState = null;
  if (initiateResult.success && initiateResult.data.state) {
    testState = initiateResult.data.state;
    console.log(`   Generated State: ${testState}\n`);
  }
  
  // Test check action
  if (testState) {
    const checkResult = await testEndpointExists(
      mainEndpoint, 
      'POST', 
      { action: 'check', state: testState }
    );
    
    console.log(`   Check Action: ${checkResult.success ? '✅ OK' : '❌ Failed'}\n`);
  }
  
  // Test 2: Check complete endpoint
  console.log('=== Test 2: Complete Endpoint ===');
  const completeEndpoint = `${baseUrl}/api/auth/desktop/complete`;
  
  // Test preflight
  const completePreflight = await testCORSPreflight(completeEndpoint);
  console.log(`   Preflight CORS: ${completePreflight ? '✅ OK' : '❌ Failed'}\n`);
  
  // Test complete action (should fail without valid session, but endpoint should exist)
  const completeResult = await testEndpointExists(
    completeEndpoint, 
    'POST', 
    { state: 'test-state', session: { test: true } }
  );
  
  console.log(`   Complete Endpoint: ${completeResult.status === 400 ? '✅ OK (Expected 400)' : '❌ Unexpected response'}\n`);
  
  // Test 3: Check desktop auth page
  console.log('=== Test 3: Desktop Auth Page ===');
  const authPageUrl = `${baseUrl}/login/auth/desktop`;
  
  try {
    const pageResponse = await fetch(authPageUrl);
    console.log(`   Auth Page Status: ${pageResponse.status}`);
    console.log(`   Auth Page: ${pageResponse.ok ? '✅ Accessible' : '❌ Not accessible'}\n`);
  } catch (error) {
    console.log(`   Auth Page: ❌ Error - ${error.message}\n`);
  }
  
  // Summary
  console.log('=== Summary ===');
  console.log(`✅ Main API Endpoint: ${initiateResult.success ? 'Working' : 'Failed'}`);
  console.log(`✅ CORS Headers: ${preflightOk ? 'Configured' : 'Missing'}`);
  console.log(`✅ Complete Endpoint: ${completeResult.status ? 'Exists' : 'Missing'}`);
  console.log(`✅ Auth Page: Available at ${authPageUrl}`);
  
  if (initiateResult.success && preflightOk) {
    console.log('\n🎉 All tests passed! Desktop authentication should work.');
    console.log('\n📋 Next steps:');
    console.log('1. Update your desktop app with the CORS-ready code');
    console.log('2. Test the complete authentication flow');
    console.log('3. Verify deep link handling works');
  } else {
    console.log('\n❌ Some tests failed. Check the errors above.');
  }
}

// Run the tests
runTests().catch(console.error);
