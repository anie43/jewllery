import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { CartProvider } from '@/components/cart/CartProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'अलंकारिका - Traditional Jewelry Store',
  description: 'Where Tradition Meets Elegance - Discover exquisite handcrafted jewelry with authentic Indian designs',
  keywords: 'jewelry, traditional, indian, kundan, meenakari, gold, silver, bridal, festive',
  authors: [{ name: 'अलंकारिका' }],
  openGraph: {
    title: 'अलंकारिका - Traditional Jewelry Store',
    description: 'Where Tradition Meets Elegance - Discover exquisite handcrafted jewelry',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}