'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    router.push('/');
  };



  const handleSettings = () => {
    setIsOpen(false);
    router.push('/settings');
  };

  const handleHelp = () => {
    setIsOpen(false);
    router.push('/help');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button with FREE badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-10 h-10 bg-yellow-400 rounded-full hover:bg-yellow-500 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black"
      >
        <span className="text-black font-semibold text-lg">
          {user?.email?.charAt(0).toUpperCase() || 'U'}
        </span>
        {/* FREE badge */}
        <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
          FREE
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-lg shadow-xl border border-gray-700 py-2 z-50">
          {/* Settings - Yellow background */}
          <button
            onClick={handleSettings}
            className="w-full px-4 py-3 text-left text-black bg-[#F8E71C] hover:bg-[#FFD700] transition-colors font-medium rounded-t-lg"
          >
            Settings
          </button>

          {/* Help */}
          <button
            onClick={handleHelp}
            className="w-full px-4 py-3 text-left text-white hover:bg-gray-800 transition-colors font-medium"
          >
            Help
          </button>

          {/* Divider */}
          <div className="border-t border-gray-700 my-1"></div>

          {/* Log out - Red text */}
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-3 text-left text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors font-medium"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}