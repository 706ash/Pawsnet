'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBell, FaUser, FaBars, FaTimes, FaQrcode } from 'react-icons/fa';
import NotificationPopup from './NotificationPopup';
import ProfilePopup from './ProfilePopup';
import QRScannerPopup from './QRScannerPopup';

export default function Navbar() {
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [notificationCount, setNotificationCount] = useState(3);

  useEffect(() => {
    const storedCount = localStorage.getItem('notificationCount');
    if (storedCount) setNotificationCount(parseInt(storedCount));
    localStorage.setItem('notificationCount', notificationCount.toString());

    const handleStorageChange = () => {
      const updatedCount = localStorage.getItem('notificationCount');
      if (updatedCount) setNotificationCount(parseInt(updatedCount));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [notificationCount]);

  const togglePopup = (popup: string) => {
    setActivePopup((prev) => (prev === popup ? null : popup));
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center">
          <div className="relative h-10 w-10 mr-2">
            <Image
              src="https://images.unsplash.com/photo-1560807707-8cc77767d783"
              alt="Paswnet Logo"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
              unoptimized
            />
          </div>
          <span className="text-xl font-bold text-indigo-600">Paswnet</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {['Dashboard', 'My Pets', 'Community', 'Services'].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(' ', '')}`}
              className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {[
            { icon: <FaQrcode size={20} />, popup: 'QRScanner', component: QRScannerPopup },
            { icon: <FaBell size={20} />, popup: 'Notifications', component: NotificationPopup },
            { icon: <FaUser size={20} />, popup: 'Profile', component: ProfilePopup },
          ].map(({ icon, popup, component: Component }) => (
            <div key={popup} className="relative">
              <button
                onClick={() => togglePopup(popup)}
                className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 p-2"
              >
                {icon}
                {popup === 'Notifications' && notificationCount > 0 && (
                  <span className="notification-badge">{notificationCount}</span>
                )}
              </button>
              {activePopup === popup && (
                <Component
                  onClose={() => setActivePopup(null)}
                  onScan={(result: string) => setScanResult(result)}
                />
              )}
            </div>
          ))}

          <button
            className="md:hidden text-gray-700 dark:text-gray-200 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col space-y-4 px-4">
            {['Dashboard', 'My Pets', 'Community', 'Services'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(' ', '')}`}
                className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}

      {scanResult && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-xs z-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">QR Code Scanned</h3>
            <button
              onClick={() => setScanResult(null)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <FaTimes size={16} />
            </button>
          </div>
          <p className="text-sm break-all">{scanResult}</p>
        </div>
      )}
    </nav>
  );
}