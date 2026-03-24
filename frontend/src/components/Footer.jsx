import React from 'react';
import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
          <div className="flex items-center gap-2 text-primary font-bold text-2xl mb-2">
            <Leaf className="w-6 h-6 text-accent" /> VitaEats
          </div>
          <p className="text-gray-500 text-sm">Healthy Food That Actually Tastes Good</p>
        </div>
        
        <div className="flex gap-6 text-sm text-gray-500">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Contact Us</a>
        </div>
      </div>
      <div className="text-center text-gray-400 text-xs mt-8">
        &copy; {new Date().getFullYear()} VitaEats. All rights reserved.
      </div>
    </footer>
  );
}
