'use client';

import { useState, useEffect } from 'react';
import { useSessionMonitor } from '@/hooks/useSessionMonitor';
import { debugSession, clearAuthData } from '@/utils/session-debug';

interface SessionDebuggerProps {
  isVisible?: boolean;
}

export default function SessionDebugger({ isVisible = false }: SessionDebuggerProps) {
  const [showDebugger, setShowDebugger] = useState(isVisible);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const sessionMonitor = useSessionMonitor();

  const handleDebugSession = async () => {
    const info = await debugSession();
    setDebugInfo(info);
  };

  const handleClearAuth = () => {
    clearAuthData();
    window.location.reload();
  };

  const formatTime = (ms: number | null) => {
    if (!ms) return 'N/A';
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  // Show debugger in development or when explicitly enabled
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setShowDebugger(true);
    }
  }, []);

  if (!showDebugger) {
    return (
      <button
        onClick={() => setShowDebugger(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-1 rounded text-xs z-50"
      >
        Debug Session
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md z-50 text-xs">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Session Debug</h3>
        <button
          onClick={() => setShowDebugger(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2">
        <div>
          <strong>Status:</strong> {sessionMonitor.isLoading ? 'Loading...' : 'Ready'}
        </div>
        
        <div>
          <strong>User:</strong> {sessionMonitor.session?.user?.email || 'Not logged in'}
        </div>
        
        <div>
          <strong>Session Expired:</strong> {sessionMonitor.isExpired ? 'Yes' : 'No'}
        </div>
        
        <div>
          <strong>Time Until Expiry:</strong> {formatTime(sessionMonitor.timeUntilExpiry)}
        </div>
        
        <div>
          <strong>Last Refresh:</strong> {sessionMonitor.lastRefresh?.toLocaleTimeString() || 'Never'}
        </div>
        
        {sessionMonitor.error && (
          <div className="text-red-400">
            <strong>Error:</strong> {sessionMonitor.error}
          </div>
        )}
        
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleDebugSession}
            className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
          >
            Debug
          </button>
          
          <button
            onClick={sessionMonitor.checkSession}
            className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
          >
            Check
          </button>
          
          <button
            onClick={sessionMonitor.refreshSession}
            className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-xs"
          >
            Refresh
          </button>
          
          <button
            onClick={handleClearAuth}
            className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
          >
            Clear
          </button>
        </div>
        
        {debugInfo && (
          <div className="mt-3 p-2 bg-gray-800 rounded text-xs max-h-32 overflow-y-auto">
            <strong>Debug Info:</strong>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
