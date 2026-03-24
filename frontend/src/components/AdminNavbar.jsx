import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LogOut, Menu as MenuIcon, X, LayoutDashboard, Package, Database } from 'lucide-react';
import Button from './Button';

export default function AdminNavbar() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Order Logs', path: '/admin/orders', icon: Package },
    { name: 'Inventory DB', path: '/admin/inventory', icon: Database },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Section */}
          <Link to="/admin/dashboard" className="flex items-center gap-2 group z-10 pl-2 sm:pl-0">
            <img 
              src="/logo.png" 
              alt="VitaEats Logo" 
              className="h-24 sm:h-32 lg:h-36 w-auto object-contain transform -mx-2 -translate-y-1 group-hover:scale-105 transition-all duration-300"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230a4b2f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 22s5-3 10-3 10 3 10 3'/%3E%3Cpath d='M12 19v-6'/%3E%3Cpath d='M12 13V5'/%3E%3Cpath d='M16 9c0-3.5-2.5-4-4-4S8 5.5 8 9s2.5 4 4 4 4-2.5 4-4z'/%3E%3C/svg%3E";
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={`flex items-center gap-2 text-sm font-semibold tracking-wide transition-colors duration-300 hover:text-accent 
                  ${isActive(link.path) ? 'text-primary' : 'text-gray-600'}`}
                >
                  <Icon size={16} /> {link.name}
                </Link>
              )
            })}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-6 border-l border-gray-200 pl-6">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col text-right">
                   <span className="text-sm font-bold text-gray-900 leading-tight">{user.name}</span>
                   <span className="text-xs font-mono text-primary uppercase tracking-widest leading-tight">Master Admin</span>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors rounded-full"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/user/login">
                <Button variant="primary" size="sm" className="rounded-full px-6">Login</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-4">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-600 hover:text-primary focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <MenuIcon size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-4 rounded-xl text-base font-semibold transition-all
                  ${isActive(link.path) ? 'bg-green-50 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Icon size={20} /> {link.name}
                </Link>
              )
            })}
            
            <div className="pt-4 border-t border-gray-100 mt-4 px-2">
              {user && (
                <button 
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full text-left flex items-center justify-between px-4 py-4 rounded-xl text-red-500 hover:bg-red-50 font-bold"
                >
                  Terminate Session <LogOut size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
