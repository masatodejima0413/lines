import { AppProps } from 'next/app';
import 'emoji-mart/css/emoji-mart.css';
import { ViewContextProvider } from '../components/context/ViewContextProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ViewContextProvider>
      <Component {...pageProps} />
    </ViewContextProvider>
  );
}

export default MyApp;
