/*
* 组件名称：文章列表
* 开发者：scw
* 开发日期：2020-09-12
* 上次修改日期：2020-10-31
* */
import React, {useEffect, useRef, useState} from 'react'
import {Col, message, Row, Spin} from 'antd'
import {withRouter} from 'next/router'
import Qs from 'qs'
import {get} from '../../utils/requestUtil'
import "./style.scss"
import {throttle} from 'lodash'
import ipPort from '../../common/ipPort'


function articleList(props) {
    //组件加载状态
    const [loading, setLoading] = useState(false);
    const {path, initialList} = props;
    const [loadingText, setLoadingText] = useState(initialList.length < 10 ? '已经是最后一页了' : '加载完毕');
    const list = useRef([]);
    const CurrentPage = useRef(1);
    const isEnd = useRef(initialList.length < 10); //是否加载全部完毕
    //获取地址可能出现的#下标
    const jingHaoIndex = path.lastIndexOf('#') > -1 ? path.lastIndexOf('#') : false
    //获取地址传递的参数
    const query = path.lastIndexOf('?') > -1 ? Qs.parse(path.slice(path.lastIndexOf('?') + 1, jingHaoIndex ? jingHaoIndex : path.length)) : {};
    let type = path.startsWith('/list') ? query.type : undefined;
    let keywords = path.startsWith('/list') ? query.keywords : undefined;

    //翻页处理
    let scrollListener = () => {
        if (!isEnd.current) {

            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const totalHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.offsetHeight;
            if (scrollTop + clientHeight >= totalHeight) {
                getArticlList(type, CurrentPage.current + 1, keywords);
                CurrentPage.current = CurrentPage.current + 1
            }
        }

    };
    useEffect(() => {
        async function func() {
            scrollListener = throttle(scrollListener, 1000);
            document.addEventListener('scroll', scrollListener)
        }

        func();
        return function () {
            document.removeEventListener('scroll', scrollListener)
        }


    }, []);

    async function getArticlList(type, page, keywords) {
        try {
            if (page) {
                setLoadingText('正在加载');
                let res = await get(ipPort + '/default/articleList', {type, page, keywords});
                if (res.success) {
                    if (res.results.length === 10) {
                        //这里用于进行区分第一次默认获取的服务端渲染数据和后续的加载数据
                        list.current = list.current.length ? [...list.current, ...res.results] : [...initialList, ...res.results];
                        setLoadingText('加载完毕')
                    } else {
                        list.current = list.current.length ? [...list.current, ...res.results] : [...initialList, ...res.results];
                        isEnd.current = true; //说明加载完毕
                        setLoadingText('已经是最后一页了')
                    }

                } else {
                    message.error(`获取文章数据失败，异常信息为：${res.code}`);
                    CurrentPage.current = CurrentPage.current - 1;
                    setLoadingText('加载失败')
                }


            } else {
                setLoading(true);
                setLoadingText('正在加载');
                let res = await get(ipPort + '/default/articleList', {type, page, keywords});
                setLoading(false);
                if (res.success) {
                    if (res.results.length === 10) {
                        list.current = list.current.length ? [...list.current, ...res.results] : [...initialList, ...res.results];
                        setLoadingText('加载完毕')
                    } else {
                        list.current = list.current.length ? [...list.current, ...res.results] : [...initialList, ...res.results];
                        isEnd.current = true; //说明加载完毕
                        setLoadingText('已经是最后一页了')
                    }
                } else {
                    message.error(`获取文章列表失败，异常信息为：${res.code}`);
                    setLoadingText('加载失败')
                }
            }

        } catch (e) {
            setLoading(false);
            message.error(`获取文章数据失败，异常信息为：${e}`);
            CurrentPage.current = CurrentPage.current - 1;
            setLoadingText('加载失败')
        }

    }

    let itemClick = (id) => {
        setLoading(true)
        props.router.push(`/detail?id=${id}`)
    };
    return (
        <Spin spinning={loading}>
            <div className="articleList">
                {(list.current.length > 0 ? list.current : initialList).map(item => {
                    return <Row className={'articleItem card'} key={item.id}>
                        <Col className="msg">
                            <strong className={'title'} onClick={itemClick.bind('', item.id)}>{item.title}</strong>
                            <span className={'introduce'}>{item.introduce}</span>
                            <div className={'date'}>
                                <span className={'hotNumber iconfont icon-classify'}>&nbsp;{item.type}</span>
                                <span className={'hotNumber iconfont icon-createTime'}>&nbsp;{item.create_date?.slice(0, 10)}</span>
                                <span className={'hotNumber iconfont icon-updateTime'}>&nbsp;{item.update_date?.slice(0, 10)}</span>
                                <span className={'hotNumber iconfont icon-hot'}>&nbsp;{item.hot}</span>
                            </div>


                        </Col>
                    </Row>
                })}

                <div className={'loadingText'}>{loadingText}</div>
            </div>
        </Spin>
    )
}

export default withRouter(articleList)
