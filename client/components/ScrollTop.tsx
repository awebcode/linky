"use client"; // for Next.js (if using app router)

import { motion } from "framer-motion";
import { ArrowUpIcon } from "lucide-react";
import { useEffect, useState } from "react";

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down a certain distance
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll the window back to the top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <motion.div
      className="fixed bottom-10 right-10 z-50"
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 50,
        scale: isVisible ? 1 : 0.8,
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
        scale: { type: "spring", stiffness: 300, damping: 20 },
      }}
      whileHover={{
        scale: 1.2,
        transition: { duration: 0.3 },
      }}
    >
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="p-3 bg-primary rounded-full text-white shadow-lg hover:bg-blue-500"
        >
          <ArrowUpIcon className="w-6 h-6" />
        </button>
      )}
    </motion.div>
  );
};

export default ScrollToTop;
