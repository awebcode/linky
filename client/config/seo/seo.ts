import { Metadata, type Viewport } from "next";
import { defaultSEOdata, defaultViewPort } from "./data";

// Function to merge defaults with overrides
export const generateSEO = (overrides: Partial<Metadata>): Metadata => ({
  ...defaultSEOdata,
  ...overrides,
});

//generate viewport
export const generateViewport = (overrides: Partial<Viewport>): Viewport => ({
  ...defaultViewPort,
  ...overrides,
});
