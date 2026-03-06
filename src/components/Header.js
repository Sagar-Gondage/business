import React, { useState } from 'react';

const Header = ({ onNavClick, activeSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (section) => {
    onNavClick(section);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 shadow-lg z-50 backdrop-blur-md" style={{ background: 'rgba(29, 40, 58, 0.95)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <div className="text-lg md:text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl md:text-3xl">🚀</span>
            <span className="hidden sm:inline" style={{ background: 'linear-gradient(to right, #ffffff, #b0c4de)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ShopHubSolutions</span>
            <span className="sm:hidden" style={{ background: 'linear-gradient(to right, #ffffff, #b0c4de)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ShopHub</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <button
            onClick={() => handleNavClick('home')}
            className={`${activeSection === 'home' ? 'text-white' : 'text-gray-300'} hover:text-white font-medium transition relative group`}
          >
            Home
            <span className="absolute bottom-0 left-0 h-0.5 transition-all duration-300" style={{ width: activeSection === 'home' ? '100%' : '0', backgroundColor: '#4d8ac9' }}></span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" style={{ backgroundColor: '#4d8ac9' }}></span>
          </button>
          <button
            onClick={() => handleNavClick('projects')}
            className={`${activeSection === 'projects' ? 'text-white' : 'text-gray-300'} hover:text-white font-medium transition relative group`}
          >
            Solutions
            <span className="absolute bottom-0 left-0 h-0.5 transition-all duration-300" style={{ width: activeSection === 'projects' ? '100%' : '0', backgroundColor: '#4d8ac9' }}></span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" style={{ backgroundColor: '#4d8ac9' }}></span>
          </button>
          <button
            onClick={() => handleNavClick('services')}
            className={`${activeSection === 'services' ? 'text-white' : 'text-gray-300'} hover:text-white font-medium transition relative group`}
          >
            Services
            <span className="absolute bottom-0 left-0 h-0.5 transition-all duration-300" style={{ width: activeSection === 'services' ? '100%' : '0', backgroundColor: '#4d8ac9' }}></span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" style={{ backgroundColor: '#4d8ac9' }}></span>
          </button>
          <button
            onClick={() => handleNavClick('pricing')}
            className={`${activeSection === 'pricing' ? 'text-white' : 'text-gray-300'} hover:text-white font-medium transition relative group`}
          >
            Pricing
            <span className="absolute bottom-0 left-0 h-0.5 transition-all duration-300" style={{ width: activeSection === 'pricing' ? '100%' : '0', backgroundColor: '#4d8ac9' }}></span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" style={{ backgroundColor: '#4d8ac9' }}></span>
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="px-6 py-2 font-medium rounded-full transition transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #4d8ac9 0%, #3a6ba5 100%)', color: '#ffffff' }}
          >
            Contact
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white p-2 focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-700 backdrop-blur-md" style={{ background: 'rgba(29, 40, 58, 0.98)' }}>
          <nav className="flex flex-col p-4 space-y-3">
            <button
              onClick={() => handleNavClick('home')}
              className={`${activeSection === 'home' ? 'text-white' : 'text-gray-300'} hover:text-white font-medium transition text-left py-2 px-4 rounded-lg ${activeSection === 'home' ? 'bg-blue-900 bg-opacity-30' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('projects')}
              className={`${activeSection === 'projects' ? 'text-white' : 'text-gray-300'} hover:text-white font-medium transition text-left py-2 px-4 rounded-lg ${activeSection === 'projects' ? 'bg-blue-900 bg-opacity-30' : ''}`}
            >
              Solutions
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className={`${activeSection === 'services' ? 'text-white' : 'text-gray-300'} hover:text-white font-medium transition text-left py-2 px-4 rounded-lg ${activeSection === 'services' ? 'bg-blue-900 bg-opacity-30' : ''}`}
            >
              Services
            </button>
            <button
              onClick={() => handleNavClick('pricing')}
              className={`${activeSection === 'pricing' ? 'text-white' : 'text-gray-300'} hover:text-white font-medium transition text-left py-2 px-4 rounded-lg ${activeSection === 'pricing' ? 'bg-blue-900 bg-opacity-30' : ''}`}
            >
              Pricing
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="px-6 py-3 font-medium rounded-full transition text-center"
              style={{ background: 'linear-gradient(135deg, #4d8ac9 0%, #3a6ba5 100%)', color: '#ffffff' }}
            >
              Contact
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;