
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Logo from "./header/Logo";
import Navigation from "./header/Navigation";
import SearchBar from "./header/SearchBar";
import UserActions from "./header/UserActions";
import MobileMenu from "./header/MobileMenu";

const Header: React.FC = () => {
  const { authState, logout } = useAuth();
  const { user } = authState;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-white/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 lg:px-4">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <Navigation user={user} />

            {/* Search Bar - Hidden on smaller screens */}
            <div className="hidden md:flex">
              <SearchBar />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex">
                <UserActions user={user} logout={logout} />
              </div>
              <MobileMenu 
                user={user} 
                isMobileMenuOpen={isMobileMenuOpen} 
                setIsMobileMenuOpen={setIsMobileMenuOpen} 
              />
            </div>
          </div>
        </div>
      </header>
      
      {/* Overlay backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-30 bg-black/10 backdrop-blur-[2px]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
