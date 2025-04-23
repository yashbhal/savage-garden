import { ReactNode, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout = ({ children, title = 'Savage Garden' }: LayoutProps) => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

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
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="text-primary-dark text-xl font-semibold color-transition hover:text-primary">
                Savage Garden
              </Link>
            </div>
            {/* Desktop nav */}
            <nav className="hidden md:flex ml-6 space-x-8">
              <Link href="/" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium color-transition ${isActive('/')}`}>Home</Link>
              <Link href="/dashboard" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium color-transition ${isActive('/dashboard')}`}>Dashboard</Link>
              <Link href="/footprint" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium color-transition ${isActive('/footprint')}`}>Footprint</Link>
            </nav>
            {/* Hamburger for mobile */}
            <div className="md:hidden flex items-center">
              <button
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary color-transition btn-press"
                aria-label="Open main menu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((open) => !open)}
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          {/* Mobile nav menu */}
          {mobileOpen && (
            <div className="md:hidden">
              <div className="pt-2 pb-3 space-y-1">
                <Link 
                  href="/" 
                  className={`block px-3 py-2 rounded-md text-base font-medium color-transition btn-press ${
                    router.pathname === '/' 
                      ? 'bg-primary-50 text-primary' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/dashboard" 
                  className={`block px-3 py-2 rounded-md text-base font-medium color-transition btn-press ${
                    router.pathname === '/dashboard' 
                      ? 'bg-primary-50 text-primary' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/footprint" 
                  className={`block px-3 py-2 rounded-md text-base font-medium color-transition btn-press ${
                    router.pathname === '/footprint' 
                      ? 'bg-primary-50 text-primary' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  Footprint
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 px-4 mobile-enhanced">
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