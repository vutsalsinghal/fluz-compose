import ApolloClient from 'apollo-boost';

export default new ApolloClient({
  uri: `http://localhost:${process.env.REACT_APP_GRAPHQL_SERVER}/graphql`,
  //uri: 'http://localhost:8000/graphql',
});