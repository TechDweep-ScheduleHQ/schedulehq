import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gray-50 text-black p-4 flex justify-between items-center mx-7 my-4 rounded-2xl">
      {/* Logo */}
      <div className="flex items-center">
        <span className="text-xl font-bold">ScheduleHQ</span>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex flex-1 justify-center space-x-10">
        <a href="#" className="flex items-center gap-1">
          Solutions
          <ChevronDown size={16} />
        </a>
        <a href="#">Enterprise</a>
        <a href="#" className="flex items-center gap-1">
          Developer
          <ChevronDown size={16} />
        </a>
        <a href="#" className="flex items-center gap-1">
          Resources
          <ChevronDown size={16} />
        </a>
        <a href="#">Pricing</a>
      </nav>

      {/* Buttons (desktop) */}
      <Link to="/emailLogin" className="md:flex space-x-4 font-semibold bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-700 flex items-center gap-2">Sign in <ChevronRight size={18} /></Link>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Nav Dropdown (unchanged) */}
      {menuOpen && (
        <div className="absolute top-20 left-0 w-full bg-gray-50 p-4 flex flex-col space-y-4 md:hidden shadow-lg rounded-b-2xl">
          <a href="#" className="flex items-center justify-between">
            Solutions <ChevronDown size={16} />
          </a>
          <a href="#">Enterprise</a>
          <a href="#" className="flex items-center justify-between">
            Developer <ChevronDown size={16} />
          </a>
          <a href="#" className="flex items-center justify-between">
            Resources <ChevronDown size={16} />
          </a>
          <a href="#">Pricing</a>

          <Link to="/emailLogin" className="md:flex space-x-4 font-semibold bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-700 flex items-center gap-2">Sign in <ChevronRight size={18} /></Link>
        </div>
      )}
    </header>
  );
};

export default Header;