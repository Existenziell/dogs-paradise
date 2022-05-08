import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import { UserProvider } from '@auth0/nextjs-auth0'
import Layout from '../components/_Layout'
import Head from 'next/head'

function App({ Component, pageProps }) {

  return (
    <UserProvider>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#603cba" />
        <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
        <meta name="theme-color" content="#C90076" />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin="true" />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Gotu&display=swap' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Berkshire+Swash&display=swap' />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  )
}

export default App
