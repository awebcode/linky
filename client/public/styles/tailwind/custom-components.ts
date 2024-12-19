// custom-components.ts

import plugin from "tailwindcss/plugin";

export default plugin(({ addComponents, theme }) => {
  addComponents({
    // Adding text styles
    ".text-heading1": {
      "@apply scroll-m-20 text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight":
        {},
    },
    ".text-heading2": {
      "@apply scroll-m-16 text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight":
        {},
    },
    ".text-heading3": {
      "@apply text-[48px] font-semibold leading-[56px] tracking-[-0.02em]": {},
    },
    ".text-paragraph": {
      "@apply text-base leading-8 tracking-wide text-neutral-600 dark:text-neutral-200 font-normal":
        {},
    },
    // Adding flex styles
    ".flex-center": {
      "@apply flex justify-center items-center": {},
    },
    ".flex-between": {
      "@apply flex justify-between items-center": {},
    },
    /* START of Custom Shadows and gradients */
    ".inner-before": {
      "@apply before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 before:content-['']":
        {},
    },
    ".glow-before": {
      "@apply before:absolute before:left-2/5 before:top-0 before:z-4 before:h-0.5 before:w-3/5 before:opacity-0 before:transition-all before:duration-500 before:content-[''] group-hover:before:left-4 group-hover:before:opacity-40":
        {},
    },
    ".glow-after": {
      "@apply after:absolute after:bottom-0 after:left-4 after:z-4 after:h-0.5 after:w-7/20 after:opacity-0 after:transition-all after:duration-500 after:content-[''] group-hover:after:left-3/5 group-hover:after:opacity-40":
        {},
    },
    /* END of Custom Button */

    ".light-effect-after": {
      "@apply after:absolute after:right-0 after:top-0 after:h-full after:w-1/2 after:mix-blend-soft-light after:content-[''] max-md:after:hidden":
        {},
    },

    ".top_line_before": {
      "@apply before:absolute before:-bottom-44 before:left-1/5 before:h-96 before:w-13/20 before:bg-s4/50 before:blur-[200px] before:content-['']":
        {},
    },

    ".g1": {
      background: "linear-gradient(rgba(196, 203, 245, 0.5), transparent)",
    },
    ".g2": {
      background: "linear-gradient(#3062a3, #19549f)",
    },
    ".g3": {
      background: "linear-gradient(#3c52d9, #0c1838)",
    },
    ".g4": {
      background: "linear-gradient(#253575, #162561)",
    },
    ".g5": {
      background: "linear-gradient(#334679, #162561)",
    },
    ".g6": {
      background: "linear-gradient(#334679, #0c1838)",
    },
    ".g7": {
      background: "linear-gradient(#1b274a, #0e1434)",
    },
    ".g8": {
      background: "linear-gradient(to right, transparent, #2ef2ff, transparent)",
    },
    ".g9": {
      background: "linear-gradient(#080d27, transparent)",
    },
    /* END of Gradients */

    // Shadows

    ".icon-box-shadow": {
      //rgba(255,255,255,0.3)
      // * useful if background is not light or dark

      borderRadius: "40px",
      boxShadow:
        "-2px -2px 2px rgba(255,255,255,0.3), 5px 5px 5px rgba(0,0,0,0.2), 15px 15px 15px rgba(0,0,0,0.2)",
    },
    ".icon-drop-shadow": {
      filter:
        "dropShadow(-3px 3px 2px rgba(255,255,255,0.3)) drop-shadow(5px 5px 5px rgba(0,0,0,0.2)) drop-shadow(15px 15px 15px rgba(0,0,0,0.2))",
    },
    ".primary": {
      "@apply bg-primary text-primary-foreground": {},
    },
    ".secondary": {
      "@apply bg-secondary text-secondary-foreground": {},
    },
  });
});
