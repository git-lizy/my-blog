import React, {useEffect, useRef, useState} from 'react'
import {Col, message, Row, Spin} from 'antd'
import {withRouter} from 'next/router'
import Qs from 'qs'
import {get} from '../../utils/requestUtil'
import "./style.scss"
import {debounce} from 'lodash'
import ipPort from '../../common/ipPort'


function articleList(props) {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('加载完毕');
    const {path} = props;
    const newList = useRef([]);
    const CurrentPage = useRef(1);
    const isEnd = useRef(false); //是否加载全部完毕
    let query = path.lastIndexOf('?') > -1 ? Qs.parse(path.slice(path.lastIndexOf('?') + 1)) : {};
    let type = path.startsWith('/list') ? query.type : undefined;

    //翻页处理
    let scrollListener = () => {
        if (!isEnd.current) {

            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const totalHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.offsetHeight;
            if (scrollTop + clientHeight >= totalHeight) {
                getArticlList(type, CurrentPage.current + 1);
                CurrentPage.current = CurrentPage.current + 1
            }
        }

    };
    useEffect(() => {
        // console.log('path',props.router)
        async function func() {
            await getArticlList(type);

            scrollListener = debounce(scrollListener, 1000);
            document.addEventListener('scroll', scrollListener)
        }

        func();
        return function () {
            document.removeEventListener('scroll', scrollListener)
        }


    }, []);

    async function getArticlList(type, page) {
        try {
            if (page) {
                setLoadingText('正在加载');
                let res = await get(ipPort + '/default/articleList', {type, page});
                if (res.success) {
                    if (res.results.length) {
                        setList([...newList.current, ...res.results]);
                        newList.current = [...newList.current, ...res.results];
                        setLoadingText('加载完毕')
                    } else {
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
                let res = await get(ipPort + '/default/articleList', {type});
                setLoading(false);
                if (res.success) {
                    setList(res.results);
                    newList.current = res.results;
                    setLoadingText('加载完毕')
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
        <Spin spinning={loading}>
            <div className="articleList">
                {list.map(item => {
                    return <Row  className={'articleItem card'} key={item.id}>
                        <Col className={'cover'}><img src="/icon/cover.jpg" alt=""/></Col>
                        <Col className="msg">
                            <a className={'title'} onClick={itemClick.bind('', item.id)}>{item.title}</a>
                            <span className={'introduce'}>{item.introduce}</span>
                            <div className={'date'}>
                                <span className={'hotNumber'}>浏览次数：{item.hot}</span>&nbsp;&nbsp;
                                <span className={'hotNumber'}>发布日期：{item.create_date}</span>&nbsp;&nbsp;
                                <span className={'hotNumber'}>更新日期：{item.update_date}</span>
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
