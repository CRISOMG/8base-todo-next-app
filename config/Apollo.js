import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
const setHeaders = () => {
  if (token) {
    return {
      authorization: `Bearer ${token}`,
    };
  } else {
    return {};
  }
};
export const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_8BASE_URL,
  cache: new InMemoryCache(),
  headers: setHeaders(),
});

export const ApolloProviderConfigured = ({ children }) => <ApolloProvider client={client}>{children}</ApolloProvider>;
