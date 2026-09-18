import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Karthik & Sandhya | 24 & 25 October 2026",
  description: "Join our wedding celebrations at T.M.A Marriage Hall, Thirukarakavur, Papanasam. Two hearts, two families, one beautiful beginning.",
  icons: {
    icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/favicon.svg`,
    shortcut: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/favicon.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
