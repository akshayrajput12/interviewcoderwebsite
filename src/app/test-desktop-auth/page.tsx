'use client';

import { useState } from 'react';

export default function TestDesktopAuth() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testInitiate = async () => {
    setLoading(true);
    setResult('Testing initiate...\n');
    
    try {
      const response = await fetch('/api/auth/desktop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'initiate' })
      });

      const data = await response.json();
      setResult(prev => prev + `Status: ${response.status}\n` + JSON.stringify(data, null, 2));
      
      if (data.success && data.authUrl) {
        setResult(prev => prev + '\n\n✅ Success! You can open this URL:\n' + data.authUrl);
      }
    } catch (error) {
      setResult(prev => prev + '\n❌ Error: ' + error);
    }
    
    setLoading(false);
  };

  const testInvalidJSON = async () => {
    setLoading(true);
    setResult('Testing invalid JSON...\n');
    
    try {
      const response = await fetch('/api/auth/desktop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid-json'
      });

      const data = await response.json();
      setResult(prev => prev + `Status: ${response.status}\n` + JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(prev => prev + '\n❌ Error: ' + error);
    }
    
    setLoading(false);
  };

  const testMissingAction = async () => {
    setLoading(true);
    setResult('Testing missing action...\n');
    
    try {
      const response = await fetch('/api/auth/desktop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      const data = await response.json();
      setResult(prev => prev + `Status: ${response.status}\n` + JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(prev => prev + '\n❌ Error: ' + error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Desktop Authentication Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={testInitiate}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            Test Initiate
          </button>
          
          <button
            onClick={testInvalidJSON}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            Test Invalid JSON
          </button>
          
          <button
            onClick={testMissingAction}
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            Test Missing Action
          </button>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
          <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-96">
            {result || 'Click a test button to see results...'}
          </pre>
        </div>
        
        <div className="mt-8 p-4 bg-blue-900 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Manual Test:</h3>
          <p className="mb-2">Visit the desktop auth page directly:</p>
          <a 
            href="/login/auth/desktop" 
            className="text-blue-400 hover:text-blue-300 underline"
            target="_blank"
          >
            /login/auth/desktop
          </a>
        </div>
      </div>
    </div>
  );
}
