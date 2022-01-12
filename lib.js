const fetch = require('node-fetch') //nodeでfetchを使用
const fs = require('fs')

//Githubのtokenの取得
const requestGithubToken = credentials => 
    fetch(
        'https://github.com/login/oauth/access_token',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            // credentialsはPOSTリクエストのbodyに含められ、Github APIのURLに送られる。
            body: JSON.stringify(credentials)
        }
    )
    .then(response => response.json())
    .catch(error => {
        throw new Error(JSON.stringify(error))
    })

//ユーザーのアカウント情報にアクセスする(with アクセストークン)。
const requestGithubUserAccount = token =>
    fetch(`https://api.github.com/user?access_token=${token}`)
    .then(toJSON)
    .catch(thorwError)

//非同期処理として一つにまとめる。
const authorizeWithGithub = async credentials => {
    //最初にアクセストークンを要求
    const { access_token } = await requestGithubToken(credentials)
    // Githubのユーザー情報を要求
    const githubUser = await requestGithubUserAccount(access_token)
    // 一つのオブジェクトにまとめる。
    return { ...githubUser, access_token }
}