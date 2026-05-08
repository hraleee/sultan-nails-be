import type { Metadata } from "next";
import {
  Orbitron,
  Share_Tech_Mono,
  Bebas_Neue,
  Rajdhani,
} from "next/font/google";
import Footer from "./components/Footer";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-orbit",
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-hud",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-poster",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Sultan Nails | Estetica unghie e skin spa",
  description:
    "Trattamenti unghie signature, manicure, pedicure e rituali spa su misura a Napoli.",
  icons: {
    icon: "/sultannailslogo.jpg",
    shortcut: "/sultannailslogo.jpg",
    apple: "/sultannailslogo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${orbitron.variable} ${shareTechMono.variable} ${bebasNeue.variable} ${rajdhani.variable}`}
    >
      <body className="antialiased min-h-screen flex flex-col bg-black">
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
