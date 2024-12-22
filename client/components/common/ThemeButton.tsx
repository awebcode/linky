"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Laptop, MoonIcon, SunIcon } from "lucide-react";

const themeOptions = {
  light: <SunIcon className="icon-drop-shadow " />,
  dark: <MoonIcon className="icon-drop-shadow  " />,
  system: <Laptop className="icon-drop-shadow " />,
};

const ThemeButton = () => {
  const { setTheme, theme: currentTheme } = useTheme();
  const [isInitialRender, setIsInitialRender] = React.useState(false);
  React.useEffect(() => {
    setIsInitialRender(true);
  }, []);
  if (!isInitialRender) {
    return null;
  }

  return (
    <div className="flex bg-gray-200/30 dark:bg-gray-50/20 rounded-2xl border border-gray-200/60 dark:border-gray-500/60 backdrop-blur-md">
      {Object.keys(themeOptions).map((theme) => (
        <motion.button
          key={theme}
          className={`drop-shadow-2xl decoration-purple-100 flex-center p-2 rounded-2xl h-full  transition-colors  ${
            currentTheme === theme
              ? "bg-foreground text-background"
              : "hover:bg-gray-200/60 dark:hover:bg-gray-100/40"
          }`}
          onClick={() => setTheme(theme)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 100, damping: 10, duration: 0.3 }}
        >
          {themeOptions[theme as keyof typeof themeOptions]}
        </motion.button>
      ))}
    </div>
  );
};

export default ThemeButton;
