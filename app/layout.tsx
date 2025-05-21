import { Nunito } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";
import UpRoundLogo from "@/components/upround_logo";

const defaultUrl = process.env.VERCEL_PROD_URL
  ? `https://${process.env.VERCEL_PROD_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "UpRound Dashboard",
  description: "Dashbaord for UpRound Ventures",
};

const geistSans = Nunito({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">
            { children }
          </main>
          <div className="py-6 flex justify-between items-center px-10">
            <div className="flex items-center">
              <UpRoundLogo width={20} height={20} colorWithTheme/>
            </div>
            <h2 className="text-right text-sm opacity-75">
              &copy; {new Date().getFullYear()} — Copyright UpRound Ventures
            </h2>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
