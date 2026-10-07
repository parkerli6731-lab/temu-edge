import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GamificationWheelIsland } from '@/components/islands/GamificationWheelIsland';

export const metadata: Metadata = {
  title: 'Temu Edge - Factory Direct Deals | Ultra Fast Global Delivery',
  description: 'Shop factory direct lightning deals on electronics, kitchen, fashion and home decor. Ultra-low latency edge catalog powered by Cloudflare.',
  metadataBase: new URL('https://temu-edge.pages.dev'),
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <GamificationWheelIsland />
        <Footer />
      </body>
    </html>
  );
}
