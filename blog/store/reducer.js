import {combineReducers} from 'redux'


function articleTypeList(state = [], action) {
    switch (action.type) {
        case 'getArticleType':
            return action.data;
        default:
            return state
    }
}

export default combineReducers({
    articleTypeList
})
