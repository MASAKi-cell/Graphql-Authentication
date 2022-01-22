const { GraphQLScalarType } = require('graphQL')

let _id = 0;
let photos = [];

// 写真をデータベースに追加する場合、ユーザーがログインしている必要がある。
const resolvers = {
    Query: {
      totaPhotos: (parent, args, { db }) => db.collection('photos').estimatedDocumentCount(),
      allPhotos: (parent, args, { db }) => db.collection('photos').find().toArray(),
      totalUsers: (parent, args, { db }) => db.collection('users').estimatedDocumentCount(),
      allUsers: (parent, args, { db }) => db.collection('users').find().toArray()
    },
    Mutation: {
      postPhoto(parent, args) {

        let newPhoto = {
          id: _id++,
          ...args.input,
          created: new Date()
        }
        photos.push(args)
        return newPhoto;
      }
    },
    Photo: {
      url: parent => `http://yoursite.com/img/${parent.id}.jpg`,
      postedBy: parent => {
        return photos.find(u => u.githubLogin === parent.githubLogin);
    },
    taggedUsers: parent => tags.filter(tag => tag.photoID === parent.id)
    .map(tag => tag.userID)
    .map(userID => taggedUsers.find(u => u.githubLogin === userID))
},
User: {
  postedPhotos: parent => {
    return photos.filter(p => p.githubLogin === parent.githubLogin);
  },
  inPhotos: parent => tags.filter(tag => tag.UserID === parent.id)
  .map(tag => tag.photoID)
  .map(photoID => postedPhotos.find(p => p.id === photoID))
  },
  DateTime: new GraphQLScalarType({
    name: `DateTime`,
    description: `A Valid date time Value`,
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString(),
    parseLiteral : ast => ast.value,
  })
}

async githubAuth(parent, { code }, { db }) {

  let {
    message,
    access_token,
    avatar_url,
    login,
    name
  } = await authorizeWithGithub({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code
  })

  if (message) {
    throw new Error(message)
  }

  let latestUserInfo = {
    name,
    githubLogin: login,
    githubToken: access_token,
    avatar: avatar_url
  } 

  const { ops:[user] } = await db
    .collection('users')
    .replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true })

  return { user, token: access_token }

}