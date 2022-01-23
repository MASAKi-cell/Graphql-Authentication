const { ApolloServer } = require('apollo-server-express')
const exporess = require(`express`)
const exporessPlayground = require(`graphql-playground-middleware-express`).default
const { readFileSync } = require(`fs`)
const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')
const resolvers = require(`./resolvers/resolvers`)
const { MongoClient } = require(`mongodb`)

require('dotenv').config()

async function start() {
  let app = exporess()
  const MONGO_DB = process.env.DB_HOST

  const client = await MongoClient.content(
    MONGO_DB,{ userNewUrlParser: true }
  )

  const db = client.db()
  const context = { db }

  const server = new ApolloServer({ 
    typeDefs, 
    resolvers, 
    /**
     * 
     * @param {*} param0 
     * @returns { db, currentUser } Githubトークン
     */
    context: async ({req}) => {
      const githubToken = req.headers.authorization
      const currentUer = await db.collection('users').findOne({ githubToken })
      return { db, currentUser }
    }
  })
  server.applyMiddleware({ app })

  app.get(`/`, (req, res) => res.end(`Welcome to the PhotoShare API`))
  app.get(`/playground`, exporessPlayground({ endpoint: `/graphql` }))

  app.listen({ port: 4000 }, () =>
    console.log(`GraphQL Server runing @http://localhost:4000${server.graphqlPath}`)
  )
}

/*
start関数を実行 → データベースに接続する(非同期)。
データベースの接続が成功するまで待機し、成功したらその接続を、コンテキストオブジェクトに追加してサーバーを起動する。
*/
start()
