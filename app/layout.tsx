import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Niayesh Afshordi | Astrophysics, Cosmology, and Gravity",
  description:
    "Research, people, papers, talks, and writing by astrophysicist Niayesh Afshordi.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
