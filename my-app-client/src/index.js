import ApolloClient, { gql } from 'apollo-bost';

const clinet = new ApolloClient({ url: 'http://localhost:4000/graphql' })

const query = gql `
  {
    totalUsers
    totalPhotos
  }
`
// クエリ文をconsoleに出力、エラーが発生した場合も同様
clinet.query({ query })
   .then(({ data }) => console.log(data))
   .catch(console.error)