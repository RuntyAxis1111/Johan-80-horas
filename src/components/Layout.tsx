import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Timer, BarChart3, Settings } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-white">Johan 80 Horas</h1>
            </div>
            
            <nav className="flex space-x-8">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-900'
                }`}
              >
                <Timer size={18} />
                <span>Timer</span>
              </Link>
              
              <Link
                to="/analytics"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/analytics' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-900'
                }`}
              >
                <BarChart3 size={18} />
                <span>Analytics</span>
              </Link>
              
              <Link
                to="/settings"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/settings' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-900'
                }`}
              >
                <Settings size={18} />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Floating timer button for other pages */}
      {location.pathname !== '/' && (
        <Link
          to="/"
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors z-50"
          aria-label="Ir al temporizador"
        >
          <Timer size={24} />
        </Link>
      )}
    </div>
  );
};

export default Layout;