import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "AI Career Tracker",
    template: "%s | AI Career Tracker",
  },
  description:
    "Organize job applications and use grounded AI assistance for resumes, cover letters, and interview preparation.",
  keywords: [
    "job application tracker",
    "AI resume analysis",
    "cover letter generator",
    "interview preparation",
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeCookie = (await cookies()).get("theme")?.value;
  const theme =
    themeCookie === "light" || themeCookie === "dark" ? themeCookie : undefined;

  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-theme={theme}
      lang="en"
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
