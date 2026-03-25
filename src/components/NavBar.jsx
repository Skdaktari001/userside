import React, { useContext, useState } from 'react';
import { 
  Search, 
  User, 
  ShoppingCart, 
  Menu, 
  ChevronLeft,
  Home,
  Grid3x3,
  Info,
  Mail,
  UserCircle,
  Package,
  LogOut
} from 'lucide-react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const NavBar = () => {
    const [visible, setVisible] = useState(false);
    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems, user } = useContext(ShopContext);
    
    const logout = () => {
      navigate('/login')
      localStorage.removeItem('token')
      setToken('')
      setCartItems({})
    }

  return (
    <header className="sticky top-0 bg-white z-50 border-b border-gray-100 py-4 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="grid grid-cols-3 items-center font-medium max-w-7xl mx-auto">
        
        {/* Left Column: Mobile Menu or Desktop Links */}
        <div className="flex items-center">
          <Menu 
            onClick={() => setVisible(true)} 
            className="w-5 h-5 cursor-pointer stroke-secondary sm:hidden" 
          />
          <ul className="hidden sm:flex gap-8 text-[13px] text-secondary tracking-widest">
            <li>
              <NavLink to="/" className="flex flex-col items-center gap-1 group">
                <p>HOME</p>
                <hr className="w-full border-none h-[1px] bg-secondary hidden group-[.active]:block" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/collection" className="flex flex-col items-center gap-1 group">
                <p>COLLECTION</p>
                <hr className="w-full border-none h-[1px] bg-secondary hidden group-[.active]:block" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="flex flex-col items-center gap-1 group">
                <p>ABOUT</p>
                <hr className="w-full border-none h-[1px] bg-secondary hidden group-[.active]:block" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className="flex flex-col items-center gap-1 group">
                <p>CONTACT</p>
                <hr className="w-full border-none h-[1px] bg-secondary hidden group-[.active]:block" />
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Center Column: Logo */}
        <div className="flex justify-center">
          <Link to='/'>
            <img src={assets.logo} className="w-24 sm:w-28 md:w-32" alt="Logo" />
          </Link>
        </div>

        {/* Right Column: Search, Profile and Cart */}
        <div className="flex items-center justify-end gap-5 sm:gap-6">
          <Search 
            onClick={() => setShowSearch(true)} 
            className="w-5 h-5 cursor-pointer stroke-secondary hover:opacity-70" 
          />

          <div className="group relative">
            <div 
              onClick={() => token ? null : navigate('/login')} 
              className="cursor-pointer"
            >
              {token && user?.profileImage ? (
                <div className="w-7 h-7 rounded-full overflow-hidden border border-neutral-variant hover:border-secondary transition-colors">
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<User className="w-5 h-5 stroke-secondary" />';
                    }}
                  />
                </div>
              ) : (
                <User className="w-5 h-5 stroke-secondary hover:opacity-70" />
              )}
            </div>
            {token && (
              <div className="hidden group-hover:block absolute right-0 pt-4 bg-white shadow-lg rounded-sm z-10 border border-neutral-variant">
                <div className="flex flex-col gap-2 w-40 py-4 px-5 text-secondary text-sm">
                  <div 
                    onClick={() => navigate('/profile')} 
                    className="flex items-center gap-2 cursor-pointer hover:underline"
                  >
                    <UserCircle size={16} />
                    <span>My Profile</span>
                  </div>
                  <div 
                    onClick={() => navigate('/orders')} 
                    className="flex items-center gap-2 cursor-pointer hover:underline"
                  >
                    <Package size={16} />
                    <span>Orders</span>
                  </div>
                  <div 
                    onClick={logout} 
                    className="flex items-center gap-2 cursor-pointer hover:underline"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link to="/cart" className="relative group">
            <ShoppingCart className="w-5 h-5 min-w-5 stroke-secondary group-hover:opacity-70" />
            <p className="absolute -right-1.5 -bottom-1.5 w-4 h-4 text-center leading-4 bg-accent text-white rounded-full text-[9px] font-bold">
              {getCartCount()}
            </p>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white transition-all z-[60] shadow-2xl ${visible ? 'w-full' : 'w-0'}`}>
        <div className="flex flex-col text-secondary h-full">
          <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-5 cursor-pointer border-b border-neutral-variant uppercase tracking-widest text-sm">
            <ChevronLeft className="h-4 w-4" />
            <p>Close</p>
          </div>
          
          <div className="flex flex-col py-10 px-10 gap-6 text-lg tracking-[0.2em]">
            <NavLink 
              onClick={() => setVisible(false)} 
              className='hover:translate-x-2 transition-transform'
              to="/"
            >
              HOME
            </NavLink>
            
            <NavLink 
              onClick={() => setVisible(false)} 
              className='hover:translate-x-2 transition-transform'
              to="/collection"
            >
              COLLECTION
            </NavLink>
            
            <NavLink 
              onClick={() => setVisible(false)} 
              className='hover:translate-x-2 transition-transform'
              to="/about"
            >
              ABOUT
            </NavLink>
            
            <NavLink 
              onClick={() => setVisible(false)} 
              className='hover:translate-x-2 transition-transform'
              to="/contact"
            >
              CONTACT
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;