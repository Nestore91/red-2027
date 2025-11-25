import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Red 2027",
  description: "Sistema de estructura territorial",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className + " bg-gray-100"}>
        <div className="mx-auto max-w-md min-h-screen bg-white">
          {children}
        </div>
      </body>
    </html>
  );
}
