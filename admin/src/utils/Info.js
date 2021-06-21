export function setUserInfo(param) {
    sessionStorage.setItem('Auth-Info', JSON.stringify(param))
}

export function getUserInfo() {
    return JSON.parse(sessionStorage.getItem('Auth-Info'))
}