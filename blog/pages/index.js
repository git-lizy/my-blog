import React, {useEffect, useRef, useState} from 'react'
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
                <title>铸心个人博客|专注于互联网web前端基础技术分享</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="keywords" content="铸心,博客,前端,web前端,html,css,javascript,vue,react,es6,node,webpack"/>
                <meta name="description" content="铸心个人技术博客于学习笔记，专注于互联网web前端基础技术分享,包括html,css,javascript,vue,react,es6,node,webpack等相关技术"/>
            </Head>
        <ArticleList
            path={props.router.asPath}
            initialList={initialList}
        />
        </>
    )
}

Home.getInitialProps = async()=>{
    try{
        let res = await get(ipPort + '/default/articleList', {page:1});
        if (res.success) {

            return {initialList:res.results}
        } else {
            return {initialList:[]}
        }
    }catch (e) {
        return {initialList:[]}
    }



}

export default withRouter(Home)
