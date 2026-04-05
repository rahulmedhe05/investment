import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Wealthora — Investment Growth Simulation',
  description: 'Track your simulated investment growth with beautiful visualizations. For simulation purposes only.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-black text-white antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
