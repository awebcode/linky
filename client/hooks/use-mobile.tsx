import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined); // Initial state is undefined

  React.useEffect(() => {
    // Only execute this on the client side (where `window` is available)
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      };

      // Set the initial state based on window width
      handleResize();

      // Attach resize event listener to dynamically update state
      window.addEventListener("resize", handleResize);

      // Cleanup on unmount
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []); // Empty dependency array to run only once on mount

  return isMobile; // This will be undefined until the client side is ready
}
