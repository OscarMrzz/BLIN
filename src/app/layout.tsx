import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeadersComponent from "@/components/layout/HeaderCompnent";
import FooterComponet from "@/components/layout/FooterComponet";
import Provider from "./Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BLIN",
  description: "BLIN",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable}  h-screen w-full font-sans bg-background text-foreground`}
      >
        <Provider>
          <header className=" w-full ">
            <HeadersComponent />
          </header>
          <main className="h-full w-full p-4 flex flex-col pt-24 pb-32">
            <div className="w-full h-full">{children}</div>
          </main>
          <footer className="">
            <FooterComponet />
          </footer>
        </Provider>
      </body>
    </html>
  );
}
