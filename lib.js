const fetch = require('node-fetch') //nodeでfetchを使用
const fs = require('fs')
const { userInfo } = require('os')

/**
 * Github tokenの取得
 * @param {*} credentials 
 * @returns Promise
 */
const requestGithubToken = credentials => 
    fetch(
        'https://github.com/login/oauth/access_token',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(credentials)
        }
    )
    .then(response => response.json())
    .catch(error => {
        throw new Error(JSON.stringify(error))
    })

/**
 * Githubトークンを取得後、ユーザーのアカウント情報にアクセスする。
 * @param {*} token 
 * @returns Promise
 */
const requestGithubUserAccount = token =>
    fetch(`https://api.github.com/user?access_token=${token}`)
    .then(toJSON)
    .catch(thorwError)

/**
 * 非同期処理を1つにまとめる。
 * @param {*} credentials 
 * @returns Githubトークン & ユーザー情報
 */
const authorizeWithGithub = async credentials => {
    //最初にアクセストークンを要求
    const { access_token } = await requestGithubToken(credentials)
    // Githubのユーザー情報を要求
    const githubUser = await requestGithubUserAccount(access_token)
    // 1つのオブジェクトにまとめる。
    return { ...githubUser, access_token }
}