import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { generateSEO, generateViewport } from "@/config/seo/seo";
import { Toaster } from "@/components/ui/toaster";
import QueryProvider from "@/providers/QueryProvider";
import ScrollToTop from "@/components/ScrollTop";
import ProgressBar from "@/components/ProgressBar";
import ScrollLoader from "@/components/ScrollLoader";
import Footer from "@/components/common/Footer";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
// In app directory
// import { ArticleJsonLd, DefaultSeo } from "next-seo";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-poppins",
});
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-roboto",
});
// setup SEO
export const viewport = generateViewport({});
// setup SEO
export const metadata = generateSEO({});
interface Props {
  children: React.ReactNode;
}
export default async function RootLayout({ children }: Props) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} ${poppins.variable} ${roboto.className} ${roboto.variable} antialiased min-h-screen flex flex-col justify-around   `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <SessionProvider session={session}>
              <main className="flex-grow">{children}</main>
              <Toaster   />

              <footer>
                {" "}
                <Footer />{" "}
              </footer>
            </SessionProvider>
          </QueryProvider>
          <ScrollToTop />

          {/* when user will scrolling in the page it will show the loader */}
          <ScrollLoader />
          <ProgressBar />
        </ThemeProvider>
      </body>
    </html>
  );
}
