import {getArticleDetail, getArticleType} from './actionType'
import {get} from '../utils/requestUtil'
import {message} from 'antd'
import ipPort from "../common/ipPort";

//获取文章类型
export function GET_TYPE(data) {
    return async dispatch => {
        try {
            let res = await get(ipPort + '/default/articleType', {});
            if (res.success) {
                dispatch({type: getArticleType, data: res.results})
            } else {
                dispatch({type: getArticleType, data: []});
                message.error(`获取文章类型失败，异常信息为：${res.code}`)
            }

        } catch (e) {
            dispatch({type: getArticleType, data: []});
            message.error(`获取文章类型失败，异常信息为：${e}`)
        }
    }
}

export function GET_INFO(data) {
    return async dispatch => {
        try {
            let res = await get(ipPort + '/admin/info', data );
            if (res.success) {
                dispatch({type: 'getUserInfo', data: res.info })
            } else {
                dispatch({type: 'getUserInfo', data: {} })
                message.error(`获取个人信息失败，异常信息为：${res.code}`)
            }
        } catch (e) {
            dispatch({type: 'getUserInfo', data: {} })
            message.error(`获取个人信息失败，异常信息为：${e}`)
        }
    }
}

//获取文章详情数据
export function SET_DETAIL(data) {
    return {type: getArticleDetail, data}
}