


/**
 * Githubからユーザーアカウント情報を要求し、データを取得する。
 * @param parent.window、{ code }、 { db }
 * @returns { user, token: access_token }
 */
async githubAuth(parent, { code }, { db }){

    let { message, access_token, avatar_url, login, name } = 
    await authorizeWithGithub({
        client_id: Your_client_id,
        client_secret: Your_client_secret,
        code
    })

    //messageが含まれている場合、何らかのエラーが発生しておりエラーメッセージを表示する。
    if(message){
        throw new Error(message);
    }

    // ユーザー情報を一つのオブジェクトに格納する。
    let latesUserInfo = {
            name,
            githubLogin: login,
            githubToken: access_token,
            avatar: avatar_url,
        }

    // ユーザーコレクションのユーザー情報とログイン情報を更新する。
    const { ops:[user] } = await db
        .collection('users')
        .replaceOne({ githubLogin: login }, latesUserInfo, { upsert:ture })

    return { user, token: access_token }
}