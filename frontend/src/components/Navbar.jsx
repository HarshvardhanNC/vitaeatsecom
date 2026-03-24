import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import { ShoppingBag, User as UserIcon, LogOut, Menu as MenuIcon, X } from 'lucide-react';
import Button from './Button';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Menu', path: '/menu' },
    { name: 'Build a Bowl', path: '/build-bowl' },
    { name: 'Subscription', path: '/subscription' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Section */}
          <Link to="/home" className="flex items-center gap-2 group z-10 pl-2 sm:pl-0">
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
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`text-sm font-semibold tracking-wide transition-colors duration-300 hover:text-accent ${isActive(link.path) ? 'text-primary' : 'text-gray-600'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User & Cart Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {user.role !== 'admin' && (
                  <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary transition-colors rounded-full hover:bg-green-50">
                    <ShoppingBag size={22} />
                    {cartCount > 0 && (
                      <span className="absolute top-0 right-0 bg-accent text-white text-[10px] sm:text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}
                
                <Link to="/user/profile" className="flex items-center gap-2 p-2 text-gray-600 hover:text-primary transition-colors rounded-full hover:bg-green-50">
                  <UserIcon size={22} />
                  <span className="text-sm font-semibold max-w-[100px] truncate">{user.name}</span>
                </Link>

                <button 
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 ml-2"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/user/login" className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">
                  Log in
                </Link>
                <Link to="/user/register">
                  <Button variant="primary" size="sm" className="rounded-full px-5">Sign up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-4">
            {user && user.role !== 'admin' && (
              <Link to="/cart" className="relative text-gray-600">
                <ShoppingBag size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
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
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-4 rounded-xl text-base font-semibold ${isActive(link.path) ? 'bg-green-50 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-gray-100 mt-4">
              {user ? (
                <>
                  <Link 
                    to="/user/profile" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-600 hover:bg-green-50 hover:text-primary"
                  >
                    <UserIcon size={20} /> Profile ({user.name})
                  </Link>
                  <button 
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="w-full text-left flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 mt-1"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 px-3">
                  <Link to="/user/login" onClick={() => setIsOpen(false)} className="w-full">
                    <Button variant="outline" className="w-full">Log in</Button>
                  </Link>
                  <Link to="/user/register" onClick={() => setIsOpen(false)} className="w-full">
                    <Button variant="primary" className="w-full">Sign up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
