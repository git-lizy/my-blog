import React, {useEffect, useRef, useState} from 'react'
import {Col, message, Row, Spin,Skeleton} from 'antd'
import {withRouter} from 'next/router'
import Qs from 'qs'
import {get} from '../../utils/requestUtil'
import "./style.scss"
import {throttle} from 'lodash'
import ipPort from '../../common/ipPort'


function articleList(props) {
    const [loading, setLoading] = useState(false);
    const {path,initialList} = props;
    const [loadingText, setLoadingText] = useState(initialList.length<10?'已经是最后一页了':'加载完毕');
    const list = useRef([]);
    const CurrentPage = useRef(1);
    const isEnd = useRef(initialList.length < 10); //是否加载全部完毕
    let query = path.lastIndexOf('?') > -1 ? Qs.parse(path.slice(path.lastIndexOf('?') + 1)) : {};
    let type = path.startsWith('/list') ? query.type : undefined;
    let keywords = path.startsWith('/list') ? query.keywords : undefined;

    //翻页处理
    let scrollListener = () => {
        if (!isEnd.current) {

            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const totalHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.offsetHeight;
            if (scrollTop + clientHeight >= totalHeight) {
                getArticlList(type, CurrentPage.current + 1,keywords);
                CurrentPage.current = CurrentPage.current + 1
            }
        }

    };
    useEffect(() => {
        // console.log('path',props.router)
        async function func() {
            // await getArticlList(type,CurrentPage.current,keywords);

            scrollListener = throttle(scrollListener, 1000);
            document.addEventListener('scroll', scrollListener)
        }

        func();
        return function () {
            document.removeEventListener('scroll', scrollListener)
        }


    }, []);

    async function getArticlList(type, page,keywords) {
        try {
            if (page) {
                setLoadingText('正在加载');
                let res = await get(ipPort + '/default/articleList', {type, page,keywords});
                if (res.success) {
                    if (res.results.length === 10) {
                        //这里用于进行区分第一次默认获取的服务端渲染数据和后续的加载数据
                        list.current = list.current.length?[...list.current, ...res.results]:[...initialList, ...res.results];
                        setLoadingText('加载完毕')
                    } else {
                        list.current = list.current.length?[...list.current, ...res.results]:[...initialList, ...res.results];
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
                let res = await get(ipPort + '/default/articleList', {type,page,keywords});
                setLoading(false);
                if (res.success) {
                    if (res.results.length === 10) {
                        list.current = list.current.length?[...list.current, ...res.results]:[...initialList, ...res.results];
                        setLoadingText('加载完毕')
                    } else {
                        list.current = list.current.length?[...list.current, ...res.results]:[...initialList, ...res.results];
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
        props.router.push(`/detail?id=${id}`)
    };
    return (
        <Spin spinning={loading} >
            <div className="articleList">
                {(list.current.length>0?list.current:initialList).map(item => {
                    return <Row  className={'articleItem card'} key={item.id}>
                        <Col className={'cover'}><img src={ipPort+item.cover_path} alt="cover"/></Col>
                        <Col className="msg">
                            <a className={'title'} onClick={itemClick.bind('', item.id)}>{item.title}</a>
                            <span className={'introduce'}>{item.introduce}</span>
                            <div className={'date'}>
                                <span className={'hotNumber hot'}>{item.hot}</span>
                                <span className={'hotNumber createDate'}>{item.create_date?.slice(5)}</span>
                                <span className={'hotNumber update_date'}>{item.update_date?.slice(5)}</span>
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
