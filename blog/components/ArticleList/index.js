/*
* 组件名称：文章列表
* 开发者：scw
* 开发日期：2020-09-12
* 上次修改日期：2020-10-31
* */
import React, {useEffect, useRef, useState,memo} from 'react'
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
    const {path, initialList, Info } = props;
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
            if (scrollTop + clientHeight +2 >= totalHeight) {
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
             let { userId } = Info
            if (page) {
                setLoadingText('正在加载');
                let res = await get(ipPort + '/default/articleList', {type, page, keywords, userId});
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
                let res = await get(ipPort + '/default/articleList', {type, page, keywords, userId });
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

            <div className="articleList">
                {(list.current.length > 0 ? list.current : initialList).map(item => {
                    return <Spin spinning={loading} key={item.id}>
                    <Row className={'articleItem card'}>
                        <Col className="msg">
                            <strong className={'title'} onClick={itemClick.bind('', item.id)}>{item.title}</strong>
                            <span className={'introduce'}>{item.introduce}</span>
                            <div className={'date'}>
                                <span className={'hotNumber iconfont icon-classify'}>&nbsp;{item.type}</span>
                                <span className={'hotNumber iconfont icon-createTime'}>&nbsp;{item.create_date?.slice(0, 10)}</span>
                                <span className={'hotNumber iconfont icon-updateTime'}>&nbsp;{item.update_date?.slice(0, 10)}</span>
                                <span className={'hotNumber iconfont icon-hot'}>&nbsp;{item.hot}</span>
                                <span className={'hotNumber iconfont icon-like'}><svg  viewBox="64 64 896 896" data-icon="heart" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class="" ><path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"></path></svg>点赞&nbsp;{item.favour || 0}</span>
                            </div>

                        </Col>
                    </Row>
                    </Spin>
                })}

                <div className={'loadingText'}>{loadingText}</div>
            </div>
    )
}

export default withRouter(memo(articleList))
