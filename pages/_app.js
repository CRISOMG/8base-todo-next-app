import '../styles/globals.css';
import { ApolloProviderConfigured } from '../config/Apollo';

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProviderConfigured>
      <Component {...pageProps} />
    </ApolloProviderConfigured>
  );
}

export default MyApp;
