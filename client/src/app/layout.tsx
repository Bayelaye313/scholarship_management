import './globals.css';
import '../styles/accessibility.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from '../components/auth/AuthProvider';
import { NotificationProvider } from '../providers/NotificationProvider';
import AccessibilityWidget from '../components/accessibility/AccessibilityWidget';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Plateforme de Gestion des Bourses',
  description: 'Plateforme de gestion des bourses d\'études',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <NotificationProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                {children}
              </main>
              <Footer />
            </div>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              limit={3} // Limiter le nombre de toasts affichés simultanément
            />
            <AccessibilityWidget />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
