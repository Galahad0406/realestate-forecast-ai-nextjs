// app/layout.js
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Enhanced Real Estate AI Analytics - Washington State',
  description: 'Advanced real estate analysis with school ratings, investment grades, and accurate market data',
  keywords: 'real estate, Washington, property analysis, investment, school ratings, Redfin, Zillow',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
