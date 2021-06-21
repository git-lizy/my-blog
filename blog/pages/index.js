import React from 'react'
import {withRouter} from 'next/router'
import Head from 'next/head'
import ArticleList from '../components/ArticleList'
import {get} from './../utils/requestUtil'
import ipPort from './../common/ipPort'


function Home(props) {

    const {initialList} = props;
    return (
        <>
            <Head>
                <title>首页 | 颖创 - 你见树，却未见森林</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="baidu-site-verification" content="code-ejaBp8EWBt" />
                <meta name='robots' content='all'/>
                <meta name='author' content='颖创'/>
                <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
                <meta name="keywords" content="颖创,博客,前端,web前端,html,html5,css,css3,javascript,js,vue,react,es6,node,webpack"/>
                <meta name="description"
                    content="颖创个人技术博客与学习笔记，专注于互联网web前端基础技术分享"/>
            </Head>
            <ArticleList
                path={props.router.asPath}
                initialList={initialList}
            />
        </>
    )
}

//服务端渲染获取初始数据
Home.getInitialProps = async () => {
    try {
        let res = await get(ipPort + '/default/articleList', {page: 1});
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
