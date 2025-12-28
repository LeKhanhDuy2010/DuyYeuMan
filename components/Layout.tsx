
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, LogOut, Home, Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-md border-b border-white/30 px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-rose-600">
          <Heart className="w-6 h-6 fill-current" />
          <span className="font-romantic text-2xl font-bold tracking-tight">Love Journey</span>
        </Link>
        <div className="flex items-center space-x-4">
          {location.pathname !== '/' && (
            <Link to="/" className="p-2 text-rose-600 hover:bg-rose-50 rounded-full transition-colors">
              <Home className="w-6 h-6" />
            </Link>
          )}
          {user ? (
            <>
              <Link to="/admin" className="p-2 text-rose-600 hover:bg-rose-50 rounded-full transition-colors">
                <Settings className="w-6 h-6" />
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </>
          ) : (
            <Link to="/login" className="p-2 text-rose-600 hover:bg-rose-50 rounded-full transition-colors">
              <Settings className="w-6 h-6" />
            </Link>
          )}
        </div>
      </nav>

      <main className="flex-grow pt-24 pb-12">
        {children}
      </main>

      <footer className="py-8 text-center text-rose-400 text-sm font-light">
        <p>Created with Love &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Layout;
