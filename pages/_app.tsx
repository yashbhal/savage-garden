import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout/Layout'
import { PlantProvider } from '../lib/context/PlantContext'
import { CarbonProvider } from '../lib/context/CarbonContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlantProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <CarbonProvider>
      <Component {...pageProps} />
    </CarbonProvider>
    </PlantProvider>
  )
}

export default MyApp
