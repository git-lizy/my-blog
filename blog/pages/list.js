import React from 'react'
import ArticleList from '../components/ArticleList'
import {withRouter} from 'next/router'
import Head from 'next/head'
import Qs from 'qs'
import {get} from "../utils/requestUtil";
import ipPort from "../common/ipPort";


function Home(props) {
    const {initialList} = props;

    return (
        <>
            <Head>
                <title>首页 | 铸心 - 你见树，却未见森林</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="baidu-site-verification" content="code-ejaBp8EWBt" />
                <meta name='robots' content='all'/>
                <meta name='author' content='铸心'/>
                <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
                <meta name="keywords" content="铸心,博客,前端,web前端,html,html5,css,css3,javascript,js,vue,react,es6,node,webpack"/>
                <meta name="description"
                      content="铸心个人技术博客与学习笔记，专注于互联网web前端基础技术分享"/>
            </Head>
            <ArticleList initialList={initialList} key={props.router.asPath} path={props.router.asPath}/>
        </>
    )
}

//服务端渲染获取初始数据
Home.getInitialProps = async (ctx) => {
    const {asPath: path} = ctx
    const jingHaoIndex = path.lastIndexOf('#') > -1 ? path.lastIndexOf('#') : false
    const query = path.lastIndexOf('?') > -1 ? Qs.parse(path.slice(path.lastIndexOf('?') + 1, jingHaoIndex ? jingHaoIndex : path.length)) : {};
    let type = path.startsWith('/list') ? query.type : undefined;
    let keywords = path.startsWith('/list') ? query.keywords : undefined;
    try {
        let res = await get(ipPort + '/default/articleList', {type, page: 1, keywords});
        if (res.success) {

            return {initialList: res.results}
        } else {
            return {initialList: []}
        }
    } catch (e) {
        return {initialList: []}
    }

}

export default withRouter(Home)
