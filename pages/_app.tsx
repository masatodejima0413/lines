import { AppProps } from 'next/app';
import { ViewContextProvider } from '../components/context/ViewContextProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ViewContextProvider>
      <Component {...pageProps} />
    </ViewContextProvider>
  );
}

export default MyApp;
