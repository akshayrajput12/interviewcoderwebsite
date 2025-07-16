'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { supabaseClient } from '@/utils/supabase-client';

export default function TestAuthPage() {
  const { user, session, loading } = useAuth();
  const [serverSession, setServerSession] = useState<any>(null);
  const [clientSession, setClientSession] = useState<any>(null);

  useEffect(() => {
    const checkSessions = async () => {
      // Check client session
      const { data: { session: clientSess } } = await supabaseClient.auth.getSession();
      setClientSession(clientSess);

      // Check server session via API
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setServerSession({ success: true, profile: data.profile });
        } else {
          setServerSession({ success: false, status: response.status });
        }
      } catch (error) {
        setServerSession({ success: false, error: error.message });
      }
    };

    if (!loading) {
      checkSessions();
    }
  }, [loading]);

  if (loading) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Test</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Auth Context</h2>
          <p>Loading: {loading.toString()}</p>
          <p>User: {user ? user.email : 'null'}</p>
          <p>Session: {session ? 'exists' : 'null'}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Client Session</h2>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(clientSession ? {
              user_id: clientSession.user?.id,
              email: clientSession.user?.email,
              expires_at: clientSession.expires_at,
              token_type: clientSession.token_type
            } : null, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Server Session (via API)</h2>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(serverSession, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Cookies</h2>
          <pre className="text-xs overflow-auto">
            {typeof window !== 'undefined' ? document.cookie : 'N/A'}
          </pre>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">LocalStorage Auth Keys</h2>
          <pre className="text-xs overflow-auto">
            {typeof window !== 'undefined' ? 
              JSON.stringify(
                Object.keys(localStorage)
                  .filter(key => key.includes('supabase') || key.includes('auth'))
                  .reduce((obj, key) => {
                    try {
                      obj[key] = JSON.parse(localStorage.getItem(key) || '');
                    } catch {
                      obj[key] = localStorage.getItem(key);
                    }
                    return obj;
                  }, {} as any),
                null, 2
              ) : 'N/A'
            }
          </pre>
        </div>
      </div>
    </div>
  );
}
