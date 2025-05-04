import { Nunito } from "next/font/google";
import { ThemeProvider } from "next-themes";
import UpRoundLogo from "@/components/upround_logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
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
      <body className="">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="w-full flex items-center justify-between space-x-10 pt-2">
            <div className="pl-10">
              <Link href="/">
                <UpRoundLogo width={50} height={50}/>
              </Link>
            </div>
            <div className="flex space-x-28">
              <Link href="/startups">
                <p>Startups</p>
              </Link>
              <Link href="/memos">
                <p>Memos</p>
              </Link>
              <Link href="/members">
                <p>Members</p>
              </Link>
            </div>
            <div className="pr-10 flex items-center">
              <ThemeSwitcher />
            </div>
          </div>
          <main>
            { children }
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
