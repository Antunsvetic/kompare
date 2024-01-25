import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, NormalizedCacheObject, from } from '@apollo/client';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';

import './index.css';

const removeTypename = removeTypenameFromVariables()

const localUrl: string = 'http://127.0.0.1:5012/graphql';

const httpLink = createHttpLink({
  uri: localUrl
});

const link = from([removeTypename, httpLink]);

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
