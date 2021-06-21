import {combineReducers} from 'redux'


function articleTypeList(state = [], action) {
    switch (action.type) {
        case 'getArticleType':
            return action.data;
        default:
            return state
    }
}

function articleDetail(state = {}, action) {
    switch (action.type) {
        case 'getArticleDetail':
            return action.data;
        default:
            return state
    }
}

function userInfo(state = {
    username: '颖创',
    wechat: '',
    QQ: '',
    github: '',
    keywords: '',
    description: '',
    sendword: '',
}, action) {
    switch(action.type) {
        case 'getUserInfo' :
            return action.data
        default: 
            return state
    }
}


export default combineReducers({
    articleTypeList,
    articleDetail,
    userInfo
})
