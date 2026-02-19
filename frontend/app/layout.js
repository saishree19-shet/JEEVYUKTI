import { Outfit } from "next/font/google";
import "./globals.css";
import MouseFollower from "@/components/MouseFollower";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Jeevyukt - Understand Your Genetic Code",
  description: "AI-Powered Pharmacogenomics Risk Assessment",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <MouseFollower />
        {children}
      </body>
    </html>
  );
}
