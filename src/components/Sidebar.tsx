'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const Sidebar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Withdraw History', href: '/withdraw-history', icon: '⏰' },
    { name: 'Leader Board', href: '/leader-board', icon: '📈' },
    { name: 'My Tree', href: '/my-tree', icon: '🌳' },
    { name: 'Reward List', href: '/reward-list', icon: '🎁' },
    { name: 'Courses', href: '/courses', icon: '🎓' },
    { name: 'Product List', href: '/product-list', icon: '📋' },
    { name: 'Product Requests', href: '/product-requests', icon: '🛒' },
    { name: 'Create Account', href: '/create-account', icon: '👤+' },
    { name: 'Buy Pin Code', href: '/buy-pin-code', icon: '🔢' },
    { name: 'View Pin Code', href: '/view-pin-code', icon: '👁️' },
    { name: 'Change Password', href: '/change-password', icon: '🔒' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-deep-indigo text-white rounded-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        ☰
      </button>

      {/* Sidebar Container with spacing */}
      <div className="lg:flex lg:flex-col lg:h-screen lg:p-4 lg:bg-gray-50">
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-deep-indigo transform transition-transform duration-300 ease-in-out
          lg:rounded-2xl lg:shadow-xl lg:h-[calc(100vh-2rem)]
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Single scrollable container for all content */}
          <div className="h-full overflow-y-auto overflow-x-hidden sidebar-scroll">
            {/* User Profile Section */}
            <div className="p-6 border-b border-deep-indigo-500">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3">
                  <span className="text-deep-indigo-600 font-bold text-sm">SKN</span>
                </div>
                <h3 className="text-white font-semibold text-lg">zohaib</h3>
                <p className="text-gray-300 text-sm">zohaibishfaq.ajk@gmail.com</p>
                <div className="flex items-center mt-2">
                  <span className="text-gray-300 text-sm">03367516504</span>
                  <button className="ml-2 text-gray-300 hover:text-white">
                    👁️
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="px-4 py-6 space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                      ${isActive 
                        ? 'bg-white text-deep-indigo-600' 
                        : 'text-gray-300 hover:bg-deep-indigo-500 hover:text-white'
                      }
                    `}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-deep-indigo-500">
              <button className="w-full flex items-center justify-center px-4 py-3 bg-deep-indigo text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium">
                🚪 LOG OUT
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar; 