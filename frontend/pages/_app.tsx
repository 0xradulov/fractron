import type { AppProps } from 'next/app';
import Head from 'next/head';
import { createContext, useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
const TronWeb = require('tronweb');
import Layout from '../components/Layout';
import { theme, GlobalStyle } from '../design/themes';

export const TronWebContext = createContext<any>('');
export const TronWebFallbackContext = createContext<any>('');
export const TestnetContext = createContext<boolean>(false);

declare global {
  interface Window {
    tronWeb: any;
    tronLink: any;
  }
}

export type ConnectedType = {
  connected: boolean;
  setConnected: (c: boolean) => void;
};

export const ConnectedContext = createContext<ConnectedType>({
  connected: false,
  setConnected: () => {},
});

function MyApp({ Component, pageProps }: AppProps) {
  const [tronWeb, setTronWeb] = useState('');
  const [tronWebFallback, setTronWebFallback] = useState('');
  const [connected, setConnected] = useState(false);
  const [testnet, setTestnet] = useState(false);

  useEffect(() => {
    const tronWeb2 = new TronWeb({
      fullHost: process.env.mainnet2,
      privateKey: process.env.fallbackPK,
    });
    setTronWebFallback(tronWeb2);
    if (window && window.tronWeb) {
      setTronWeb(window.tronWeb);
      if (window.tronWeb.fullNode.host === 'https://api.shasta.trongrid.io') {
        setTestnet(true);
      }
      if (window.tronLink.ready) {
        setConnected(true);
      }
      // window.tronLink.request({ method: 'tron_requestAccounts' });
      window.addEventListener('message', function (e) {
        if (e.data.message && e.data.message.action == 'setNode') {
          if (
            e.data.message.data.node.fullNode ==
            'https://api.shasta.trongrid.io'
          ) {
            setTestnet(true);
          } else {
            setTestnet(false);
          }
        }
      });
    } else {
      console.log('download tronlink');
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>fractionalize</title>
        <meta name="fractional nfts" content="a fun thing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GlobalStyle />
      <TronWebContext.Provider value={tronWeb}>
        <TronWebFallbackContext.Provider value={tronWebFallback}>
          <ConnectedContext.Provider value={{ connected, setConnected }}>
            <TestnetContext.Provider value={testnet}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </TestnetContext.Provider>
          </ConnectedContext.Provider>
        </TronWebFallbackContext.Provider>
      </TronWebContext.Provider>
    </ThemeProvider>
  );
}

export default MyApp;
