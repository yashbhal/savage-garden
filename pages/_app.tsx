import '../styles/globals.css'
import '../styles/aesthetic.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout/Layout'
import { PlantProvider } from '../lib/context/PlantContext'
import { NotificationProvider } from '../lib/context/NotificationContext'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  
  return (
    <PlantProvider>
      <NotificationProvider autoNotifyInterval={30000}>
        <Layout>
          <AnimatePresence mode="wait">
            <div key={router.route} className="page-transition">
              <Component {...pageProps} />
            </div>
          </AnimatePresence>
        </Layout>
      </NotificationProvider>
    </PlantProvider>
  )
}

export default MyApp
