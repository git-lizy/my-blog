import React, {memo, useEffect, useState,} from 'react'
import {message, Spin} from 'antd'
import './style.scss'
import {get} from "../../utils/requestUtil";
import ipPort from "../../common/ipPort";
import {withRouter} from 'next/router'


function SideBar(props) {
    const [recommendList, setRecommendList] = useState([]);
    const [rankList, setRankList] = useState([]);
    const [recommendLoading, setRecommendLoading] = useState(false);
    const [rankLoading, setRankLoading] = useState(false);
    useEffect(() => {
        getRecommendList();
        getHotList()
    }, []);

    async function getRecommendList() {
        setRecommendLoading(true);
        try {
            let res = await get(ipPort + '/default/recommendList', {});
            setRecommendLoading(false);
            if (res.success) {
                setRecommendList(res.results)
            } else {
                setRecommendList([]);
                message.error(`获取推荐信息失败，异常信息为：${res.code}`)
            }
        } catch (e) {
            setRecommendLoading(false);
            message.error(`获取推荐信息失败，异常信息为：${e}`)
        }

    }

    async function getHotList() {
        setRankLoading(true);
        try {
            let res = await get(ipPort + '/default/hotList', {});
            setRankLoading(false);
            if (res.success) {
                setRankList(res.results)
            } else {
                setRankList([]);
                message.error(`获取热门信息失败，异常信息为：${res.code}`)
            }
        } catch (e) {
            setRankLoading(false);
            message.error(`获取热门信息失败，异常信息为：${e}`)
        }


    }

    let itemClick = (id) => {
        props.router.push(`/detail?id=${id}`)
    };

    return <div className={'SideBar'}>
        <Spin spinning={recommendLoading}>
            <div className={'recommend card'}>
                <div className={'title'}><span>&nbsp;推荐阅读</span></div>
                <ul>
                    {recommendList.map((item, index) => {
                        return <li key={index}>
                            <a onClick={itemClick.bind(SideBar, item.id)}><span
                                style={{color: '#7db8ee'}}>{index + 1}.</span>&nbsp;{item.title}</a>
                        </li>
                    })}
                </ul>
            </div>
        </Spin>

        <Spin spinning={rankLoading}>
            <div className={'rank card'}>
                <div className={'title'}><span>&nbsp;访问排行</span></div>
                <ul>
                    {rankList.map((item, index) => {
                        return <li key={index}>
                            <a onClick={itemClick.bind(SideBar, item.id)}><span
                                style={{color: '#7db8ee'}}>{index + 1}.</span>&nbsp;{item.title}</a>
                        </li>
                    })}
                </ul>
            </div>
        </Spin>

    </div>
}

export default memo(withRouter(SideBar))
