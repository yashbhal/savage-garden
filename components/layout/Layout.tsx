import { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout = ({ children, title = 'Savage Garden' }: LayoutProps) => {
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path ? 'text-primary border-primary' : 'text-gray-600 border-transparent';
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Savage Garden - Plant monitoring system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-primary-dark text-xl font-semibold">
                  Savage Garden
                </Link>
              </div>
              <nav className="ml-6 flex space-x-8">
                <Link href="/" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/')}`}>
                  Home
                </Link>
                <Link href="/dashboard" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/dashboard')}`}>
                  Dashboard
                </Link>
                <Link href="/footprint" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/footprint')}`}>
                  Footprint
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>


      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Savage Garden &copy; {new Date().getFullYear()} - Plant Monitoring System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 