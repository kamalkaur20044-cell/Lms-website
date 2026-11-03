import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lakshya — IIT-JEE | NEET | Foundation",
  description:
    "Lakshya is India's premier coaching institute for IIT-JEE, NEET, and Foundation courses. Expert faculty, proven results, and a student-first approach.",
  keywords: "IIT JEE coaching, NEET preparation, Foundation courses, Lakshya, competitive exam, online classes",
  authors: [{ name: "Lakshya Institute" }],
  themeColor: "#C8102E",
  openGraph: {
    title: "Lakshya — IIT-JEE | NEET | Foundation",
    description:
      "Join thousands of students achieving their dreams with Lakshya's expert-led IIT-JEE, NEET, and Foundation programs.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
