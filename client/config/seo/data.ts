import { Metadata, type Viewport } from "next";

export const defaultSEOdata: Metadata = {
  title: "Linky - The Best Real-Time Chat Application",
  description:
    "Linky is the ultimate real-time chat application that connects users instantly and provides seamless communication.",
  keywords: [
    "real-time chat",
    "instant messaging",
    "chat app",
    "group chat",
    "online messaging",
    "Linky",
    "chat application",
    "messaging app",
    "group messaging",
    "online communication",
    "instant messaging",
    "chat app",
    "group chat",
    "online messaging",
    "Linky",
    "chat application",
    "messaging app",
    "group messaging",
    "online communication",
    "instant messaging",
    "chat app",
    "group chat",
    "online messaging",
    "Linky",
    "chat application",
    "messaging app",
    "group messaging",
    "online communication",
    "Messenger Clone",
    "Whatsapp Clone",
    "Telegram Clone",
    "Chat App template",
    "awebcode",
  ],
  openGraph: {
    title: "Linky - The Best Real-Time Chat Application",
    description:
      "Linky is the ultimate real-time chat application that connects users instantly and provides seamless communication.",
    url: "https://linky.vercel.app", // Replace with actual URL
    siteName: "Linky",
    locale: "en",
    type: "website",
  },
  twitter: {
    title: "Linky - The Best Real-Time Chat Application",
    description:
      "Linky is the ultimate real-time chat application that connects users instantly and provides seamless communication.",
    card: "summary_large_image",
    site: "@awebcode", // Replace with actual Twitter handle
    creator: "@AsikurRahman", // Replace with actual Twitter handle
  },
  appleWebApp: {
    title: "Linky - Real-Time Chat",
    capable: true,
    statusBarStyle: "default",
  },
  facebook: {
    appId: "123456789", // Replace with actual App ID
  },
  robots: {
    index: true,
    follow: true,
    googleBot: "all",
  },
  icons: [
    {
      url: "https://linkytalk.vercel.app/og-image.png", // Replace with actual icon URL
      type: "image/png",
      sizes: "512x512",
    },
    {
      url: "https://linkytalk.vercel.app/og-image.png", // Replace with actual icon URL
      type: "image/png",
      sizes: "512x512",
    },
  ],
  applicationName: "Linky",
  authors: [
    { name: "Asikur Rahman", url: "https://awebcode.vercel.app" }, // Replace with actual author URL
  ],
  verification: {
    google: "google-site-verification=1234567890", // Replace with actual verification code
    yandex: "yandex-verification=1234567890", // Replace with actual verification code
    yahoo: "y_key=1234567890", // Replace with actual verification code
  },

  manifest: "https://linkytalk.vercel.app/manifest.webmanifest", // Replace with actual manifest URL
  appLinks: {
    web: [{ url: "https://linkytalk.vercel.app", should_fallback: true }],
  },
  creator: "Awebcode",
  category: "chat, communication",
};

// Default viewport data
export const defaultViewPort: Viewport = {
  width: "device-width",
  height: "device-height",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  colorScheme: "light",
  themeColor: "#ffffff",
  minimumScale: 1,
  interactiveWidget: "resizes-content",
};
