
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import Logo from "./header/Logo";
import Navigation from "./header/Navigation";
import UserActions from "./header/UserActions";
import MobileMenu from "./header/MobileMenu";

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user || !profile) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <Navigation user={profile} />

            {/* Right Section */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex">
                <UserActions user={profile} logout={signOut} />
              </div>
              <MobileMenu 
                user={profile} 
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
          className="lg:hidden fixed inset-0 z-30 bg-black/20"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
