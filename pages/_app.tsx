import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout/Layout'
import { PlantProvider } from '../lib/context/PlantContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlantProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </PlantProvider>
  )
}

export default MyApp
