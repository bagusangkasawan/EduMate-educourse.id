import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  const AuthMenuLinks = () => (
    <>
      <Link
        to="/topics"
        className={`block md:inline hover:text-blue-600 ${
          location.pathname === '/topics' ? 'text-blue-600 font-semibold' : ''
        }`}
      >
        Topik
      </Link>
      {user?.role === 'student' && (
        <Link
          to="/rewards"
          className={`block md:inline hover:text-blue-600 ${
            location.pathname === '/rewards' ? 'text-blue-600 font-semibold' : ''
          }`}
        >
          Penghargaan
        </Link>
      )}
      <Link
        to="/dashboard"
        className={`block md:inline hover:text-blue-600 ${
          location.pathname === '/dashboard' ? 'text-blue-600 font-semibold' : ''
        }`}
      >
        Dashboard
      </Link>
    </>
  );

  const AuthProfileMenu = () => (
    <>
      {/* Desktop Dropdown */}
      <div className="relative hidden md:inline-block" ref={menuRef}>
        <button
          onClick={() => setShowMenu(prev => !prev)}
          className="font-semibold focus:outline-none mt-2 md:mt-0"
        >
          {user?.name.split(' ').slice(0, 2).join(' ')}
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
            <Link
              to="/profile"
              className={`block px-4 py-2 text-sm hover:bg-gray-100 ${
                location.pathname === '/profile'
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-700'
              }`}
              onClick={() => setShowMenu(false)}
            >
              Profil
            </Link>
            <button
              onClick={onLogout}
              className="w-full text-left block px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile version (shown inline) */}
      <div className="md:hidden space-y-2 pt-2 border-t">
        <Link
          to="/profile"
          className={`block hover:text-blue-600 ${
            location.pathname === '/profile' ? 'text-blue-600 font-semibold' : ''
          }`}
          onClick={() => setMobileMenuOpen(false)}
        >
          Profil
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem('attemptedQuizzes');
            setMobileMenuOpen(false);
            onLogout();
          }}
          className="block text-red-700 hover:text-red-800"
        >
          Logout
        </button>
      </div>
    </>
  );

  const GuestLinks = () => (
    <>
      <Link
        to="/login"
        className={`bg-white font-semibold px-4 py-2 rounded-md hover:bg-gray-200 transition block md:inline ${
          location.pathname === '/login'
            ? 'text-blue-600 font-semibold border border-blue-600'
            : 'text-blue-600'
        }`}
      >
        Login
      </Link>
      <Link
        to="/register"
        className={`bg-white font-semibold px-4 py-2 rounded-md hover:bg-gray-200 transition block md:inline ${
          location.pathname === '/register'
            ? 'text-blue-600 font-semibold border border-blue-600'
            : 'text-blue-600'
        }`}
      >
        Daftar
      </Link>
    </>
  );

  return (
    <header className="bg-white text-black shadow-md sticky top-0 z-20">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="https://s3.ap-southeast-1.amazonaws.com/educourse.id/educoursetraction_icon/High_Res_Trans_Logo_Educourse.id.png"
            alt="educourse.id Logo"
            className="h-8 w-auto"
            loading="lazy"
            decoding="async"
          />
        </Link>

        {/* Hamburger Button */}
        <div className="md:hidden">
          <button
           onClick={toggleMobileMenu} 
           className="focus:outline-none text-2xl" 
           aria-label="Buka menu navigasi"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <AuthMenuLinks />
              <AuthProfileMenu />
            </>
          ) : (
            <GuestLinks />
          )}
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 space-y-2">
          {isAuthenticated ? (
            <>
              <AuthMenuLinks />
              <AuthProfileMenu />
            </>
          ) : (
            <GuestLinks />
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
