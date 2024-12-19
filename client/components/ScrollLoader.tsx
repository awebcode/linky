"use client";
// components/ScrollLoader.tsx
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import useDebounce from "@/hooks/use-debounce";

const ScrollLoader = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Calculate scroll progress
  const calculateScrollProgress = useCallback(() => {
    if (typeof window !== "undefined") {
      const totalScroll = window.scrollY || document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (totalScroll / windowHeight) * 100;
      setScrollProgress(Math.min(progress, 100)); // Ensure progress doesn't exceed 100
    }
  }, []);

  const handleScroll = useDebounce(calculateScrollProgress, 100); // Debounce for 100ms

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="fixed top-0 left-0 w-full h-2 z-50">
      <motion.div
        className="h-[2px] bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl"
        style={{ width: `${scrollProgress}%` }}
        initial={{ width: 0 }}
        animate={{ width: scrollProgress > 0 ? `${scrollProgress}%` : 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration: 0.5,
        }}
      />
    </div>
  );
};

export default ScrollLoader;
