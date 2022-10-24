import type { AppProps } from 'next/app';
import Head from 'next/head';
import { createContext, useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
const TronWeb = require('tronweb');
import Layout from '../components/Layout';
import { theme, GlobalStyle } from '../design/themes';
import { useQueryClient, QueryClient, QueryClientProvider } from 'react-query';

export const TronWebContext = createContext<any>('');
export const TronWebFallbackContext = createContext<any>('');
export const TronWebFallbackContextShasta = createContext<any>('');
export const TestnetContext = createContext<boolean>(false);
export const CurrentNetworkContext = createContext<any>('');

declare global {
  interface Window {
    tronWeb: any;
    tronLink: any;
  }
}

const queryClient = new QueryClient();

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
  const [tronWebFallbackShasta, setTronWebFallbackShasta] = useState('');
  const [connected, setConnected] = useState(false);
  const [testnet, setTestnet] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState('mainnet');

  useEffect(() => {
    const tronWeb2 = new TronWeb({
      fullHost: process.env.mainnet2,
      privateKey: process.env.fallbackPK,
    });
    const tronWeb3 = new TronWeb({
      fullHost: 'https://api.shasta.trongrid.io',
      privateKey: process.env.fallbackPK,
    });
    setTronWebFallback(tronWeb2);
    setTronWebFallbackShasta(tronWeb3);
    if (window && window.tronWeb) {
      setTronWeb(window.tronWeb);
      if (window.tronWeb.fullNode.host === 'https://api.shasta.trongrid.io') {
        setTestnet(true);
        setCurrentNetwork('shasta');
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
            setCurrentNetwork('shasta');
          } else {
            setTestnet(false);
            setCurrentNetwork('mainnet');
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
      <QueryClientProvider client={queryClient}>
        <TronWebContext.Provider value={tronWeb}>
          <TronWebFallbackContext.Provider value={tronWebFallback}>
            <TronWebFallbackContextShasta.Provider
              value={tronWebFallbackShasta}
            >
              <ConnectedContext.Provider value={{ connected, setConnected }}>
                <TestnetContext.Provider value={testnet}>
                  <CurrentNetworkContext.Provider value={currentNetwork}>
                    <Layout>
                      <Component {...pageProps} />
                    </Layout>
                  </CurrentNetworkContext.Provider>
                </TestnetContext.Provider>
              </ConnectedContext.Provider>
            </TronWebFallbackContextShasta.Provider>
          </TronWebFallbackContext.Provider>
        </TronWebContext.Provider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default MyApp;
