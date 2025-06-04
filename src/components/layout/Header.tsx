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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 lg:px-4">
        <div className="flex h-12 items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <Navigation user={user} />

          {/* Search Bar */}
          <SearchBar />

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <UserActions user={user} logout={logout} />
            <MobileMenu 
              user={user} 
              isMobileMenuOpen={isMobileMenuOpen} 
              setIsMobileMenuOpen={setIsMobileMenuOpen} 
            />
          </div>
        </div>

        {/* Mobile Navigation Menu Content */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-3">
            {/* This content is handled by MobileMenu component */}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
