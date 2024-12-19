"use client";
import { AppProgressBar } from "next-nprogress-bar";
import React from "react";

const ProgressBar = () => {
  return (
    <>
      <AppProgressBar
        height="5px"
        color="#0ea5e9"
        options={{ showSpinner: false, easing: "ease", speed: 300 }}
        shallowRouting
      />
    </>
  );
};

export default ProgressBar;
