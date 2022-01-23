
async githubAuth(parent,{ code }, { db }){

    let { message, access_token, avatar_url, login, name } = 
    await authorizeWithGithub({
        client_id: Your_client_id,
        client_secret: Your_client_secret,
        code 
    })
}