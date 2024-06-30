import { Inter as FontSans } from "next/font/google";
import { cn } from "~/lib/utils";
import "~/styles/globals.css";

export const metadata = {
  title: "Comments Demo App",
  description: "A demo app for the comments component",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-background scrollbar min-h-screen overflow-y-scroll font-sans antialiased",
        fontSans.variable,
      )}
    >
      <body>{children}</body>
    </html>
  );
}
