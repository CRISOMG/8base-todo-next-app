import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_8BASE_URL,
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

export const ApolloProviderConfigured = ({ children }) => <ApolloProvider client={client}>{children}</ApolloProvider>;
