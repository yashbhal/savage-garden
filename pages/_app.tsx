import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout/Layout'
import { PlantProvider } from '../lib/context/PlantContext'
import { NotificationProvider } from '../lib/context/NotificationContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlantProvider>
      <NotificationProvider autoNotifyInterval={30000}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </NotificationProvider>
    </PlantProvider>
  )
}

export default MyApp
