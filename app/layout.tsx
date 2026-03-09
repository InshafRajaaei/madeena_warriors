import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Madeena Warriors | Batch 2018",
  description:
    "Official website of Madeena Warriors 2018 — the first O/L batch of KM Maruthamunai Al-Madeena Vidyalaya, Ampara, Sri Lanka. Explore batch members, memories and global achievements.",
  keywords: [
    "Madeena Warriors",
    "Madeena Warriors 2018",
    "Maruthamunai batch",
    "KM Maruthamunai Al-Madeena Vidyalaya",
    "Al-Madeena Vidyalaya",
    "Maruthamunai school",
    "Ampara school batch",
  ],
  metadataBase: new URL("https://madeenawarriors2k18.vercel.app"),
  openGraph: {
    title: "Madeena Warriors | Batch 2018",
    description:
      "First O/L Batch of KM Maruthamunai Al-Madeena Vidyalaya — reconnecting the 2018 batch worldwide.",
    url: "https://madeenawarriors2k18.vercel.app",
    siteName: "Madeena Warriors",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Madeena Warriors | Batch 2018",
    description:
      "First O/L Batch of KM Maruthamunai Al-Madeena Vidyalaya — reconnecting the 2018 batch worldwide.",
  },
  verification: {
    google: "qJVUAKAogiFFGzU5c2VdPny7b0FncBk37ZlO3A6xcow",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
