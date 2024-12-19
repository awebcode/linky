import plugin from "tailwindcss/plugin";

export default plugin(({ addUtilities }) => {
  addUtilities({
    /* START of Clip Path */
    ".hero-clip-path": {
      clipPath: "ellipse(70% 100% at 50% 100%)",
    },
  });
});
