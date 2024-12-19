import React from "react";
import ThemeToggle from "./ThemeButton";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground  py-3 text-center ">
      {/* Container for footer content */}
      <div className="container mx-auto px-2 md:px-6 flex-center gap-2 md:gap-4">
        {/* Copyright Section */}
        <p className="text-base mb-2">&copy; 2024 Linky. All rights reserved.</p>

        {/* Social Links or Optional Info */}
        

        {/* Theme Toggle */}
          <ThemeToggle />
      </div>
    </footer>
  );
};

export default Footer;
